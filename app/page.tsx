import { getItems, getTransactions, getDailyStockOutSummary, getWeeklyStockOutSummary } from "./actions";
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
    <div className="min-h-screen bg-background premium-gradient flex flex-col font-sans selection:bg-primary/10">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <a
              href="https://gwa.jdcpartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src={logo}
                alt="SJA Partners Logo"
                priority
                className="h-10 w-auto object-contain"
              />
            </a>
            <div className="h-6 w-px bg-border hidden md:block" />

          </div>

        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-center md:text-left">재고 관리 대시보드</h2>
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">국제학교지원처 환경팀 소모품 및 입출고 현황 </p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-3">
            <DatePickerSingle />
          </div>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <div className="w-full overflow-x-auto pb-1 scrollbar-hide">
            <TabsList className="inline-flex h-10 w-full md:w-auto items-center justify-start md:justify-center rounded-md bg-muted p-1 text-muted-foreground whitespace-nowrap">
              <TabsTrigger value="inventory" className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                전체 재고
              </TabsTrigger>
              <TabsTrigger value="stock-in" className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                입고 기록
              </TabsTrigger>
              <TabsTrigger value="stock-out" className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                출고 기록
              </TabsTrigger>
              <TabsTrigger value="daily-summary" className="flex-1 md:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                일별 요약
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column (PC) / Top (Mobile): Main Content */}
            <div className="order-1 lg:order-1 lg:col-span-3 space-y-6">
              <TabsContent value="inventory" className="mt-0 outline-none">
                <Card className="premium-shadow border-border mt-0 overflow-hidden bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">전체 품목 현황</CardTitle>
                  </CardHeader>
                  <div className="p-0">
                    <DataTable columns={columns} data={items} />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="stock-in" className="mt-0 outline-none">
                <Card className="premium-shadow border-border mt-0 overflow-hidden bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">입고 상세 내역</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={transactionColumns} data={inTransactions} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stock-out" className="mt-0 outline-none">
                <Card className="premium-shadow border-border mt-0 overflow-hidden bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">출고 상세 내역</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={transactionColumns} data={outTransactions} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="daily-summary" className="mt-0 outline-none">
                <Card className="premium-shadow border-border mt-0 overflow-hidden bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">일별 출고 데이터</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DataTable columns={dailySummaryColumns} data={dailySummary} hideAddButton hideFilter filterColumn="item.name" />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right Column (PC) / Bottom (Mobile): Chart */}
            <div className="order-2 lg:order-2 space-y-6">
              <StockOutChart data={weeklySummary} />
            </div>
          </div>
        </Tabs>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t mt-auto">
        <p>© 2025 SJA Partners 환경팀 • Modern Inventory Solution</p>
      </footer>
    </div>
  );
}
