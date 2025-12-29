"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createItem, updateItem, uploadFile } from "@/app/actions";
import { toast } from "sonner";
import { Item } from "@prisma/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "품명을 입력해주세요"),
    category: z.string().min(1, "분류를 선택해주세요"),
    unit: z.string().min(1, "단위를 선택해주세요"),
    location: z.string().min(1, "보관위치를 입력해주세요"),
    currentStock: z.coerce.number().min(0, "재고는 0 이상이어야 합니다"),
    imageUrl: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
    item?: Item;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function ItemForm({ item, open, onOpenChange, trigger }: ItemFormProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isControlled = open !== undefined;
    const showOpen = isControlled ? open : internalOpen;
    const setShowOpen = isControlled ? onOpenChange! : setInternalOpen;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: item?.name ?? "",
            category: item?.category ?? "소모품",
            unit: item?.unit ?? "개",
            location: item?.location ?? "창고",
            currentStock: item?.currentStock ?? 0,
            imageUrl: item?.imageUrl ?? "",
            description: item?.description ?? "",
        },
    });

    // Reset form values when the dialog is opened or the item changes
    useEffect(() => {
        if (showOpen) {
            form.reset({
                name: item?.name ?? "",
                category: item?.category ?? "소모품",
                unit: item?.unit ?? "개",
                location: item?.location ?? "창고",
                currentStock: item?.currentStock ?? 0,
                imageUrl: item?.imageUrl ?? "",
                description: item?.description ?? "",
            });
        }
    }, [showOpen, item, form]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl || null);

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        try {
            let finalImageUrl = values.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                finalImageUrl = await uploadFile(formData);
            }

            const finalValues = { ...values, imageUrl: finalImageUrl };

            if (item) {
                await updateItem(item.id, finalValues);
                toast.success("품목 정보가 수정되었습니다.");
            } else {
                await createItem(finalValues);
                toast.success("새 품목이 등록되었습니다.");
            }
            setShowOpen(false);
            if (!item) {
                form.reset();
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("저장 오류:", error);
            toast.error("저장에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={showOpen} onOpenChange={setShowOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{item ? "품목 수정" : "새 품목 추가"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                        <div className="grid gap-2.5 pt-1">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">품명</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="예: 수세미(양면)"
                                                    className="h-10 bg-slate-50 border-slate-200"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">분류</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                                        <SelectValue placeholder="분류 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="청소용품">청소용품</SelectItem>
                                                    <SelectItem value="소모품">소모품</SelectItem>
                                                    <SelectItem value="세탁실">세탁실</SelectItem>
                                                    <SelectItem value="기타">기타</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">단위</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                                        <SelectValue placeholder="단위 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="개">개</SelectItem>
                                                    <SelectItem value="박스">박스</SelectItem>
                                                    <SelectItem value="100리터">100리터</SelectItem>
                                                    <SelectItem value="50리터">50리터</SelectItem>
                                                    <SelectItem value="30리터">30리터</SelectItem>
                                                    <SelectItem value="20리터">20리터</SelectItem>
                                                    <SelectItem value="막지">막지</SelectItem>
                                                    <SelectItem value="통">통</SelectItem>
                                                    <SelectItem value="장">장</SelectItem>
                                                    <SelectItem value="매">매</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currentStock"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">현재고</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="h-10 bg-slate-50 border-slate-200"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">보관위치</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                                        <SelectValue placeholder="보관위치 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="창고">창고</SelectItem>
                                                    <SelectItem value="세탁실">세탁실</SelectItem>
                                                    <SelectItem value="기타">기타</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold text-slate-700">비고 (메모)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="간단한 메모"
                                                    className="h-10 bg-slate-50 border-slate-200"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-[1fr,60px] gap-3 items-end pt-1">
                                <div className="space-y-1.5">
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">상품 이미지 (URL입력 / 파일업로드)</FormLabel>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ImageIcon className="h-3 w-3 text-slate-400" />
                                        </div>
                                        <Input
                                            placeholder="이미지 URL 직접 입력 (선택)"
                                            className="h-10 pl-8 text-xs bg-slate-50/50 border-slate-200 text-slate-500"
                                            disabled={isSubmitting}
                                            {...form.register('imageUrl')}
                                            onChange={(e) => {
                                                form.setValue('imageUrl', e.target.value);
                                                setPreviewUrl(e.target.value);
                                                setSelectedFile(null);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div
                                        className="w-[60px] h-[10] relative group cursor-pointer border border-dashed border-slate-200 rounded-md overflow-hidden bg-slate-50/50 transition-all hover:border-primary/40 hover:bg-slate-100/50 flex flex-col items-center justify-center min-h-[40px]"
                                        style={{ height: '40px' }}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button type="button" variant="destructive" size="icon" className="h-5 w-5 rounded-full" onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFile(null);
                                                        setPreviewUrl(null);
                                                        form.setValue('imageUrl', '');
                                                    }}>
                                                        <X className="w-2.5 h-2.5" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-2">
                                                <Upload className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">업로드</span>
                                            </div>
                                        )}
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "저장 중..." : item ? "정보 수정 완료" : "신규 품목 저장하기"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
