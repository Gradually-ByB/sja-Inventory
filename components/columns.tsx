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
        header: () => <div className="text-center w-full">이미지</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ItemImage
                    src={row.getValue("imageUrl")}
                    alt={row.original.name}
                    size="md"
                    className="border rounded-md shadow-sm"
                />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: () => <div className="text-center w-full">품명</div>,
        cell: ({ row }) => (
            <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-foreground leading-none">{row.getValue("name")}</span>
                <span className="text-[11px] text-muted-foreground mt-1">{row.original.category}</span>
            </div>
        )
    },
    {
        accessorKey: "currentStock",
        header: () => <div className="text-center w-full">재고/단위</div>,
        cell: ({ row }) => {
            const stock = row.getValue("currentStock") as number;
            const unit = row.original.unit;
            return (
                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-bold tabular-nums ${stock < 5 ? 'text-destructive' : 'text-foreground'}`}>
                            {stock}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">{unit}</span>
                    </div>
                    {stock < 5 && (
                        <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase font-black rounded-sm border-none">
                            Low
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "location",
        header: () => <div className="text-center w-full">위치</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="text-sm font-normal text-muted-foreground">
                    {row.getValue("location")}
                </span>
            </div>
        )
    },
    {
        id: "actions",
        header: () => <div className="text-center w-full">관리</div>,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center gap-1">
                    <StockDialog itemId={item.id} itemName={item.name} currentStock={item.currentStock} type="IN" />
                    <StockDialog itemId={item.id} itemName={item.name} currentStock={item.currentStock} type="OUT" />
                    <div className="w-px h-4 bg-border mx-1" />
                    <ItemForm
                        item={item}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                        }
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                            if (confirm("삭제하시겠습니까?")) {
                                try {
                                    await deleteItem(item.id);
                                    toast.success("삭제되었습니다.");
                                } catch (error) {
                                    toast.error("오류 발생");
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
    },
];
