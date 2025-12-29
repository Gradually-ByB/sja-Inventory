"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { StockDialog } from "@/components/stock-dialog";
import { ItemForm } from "@/components/item-form";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ItemImage } from "@/components/item-image";
import { deleteItem } from "@/app/actions";
import { toast } from "sonner";

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "imageUrl",
        header: "이미지",
        cell: ({ row }) => (
            <ItemImage
                src={row.getValue("imageUrl")}
                alt={row.original.name}
                size="lg"
                className="group-hover:scale-110 border-2"
            />
        )
    },
    {
        accessorKey: "name",
        header: "품명",
        cell: ({ row }) => (
            <span className="text-lg font-bold tracking-tight">{row.getValue("name")}</span>
        )
    },
    {
        accessorKey: "category",
        header: "카테고리",
        cell: ({ row }) => (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-lg px-2.5 py-0.5 border-none font-bold text-xs uppercase tracking-wider">
                {row.getValue("category")}
            </Badge>
        ),
    },
    {
        accessorKey: "unit",
        header: "단위",
        cell: ({ row }) => <span className="font-bold text-muted-foreground/60">{row.getValue("unit")}</span>
    },
    {
        accessorKey: "currentStock",
        header: "현재고",
        cell: ({ row }) => {
            const stock = row.getValue("currentStock") as number;
            return (
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                        {stock}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "location",
        header: "위치",
        cell: ({ row }) => <span className="font-bold text-muted-foreground/80 lowercase">{row.getValue("location")}</span>
    },
    {
        accessorKey: "description",
        header: "비고",
        cell: ({ row }) => <span className="text-sm text-muted-foreground/70">{row.getValue("description")}</span>
    },
    {
        id: "actions",
        header: "관리",
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    <StockDialog itemId={item.id} itemName={item.name} currentStock={item.currentStock} type="IN" />
                    <StockDialog itemId={item.id} itemName={item.name} currentStock={item.currentStock} type="OUT" />

                    <ItemForm
                        item={item}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 shadow-none border-none">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-200 shadow-none border-none"
                        onClick={async () => {
                            if (confirm("정말 이 품목을 삭제하시겠습니까?")) {
                                try {
                                    await deleteItem(item.id);
                                    toast.success("품목이 삭제되었습니다.");
                                } catch (error) {
                                    toast.error("삭제 중 오류가 발생했습니다.");
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
