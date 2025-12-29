"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ItemImage } from "@/components/item-image";

export const dailySummaryColumns: ColumnDef<any>[] = [
    {
        accessorKey: "date",
        header: "일자",
    },
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
        accessorKey: "item.name",
        header: "품명",
        cell: ({ row }) => <span className="font-bold">{row.original.item.name}</span>
    },
    {
        accessorKey: "item.unit",
        header: "단위",
        cell: ({ row }) => <span className="text-xs text-muted-foreground font-bold">{row.original.item.unit}</span>
    },
    {
        accessorKey: "totalQuantity",
        header: "총 출고 수량",
        cell: ({ row }) => {
            return (
                <span className="font-bold text-destructive">
                    {row.getValue("totalQuantity")}
                </span>
            );
        },
    },
];
