
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
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';

type GroupedSales = {
    [date: string]: {
        sales: typeof cashSalesData;
        total: number;
    };
};

export default function CashReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role) return null;
    return employees.find(e => e.role === auth.role);
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

  const groupedSales = useMemo(() => {
    return filteredSalesData.reduce((acc: GroupedSales, sale) => {
      const date = sale.date;
      if (!acc[date]) {
        acc[date] = { sales: [], total: 0 };
      }
      acc[date].sales.push(sale);
      acc[date].total += sale.amount;
      return acc;
    }, {});
  }, [filteredSalesData]);
  
  const sortedDates = useMemo(() => Object.keys(groupedSales).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [groupedSales]);
  
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
                <h1 className="text-2xl font-semibold">일별 현금 결제 보고서</h1>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>현금 결제 내역</CardTitle>
              <CardDescription>
                일별 현금 결제 합계 및 고객별 상세 내역입니다. 관리자는 전체 직원의 내역을 확인할 수 있습니다.
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
                    <TableHead className="w-[200px]">날짜</TableHead>
                    <TableHead className="text-right">일일 합계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDates.map((date) => {
                      const isOpen = openCollapsible === date;
                      return (
                        <Fragment key={date}>
                          <TableRow onClick={() => setOpenCollapsible(isOpen ? null : date)} className="cursor-pointer">
                             <TableCell>
                                <div className="flex items-center gap-2">
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                    <span className="font-medium">{date}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(groupedSales[date].total)}</TableCell>
                          </TableRow>
                          {isOpen && (
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                              <TableCell colSpan={2} className="p-0">
                                  <div className="p-4">
                                      <Table>
                                          <TableHeader>
                                              <TableRow>
                                                { (role === 'admin' || role === 'manager') && <TableHead>담당 직원</TableHead> }
                                                <TableHead>고객명</TableHead>
                                                <TableHead className="text-right">금액</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                                {groupedSales[date].sales.map(sale => (
                                                    <TableRow key={sale.id}>
                                                        { (role === 'admin' || role === 'manager') && <TableCell>{sale.employeeName}</TableCell> }
                                                        <TableCell>{sale.customerName}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                          </TableBody>
                                      </Table>
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
                        <TableCell className="text-right font-bold">
                            {formatCurrency(Object.values(groupedSales).reduce((sum, day) => sum + day.total, 0))}
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
