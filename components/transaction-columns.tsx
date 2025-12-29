"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ItemImage } from "@/components/item-image";
import { TransactionEditDialog } from "@/components/transaction-edit-dialog";

export const transactionColumns: ColumnDef<any>[] = [
    {
        accessorKey: "item.imageUrl",
        header: "이미지",
        cell: ({ row }) => (
            <ItemImage
                src={row.original.item.imageUrl}
                alt={row.original.item.name}
                size="sm"
            />
        )
    },
    {
        accessorKey: "createdAt",
        header: "일시",
        cell: ({ row }) => {
            return format(new Date(row.getValue("createdAt")), "yyyy-MM-dd");
        },
    },
    {
        accessorKey: "item.name",
        header: "품명",
        cell: ({ row }) => <span className="font-bold">{row.original.item.name}</span>
    },
    {
        accessorKey: "type",
        header: "구분",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant={type === "IN" ? "default" : "destructive"}>
                    {type === "IN" ? "입고" : "출고"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "item.unit",
        header: "단위",
        cell: ({ row }) => <span className="text-xs text-muted-foreground font-bold">{row.original.item.unit}</span>
    },
    {
        accessorKey: "quantity",
        header: "수량",
        cell: ({ row }) => {
            return <span className="font-bold">{row.getValue("quantity")}</span>;
        },
    },
    {
        accessorKey: "description",
        header: "비고란",
    },
    {
        id: "actions",
        header: "관리",
        cell: ({ row }) => {
            return (
                <TransactionEditDialog
                    transaction={row.original}
                />
            );
        },
    },
];
