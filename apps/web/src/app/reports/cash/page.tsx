
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { cashSalesData, employees } from '@/lib/mock-data';
import type { CashSale } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

type GroupedDailySales = {
    [date: string]: {
        sales: CashSale[];
        total: number;
    };
};

type GroupedWeeklySales = {
    [week: string]: {
        sales: CashSale[];
        total: number;
        startDate: Date;
        endDate: Date;
        dailyTotals: GroupedDailySales;
    };
};


export default function CashReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role || !auth?.name) return null;
    return employees.find(e => e.name === auth.name);
  }, [auth]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredSalesData = useMemo(() => {
    if (role === 'employee' && loggedInEmployee) {
      return cashSalesData.filter(sale => sale.employeeName === loggedInEmployee.name);
    }
    return cashSalesData;
  }, [role, loggedInEmployee]);

  const weeklyGroupedSales = useMemo(() => {
    const sortedData = [...filteredSalesData].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedData.reduce((acc: GroupedWeeklySales, sale) => {
      const saleDate = parseISO(sale.date);
      const weekStart = startOfWeek(saleDate, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(saleDate, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!acc[weekKey]) {
        acc[weekKey] = { sales: [], total: 0, startDate: weekStart, endDate: weekEnd, dailyTotals: {} };
      }
      
      acc[weekKey].sales.push(sale);
      acc[weekKey].total += sale.amount;

      // Group by day within the week
      const dateKey = sale.date;
      if(!acc[weekKey].dailyTotals[dateKey]) {
        acc[weekKey].dailyTotals[dateKey] = { sales: [], total: 0 };
      }
      acc[weekKey].dailyTotals[dateKey].sales.push(sale);
      acc[weekKey].dailyTotals[dateKey].total += sale.amount;
      
      // Sort daily sales
      acc[weekKey].dailyTotals[dateKey].sales.sort((a,b) => {
        if(a.source < b.source) return -1;
        if(a.source > b.source) return 1;
        return 0;
      });

      return acc;
    }, {});
  }, [filteredSalesData]);
  
  const sortedWeeks = useMemo(() => Object.keys(weeklyGroupedSales).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [weeklyGroupedSales]);
  
  let cumulativeTotal = 0;

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">주별 현금 결제 보고서</h1>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>주간 현금 결제 내역</CardTitle>
              <CardDescription>
                주별 현금 결제 합계 및 상세 내역입니다. 현금 출처는 '현금 판매'와 '신용 수금'으로 구분됩니다.
              </CardDescription>
               <div className="flex items-end gap-4 pt-2">
                <div className="grid gap-2">
                    <Label htmlFor="date">조회 기간</Label>
                    <div className="flex items-center gap-2">
                        <DatePicker />
                        <span>~</span>
                        <DatePicker />
                    </div>
                </div>
                <Button>
                    조회
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">주</TableHead>
                    <TableHead className="text-right">주간 합계</TableHead>
                    <TableHead className="text-right">누적 합계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWeeks.map((weekKey) => {
                      const weekData = weeklyGroupedSales[weekKey];
                      cumulativeTotal += weekData.total;
                      const isOpen = openCollapsible === weekKey;
                      const weekLabel = `${format(weekData.startDate, 'MMM d')} - ${format(weekData.endDate, 'MMM d, yyyy')}`;

                      return (
                        <Fragment key={weekKey}>
                          <TableRow onClick={() => setOpenCollapsible(isOpen ? null : weekKey)} className="cursor-pointer">
                             <TableCell>
                                <div className="flex items-center gap-2">
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                    <span className="font-medium">{weekLabel}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(weekData.total)}</TableCell>
                             <TableCell className="text-right font-semibold">{formatCurrency(cumulativeTotal)}</TableCell>
                          </TableRow>
                          {isOpen && (
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                              <TableCell colSpan={3} className="p-0">
                                  <div className="p-4 space-y-4">
                                    {Object.keys(weekData.dailyTotals).sort((a,b) => new Date(a).getTime() - new Date(b).getTime()).map(dateKey => (
                                      <div key={dateKey}>
                                        <h4 className="font-semibold text-sm mb-2">{format(parseISO(dateKey), 'EEEE, MMM d')} - {formatCurrency(weekData.dailyTotals[dateKey].total)}</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                  { (role === 'admin' || role === 'manager') && <TableHead>담당 직원</TableHead> }
                                                  <TableHead>고객명</TableHead>
                                                  <TableHead>구분</TableHead>
                                                  <TableHead className="text-right">금액</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                  {weekData.dailyTotals[dateKey].sales.map(sale => (
                                                      <TableRow key={sale.id}>
                                                          { (role === 'admin' || role === 'manager') && <TableCell>{sale.employeeName}</TableCell> }
                                                          <TableCell>{sale.customerName}</TableCell>
                                                          <TableCell>{sale.source}</TableCell>
                                                          <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                                                      </TableRow>
                                                  ))}
                                            </TableBody>
                                        </Table>
                                      </div>
                                    ))}
                                  </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                  )})}
                </TableBody>
                 <TableFooter>
                    <TableRow>
                        <TableCell className="font-bold">총 합계</TableCell>
                        <TableCell className="text-right font-bold" colSpan={2}>
                            {formatCurrency(Object.values(weeklyGroupedSales).reduce((sum, week) => sum + week.total, 0))}
                        </TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
