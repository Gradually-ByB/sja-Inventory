"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStock } from "@/app/actions";
import { toast } from "sonner";
import { TransactionType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface StockDialogProps {
    itemId: string;
    itemName: string;
    currentStock: number;
    type: TransactionType;
}

const OUTBOUND_DESTINATIONS = ["행정동", "PAC", "유/초등학교", "중/고등학교", "체육관", "기숙사"];

export function StockDialog({ itemId, itemName, currentStock, type }: StockDialogProps) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const isOut = type === "OUT";

    async function handleConfirm() {
        if (quantity <= 0) return;

        if (isOut && quantity > currentStock) {
            toast.error("재고가 부족합니다.");
            return;
        }

        setLoading(true);
        try {
            await updateStock(itemId, type, quantity, description);
            toast.success(`${isOut ? "출고" : "입고"}가 완료되었습니다.`);
            setOpen(false);
            setQuantity(1);
            setDescription("");
        } catch (error) {
            toast.error("처리에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 px-2.5 text-[11px] font-bold ${isOut
                            ? "text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-950/20"
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-950/20"
                        }`}
                >
                    {isOut ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownLeft className="mr-1 h-3 w-3" />}
                    {isOut ? "OUT" : "IN"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isOut ? "출고" : "입고"}: {itemName}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">수량</Label>
                        <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    {isOut && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">출고처</Label>
                            <Select onValueChange={setDescription}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="출고처 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {OUTBOUND_DESTINATIONS.map((dest) => (
                                        <SelectItem key={dest} value={dest}>
                                            {dest}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <Button onClick={handleConfirm} disabled={loading} className="w-full">
                    {loading ? "처리 중..." : "확인"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
