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
        <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10 h-full">
            <CardHeader className="bg-primary/5 border-b border-primary/10 px-6 py-4">
                <div>
                    <CardTitle className="text-xl font-black text-primary tracking-tight">일별 출고 현황</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">최근 5일간 출고 추이 (주말 제외)</p>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-[220px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fontWeight: 600, fill: "#64748B" }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fontWeight: 600, fill: "#64748B" }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    padding: '12px 16px'
                                }}
                            />
                            <Bar
                                dataKey="total"
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === data.length - 1 ? "#10B981" : "#94A3B8"}
                                        fillOpacity={index === data.length - 1 ? 1 : 0.6}
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
