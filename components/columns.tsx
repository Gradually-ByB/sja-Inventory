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
        header: () => <div className="text-left pl-8 w-full">품명</div>,
        cell: ({ row }) => {
            const category = row.original.category;
            const getCategoryColor = (cat: string) => {
                if (cat.includes("소모품")) return "bg-sky-50 text-sky-600 border-sky-100";
                if (cat.includes("위생")) return "bg-orange-50 text-orange-600 border-orange-100";
                if (cat.includes("세제")) return "bg-emerald-50 text-emerald-600 border-emerald-100";
                return "bg-slate-50 text-slate-500 border-slate-100";
            };
            return (
                <div className="flex flex-col items-start pl-8">
                    <span className="text-sm font-bold text-slate-800 leading-tight">{row.getValue("name")}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md mt-1.5 border ${getCategoryColor(category)}`}>
                        {category}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "currentStock",
        header: () => <div className="text-center w-full">재고/단위</div>,
        cell: ({ row }) => {
            const stock = row.getValue("currentStock") as number;
            const unit = row.original.unit;
            const isLow = stock <= 10;
            return (
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-base font-black tabular-nums tracking-tighter ${isLow ? 'text-rose-500' : 'text-slate-800'}`}>
                            {stock}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">{unit}</span>
                    </div>
                    {isLow && (
                        <div className="flex items-center gap-1 mt-1 font-black text-[9px] text-rose-500 uppercase tracking-widest animate-pulse">
                            ⚠️ 재고 부족
                        </div>
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
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold px-3 py-1 rounded-lg border-slate-100 text-[11px]">
                    {row.getValue("location")}
                </Badge>
            </div>
        )
    },
    {
        id: "actions",
        header: () => <div className="text-center w-full">관리</div>,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center gap-2">
                    <StockDialog 
                        itemId={item.id} 
                        itemName={item.name} 
                        currentStock={item.currentStock} 
                        type="IN" 
                        trigger={
                            <Button size="sm" variant="outline" className="h-8 px-2.5 rounded-lg border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider">
                                ↓ IN
                            </Button>
                        }
                    />
                    <StockDialog 
                        itemId={item.id} 
                        itemName={item.name} 
                        currentStock={item.currentStock} 
                        type="OUT" 
                        trigger={
                            <Button size="sm" variant="outline" className="h-8 px-2.5 rounded-lg border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider">
                                ↑ OUT
                            </Button>
                        }
                    />
                    <div className="w-px h-4 bg-slate-100 mx-2" />
                    <ItemForm
                        item={item}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                        }
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
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
