import { getItems, getTransactions, getDailyStockOutSummary, getWeeklyStockOutSummary, getDashboardStats } from "./actions";
import { StockOutChart } from "@/components/stock-out-chart";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { transactionColumns } from "@/components/transaction-columns";
import { dailySummaryColumns } from "@/components/daily-summary-columns";
import { DatePickerSingle } from "@/components/date-picker-single";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import logo from "./images/logo.png";
import { format, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Bell, BellRing, BarChart as BarChartIcon } from "lucide-react";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const dateStr = typeof params.date === "string" ? params.date : undefined;
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const [items, inTransactions, outTransactions, dailySummary, weeklySummary, stats] = await Promise.all([
    getItems(),
    getTransactions("IN"),
    getTransactions("OUT"),
    getDailyStockOutSummary(start, end),
    getWeeklyStockOutSummary(),
    getDashboardStats()
  ]);

  const lowStockItems = items.filter(i => i.currentStock <= 10).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-teal-100">
      <nav className="w-full bg-slate-50/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="SJA Partners Logo" priority className="h-10 w-auto object-contain" />
          <span className="text-2xl font-black text-teal-600 tracking-tight scale-y-[1.1]">재고 관리 대시보드</span>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="bg-transparent border-none gap-4 p-0 h-auto">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-slate-200 text-slate-500 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-slate-100">전체 재고</TabsTrigger>
            <TabsTrigger value="stock-in" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-slate-200 text-slate-500 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-slate-100">입고 기록</TabsTrigger>
            <TabsTrigger value="stock-out" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-slate-200 text-slate-500 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-slate-100">출고 기록</TabsTrigger>
            <TabsTrigger value="daily-summary" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-slate-200 text-slate-500 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-slate-100">일별 요약</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              <TabsContent value="inventory" className="mt-0 outline-none">
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Package className="w-5 h-5 text-teal-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">전체 품목 현황</CardTitle>
                    </div>
                    
                    <Suspense fallback={<div className="h-10 w-40 animate-pulse bg-slate-100 rounded-xl" />}>
                      <DatePickerSingle />
                    </Suspense>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={columns} data={items} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock-in" className="mt-0 outline-none">
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">입고 상세 내역</CardTitle>
                    </div>

                    <Suspense fallback={<div className="h-10 w-40 animate-pulse bg-slate-100 rounded-xl" />}>
                      <DatePickerSingle />
                    </Suspense>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={transactionColumns} data={inTransactions} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock-out" className="mt-0 outline-none">
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-rose-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">출고 상세 내역</CardTitle>
                    </div>

                    <Suspense fallback={<div className="h-10 w-40 animate-pulse bg-slate-100 rounded-xl" />}>
                      <DatePickerSingle />
                    </Suspense>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={transactionColumns} data={outTransactions} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="daily-summary" className="mt-0 outline-none">
                <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <BarChartIcon className="w-5 h-5 text-teal-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">일별 출고 데이터</CardTitle>
                    </div>

                    <Suspense fallback={<div className="h-10 w-40 animate-pulse bg-slate-100 rounded-xl" />}>
                      <DatePickerSingle />
                    </Suspense>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={dailySummaryColumns} data={dailySummary} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right Side Column */}
            <div className="lg:col-span-4 space-y-6">
              <StockOutChart data={weeklySummary} height="320px" />

              <Card className="border-none shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="px-6 py-4 border-b border-slate-50 flex flex-row items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <BellRing className="w-4 h-4 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">재고 부족 알림</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {lowStockItems.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">재고 부족 품목이 없습니다.</p>
                  ) : (
                    <div className="space-y-4">
                      {lowStockItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between group">
                          <span className="text-sm font-bold text-slate-700">{item.name}</span>
                          <span className="text-sm font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{item.currentStock} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </main>

      <footer className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-auto">
        <p>© 2026 JDCPartners 국제학교지원처 환경팀 • Modern Inventory Solution</p>
      </footer>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, color }: { title: string; value: number; icon: React.ReactNode; iconBg: string; color: string }) {
  return (
    <Card className="border-none shadow-lg shadow-slate-100/50 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-800 tracking-tighter">{value}</span>
          </div>
        </div>
        <div className={`p-3.5 rounded-2xl ${iconBg} shadow-inner transition-transform group-hover:rotate-12`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
