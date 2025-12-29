"use server";

import { db } from "@/lib/db";
import { TransactionType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { format, subDays, startOfDay, endOfDay, isWeekend } from "date-fns";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function getItems(query?: string) {
    const where = query
        ? {
            OR: [
                { name: { contains: query, mode: "insensitive" as const } },
                { category: { contains: query, mode: "insensitive" as const } },
            ],
        }
        : {};

    return db.item.findMany({
        where: where as any, // Temporary workaround for complex IDE type inference issues with Prisma 5.22
        orderBy: { name: "asc" },
    });
}

export async function createItem(data: {
    name: string;
    category: string;
    unit: string;
    location: string;
    currentStock: number;
    imageUrl?: string | null;
    description?: string | null;
}) {
    try {
        await db.item.create({
            data,
        });
        revalidatePath("/");
    } catch (error) {
        console.error("createItem Error:", error);
        throw error;
    }
}

export async function uploadFile(formData: FormData): Promise<string> {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const name = uuidv4() + path.extname(file.name);
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, name);
    await writeFile(filePath, buffer);

    return `/uploads/${name}`;
}

export async function updateItem(
    id: string,
    data: {
        name: string;
        category: string;
        unit: string;
        location: string;
        currentStock: number;
        imageUrl?: string | null;
        description?: string | null;
    }
) {
    try {
        await db.item.update({
            where: { id },
            data,
        });
        revalidatePath("/");
    } catch (error) {
        console.error("updateItem Error:", error);
        throw error;
    }
}

export async function updateStock(
    itemId: string,
    type: TransactionType,
    quantity: number,
    description?: string
) {
    // Use a transaction to ensure data integrity
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
        const item = await tx.item.findUnique({ where: { id: itemId } });
        if (!item) throw new Error("Item not found");

        const newStock =
            type === "IN" ? item.currentStock + quantity : item.currentStock - quantity;

        if (newStock < 0) throw new Error("Stock cannot be negative");

        await tx.item.update({
            where: { id: itemId },
            data: { currentStock: newStock },
        });

        await tx.transaction.create({
            data: {
                itemId,
                type,
                quantity,
                description,
            },
        });
    });

    revalidatePath("/");
}

export async function batchUpdateStock(
    itemId: string,
    type: TransactionType,
    quantity: number,
    descriptions: string[]
) {
    if (type !== "OUT") throw new Error("Batch update only supported for OUT transactions");

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
        const item = await tx.item.findUnique({ where: { id: itemId } });
        if (!item) throw new Error("Item not found");

        const totalQuantity = quantity * descriptions.length;
        const newStock = item.currentStock - totalQuantity;

        if (newStock < 0) throw new Error("Insufficient stock for batch update");

        await tx.item.update({
            where: { id: itemId },
            data: { currentStock: newStock },
        });

        const transactionData = descriptions.map(desc => ({
            itemId,
            type,
            quantity,
            description: desc,
        }));

        await tx.transaction.createMany({
            data: transactionData,
        });
    });

    revalidatePath("/");
}

export async function getTransactions(type?: TransactionType) {
    return db.transaction.findMany({
        where: type ? { type } : {},
        include: {
            item: true
        },
        orderBy: { createdAt: "desc" },
        take: 50
    });
}

export async function deleteItem(id: string) {
    try {
        await db.item.delete({ where: { id } });
        revalidatePath("/");
    } catch (error) {
        console.error("deleteItem Error:", error);
        throw error;
    }
}

export async function getDailyStockOutSummary(startDate?: Date, endDate?: Date) {
    const where: any = { type: "OUT" };

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
    }

    const transactions = await db.transaction.findMany({
        where,
        include: { item: true },
        orderBy: { createdAt: "desc" },
    });

    const grouped = transactions.reduce((acc, curr) => {
        const date = format(new Date(curr.createdAt), "yyyy-MM-dd");
        const itemId = curr.itemId;
        const key = `${date}_${itemId}`;

        if (!acc[key]) {
            acc[key] = {
                date,
                item: curr.item,
                totalQuantity: 0,
            };
        }

        acc[key].totalQuantity += curr.quantity;
        return acc;
    }, {} as Record<string, { date: string; item: any; totalQuantity: number }>);

    return Object.values(grouped).sort((a, b: any) => b.date.localeCompare(a.date));
}

export async function getWeeklyStockOutSummary(): Promise<{ date: string; total: number }[]> {
    const businessDays: Date[] = [];
    let current = new Date();

    while (businessDays.length < 5) {
        if (!isWeekend(current)) {
            businessDays.push(new Date(current));
        }
        current = subDays(current, 1);
    }
    businessDays.reverse();

    const startDate = startOfDay(businessDays[0]);
    const endDate = endOfDay(businessDays[businessDays.length - 1]);

    const transactions = await db.transaction.findMany({
        where: {
            type: "OUT",
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { createdAt: "asc" },
    });

    const dailyTotals = businessDays.reduce((acc, d) => {
        const date = format(d, "MM/dd");
        acc[date] = 0;
        return acc;
    }, {} as Record<string, number>);

    transactions.forEach((t) => {
        const date = format(new Date(t.createdAt), "MM/dd");
        if (dailyTotals[date] !== undefined) {
            dailyTotals[date] += t.quantity;
        }
    });

    return Object.entries(dailyTotals).map(([date, total]) => ({
        date,
        total: total as number,
    }));
}

export async function updateTransaction(
    transactionId: string,
    data: {
        quantity: number;
        description: string;
        createdAt?: Date;
    }
) {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Get the original transaction
        const transaction = await tx.transaction.findUnique({
            where: { id: transactionId },
            include: { item: true }
        });

        if (!transaction) throw new Error("Transaction not found");

        // 2. Revert the stock change from the original transaction
        let stockAfterRevert = transaction.item.currentStock;
        if (transaction.type === "IN") {
            stockAfterRevert -= transaction.quantity;
        } else {
            stockAfterRevert += transaction.quantity;
        }

        // 3. Apply the new stock change
        let finalStock = stockAfterRevert;
        if (transaction.type === "IN") {
            finalStock += data.quantity;
        } else {
            finalStock -= data.quantity;
        }

        // 4. Validate stock
        if (finalStock < 0) throw new Error("수정 후 재고가 0보다 작을 수 없습니다.");

        // 5. Update item stock
        await tx.item.update({
            where: { id: transaction.itemId },
            data: { currentStock: finalStock }
        });

        // 6. Update transaction
        await tx.transaction.update({
            where: { id: transactionId },
            data: {
                quantity: data.quantity,
                description: data.description,
                createdAt: data.createdAt // Allow updating date if provided
            }
        });
    });

    revalidatePath("/");
}

export async function deleteTransaction(transactionId: string) {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
        const transaction = await tx.transaction.findUnique({
            where: { id: transactionId },
            include: { item: true }
        });

        if (!transaction) throw new Error("Transaction not found");

        // Revert stock change
        let newStock = transaction.item.currentStock;
        if (transaction.type === "IN") {
            newStock -= transaction.quantity;
        } else {
            newStock += transaction.quantity;
        }

        if (newStock < 0) throw new Error("삭제 후 재고가 0보다 작을 수 없습니다.");

        await tx.item.update({
            where: { id: transaction.itemId },
            data: { currentStock: newStock }
        });

        await tx.transaction.delete({
            where: { id: transactionId }
        });
    });

    revalidatePath("/");
}
