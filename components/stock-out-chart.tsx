"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";

interface ChartData {
    date: string;
    total: number;
}

interface StockOutChartProps {
    data: ChartData[];
}

import { useState, useEffect } from "react";

export function StockOutChart({ data }: StockOutChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10 h-[320px]">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold italic tracking-widest animate-pulse">
                    LOADING TREND...
                </div>
            </Card>
        );
    }

    return (
        <Card className="premium-shadow border-border bg-card overflow-hidden h-full">
            <CardHeader className="px-6 py-0 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold tracking-tight">일별 출고 현황</CardTitle>
                    <p className="text-xs text-muted-foreground">최근 5일간 출고 추이 (주말 제외)</p>
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 500, fill: "var(--muted-foreground)" }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 500, fill: "var(--muted-foreground)" }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar
                                dataKey="total"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === data.length - 1 ? "var(--primary)" : "oklch(0.8 0.01 240)"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
