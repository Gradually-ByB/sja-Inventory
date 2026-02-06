"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ItemImage } from "@/components/item-image";
import { TransactionEditDialog } from "@/components/transaction-edit-dialog";

export const transactionColumns: ColumnDef<any>[] = [
    {
        accessorKey: "item.imageUrl",
        header: () => <div className="text-center w-full">이미지</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ItemImage
                    src={row.original.item.imageUrl}
                    alt={row.original.item.name}
                    size="sm"
                    className="rounded-md border"
                />
            </div>
        )
    },
    {
        accessorKey: "item.name",
        header: () => <div className="text-center w-full">품명</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="text-sm font-semibold">{row.original.item.name}</span>
            </div>
        )
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center w-full">수량/단위</div>,
        cell: ({ row }) => (
            <div className="text-center flex items-baseline justify-center gap-1">
                <span className="text-sm font-bold tabular-nums">{row.getValue("quantity")}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{row.original.item.unit}</span>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-center w-full">날짜</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <span className="text-xs text-muted-foreground font-medium">
                    {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className="text-center w-[120px] mx-auto">비고</div>,
        cell: ({ row }) => (
            <div className="text-center w-[120px] mx-auto">
                <span className="text-xs text-muted-foreground italic truncate block">
                    {row.getValue("description") || "-"}
                </span>
            </div>
        )
    },
    {
        id: "actions",
        header: () => <div className="text-center w-full">수정</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <TransactionEditDialog transaction={row.original} />
            </div>
        ),
    },
];
