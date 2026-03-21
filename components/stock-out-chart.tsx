"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface ChartData {
    date: string;
    total: number;
}

interface StockOutChartProps {
    data: ChartData[];
    height?: string;
}

export function StockOutChart({ data, height = "200px" }: StockOutChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden h-[300px]">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold italic tracking-widest animate-pulse">
                    LOADING TREND...
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="px-6 py-4 border-none flex flex-row items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <BarChartIcon className="w-4 h-4 text-teal-600" />
                </div>
                <div className="space-y-0.5">
                    <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">일별 출고 현황</CardTitle>
                    <p className="text-[11px] font-medium text-slate-400">최근 5일간 출고 내역 (주말 제외)</p>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div style={{ height }} className="w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 500, fill: "#94A3B8" }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 500, fill: "#94A3B8" }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(13, 148, 136, 0.05)' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
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
                                        fill={index === data.length - 1 ? "#0D9488" : "#99F6E4"}
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
