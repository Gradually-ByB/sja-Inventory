"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ko } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

export function DatePickerSingle({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = React.useState(false);

    const dateParam = searchParams.get("date");
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        dateParam ? new Date(dateParam) : new Date()
    );

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("date", format(date, "yyyy-MM-dd"));
            router.push(`?${params.toString()}`, { scroll: false });
            setOpen(false);
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ko })
                        ) : (
                            <span>날짜를 선택하세요</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        initialFocus
                        locale={ko}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
