"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ItemImage } from "@/components/item-image";

export const dailySummaryColumns: ColumnDef<any>[] = [
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
        accessorKey: "totalQuantity",
        header: () => <div className="text-center w-full">출고량/단위</div>,
        cell: ({ row }) => (
            <div className="text-center flex items-baseline justify-center gap-1">
                <span className="text-sm font-bold tabular-nums text-rose-600 dark:text-rose-400">
                    {row.getValue("totalQuantity")}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">{row.original.item.unit}</span>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: () => <div className="text-center w-full">요약 일자</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <span className="text-xs text-muted-foreground font-medium">{row.getValue("date")}</span>
            </div>
        ),
    },
];
