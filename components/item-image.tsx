"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ItemImageProps {
    src?: string | null;
    alt: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function ItemImage({ src, alt, size = "md", className }: ItemImageProps) {
    const sizeClasses = {
        sm: "w-10 h-10 rounded-lg",
        md: "w-12 h-12 rounded-xl",
        lg: "w-14 h-14 rounded-2xl",
    };

    return (
        <div className={cn(
            "overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative mx-auto transition-transform duration-300",
            sizeClasses[size],
            className
        )}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="text-[10px] text-slate-300 font-bold text-center uppercase tracking-tighter">No Pic</div>
            )}
        </div>
    );
}
