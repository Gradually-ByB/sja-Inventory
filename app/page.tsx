import { getItems, getTransactions, getDailyStockOutSummary, getWeeklyStockOutSummary } from "./actions";
import { StockOutChart } from "@/components/stock-out-chart";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { transactionColumns } from "@/components/transaction-columns";
import { dailySummaryColumns } from "@/components/daily-summary-columns";
import { DatePickerSingle } from "@/components/date-picker-single";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import logo from "./images/logo1.png";
import { startOfDay, endOfDay } from "date-fns";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const targetDate = params.date ? new Date(params.date as string) : new Date();
  const from = startOfDay(targetDate);
  const to = endOfDay(targetDate);

  const [items, inTransactions, outTransactions, dailySummary, weeklySummary] = await Promise.all([
    getItems(),
    getTransactions("IN"),
    getTransactions("OUT"),
    getDailyStockOutSummary(from, to),
    getWeeklyStockOutSummary()
  ]);

  return (
    <div className="min-h-screen bg-background premium-gradient flex flex-col font-sans">
      <nav className="sticky top-0 z-50 w-full glass">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="relative">
                <Image
                  src={logo}
                  alt="SJA Partners Logo"
                  priority
                  width={150}
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            환경팀 재고 대시보드
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            실시간 재고 현황과 출고 트렌드를 한눈에 파악하세요.
          </p>
        </header>

        <Tabs defaultValue="inventory" className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="glass p-1 h-auto gap-1 rounded-2xl">
              <TabsTrigger value="inventory" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all duration-300">
                전체 재고
              </TabsTrigger>
              <TabsTrigger value="stock-in" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all duration-300">
                입고 내역
              </TabsTrigger>
              <TabsTrigger value="stock-out" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all duration-300">
                출고 내역
              </TabsTrigger>
              <TabsTrigger value="daily-summary" className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all duration-300">
                일별 상세 현황
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* 70% Left Section */}
            <div className="lg:col-span-7">
              <TabsContent value="inventory" className="mt-0 outline-none">
                <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-2xl lg:text-3xl font-black tracking-tight">전체 물품 목록</span>
                      <div className="text-sm font-bold text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
                        물품갯수:&nbsp;&nbsp;{items.length}개
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-8">
                      <DataTable columns={columns} data={items} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock-in" className="mt-0 outline-none">
                <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                    <CardTitle className="text-2xl lg:text-3xl font-black text-primary tracking-tight">입고 내역</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-8">
                      <DataTable columns={transactionColumns} data={inTransactions} hideAddButton hideFilter filterColumn="item.name" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock-out" className="mt-0 outline-none">
                <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                    <CardTitle className="text-2xl lg:text-3xl font-black text-primary tracking-tight">출고 내역</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-8">
                      <DataTable columns={transactionColumns} data={outTransactions} hideAddButton hideFilter filterColumn="item.name" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="daily-summary" className="mt-0 outline-none">
                <Card className="border-none premium-shadow bg-card/80 backdrop-blur-sm overflow-hidden rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl lg:text-3xl font-black text-primary tracking-tight">일별 상세 현황</CardTitle>
                      <div className="flex items-center gap-2">
                        <DatePickerSingle />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-8">
                      <DataTable columns={dailySummaryColumns} data={dailySummary} hideAddButton hideFilter filterColumn="item.name" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* 30% Right Section (Sticky) */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit space-y-8">
              <StockOutChart data={weeklySummary} />
            </div>
          </div>
        </Tabs>
      </main>

      <footer className="py-10 text-center text-sm text-muted-foreground border-t bg-muted/30">
        <p className="font-medium">© 2025 SJA Partners 환경팀. All rights reserved.</p>
      </footer>
    </div>
  );
}
