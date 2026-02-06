"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTransaction, deleteTransaction } from "@/app/actions";
import { toast } from "sonner";
import { Transaction, Item } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionEditDialogProps {
    transaction: Transaction & { item: Item };
    trigger?: React.ReactNode;
}

const OUTBOUND_DESTINATIONS = ["행정동", "PAC", "유/초등학교", "중/고등학교", "체육관", "기숙사"];

export function TransactionEditDialog({ transaction, trigger }: TransactionEditDialogProps) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState<number>(transaction.quantity);
    const [description, setDescription] = useState(transaction.description || "");
    const [date, setDate] = useState<Date>(new Date(transaction.createdAt));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setQuantity(transaction.quantity);
            setDescription(transaction.description || "");
            setDate(new Date(transaction.createdAt));
        }
    }, [open, transaction]);

    const isOut = transaction.type === "OUT";

    async function handleConfirm() {
        if (quantity <= 0) return;

        setLoading(true);
        try {
            await updateTransaction(transaction.id, {
                quantity,
                description,
                createdAt: date,
            });
            toast.success("수정이 완료되었습니다.");
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "처리에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("정말 이 내역을 삭제하시겠습니까? 재고가 원복됩니다.")) return;

        setLoading(true);
        try {
            await deleteTransaction(transaction.id);
            toast.success("내역이 삭제되었습니다.");
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-1 items-start">
                        <span>{isOut ? "출고" : "입고"} 내역 수정</span>
                        <Badge variant={isOut ? "destructive" : "default"} className="text-base font-normal">
                            {transaction.item.name}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">날짜</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "col-span-3 justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => d && setDate(d)}
                                    initialFocus
                                    locale={ko}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
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
                    {isOut ? (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">출고처</Label>
                            <Select value={description} onValueChange={setDescription}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="출고처 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {OUTBOUND_DESTINATIONS.map((dest) => (
                                        <SelectItem key={dest} value={dest}>
                                            {dest}
                                        </SelectItem>
                                    ))}
                                    {/* Keep existing description if it's not in the list (legacy support) */}
                                    {!OUTBOUND_DESTINATIONS.includes(description) && description && (
                                        <SelectItem value={description}>{description}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">비고</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDelete} disabled={loading} className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading} className="flex-1">
                        {loading ? "처리 중..." : "수정 완료"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

