
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
  TableFooter,
} from '@/components/ui/table';
import { duePaymentsData } from '@/lib/mock-data';
import { differenceInDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { OverdueDetailsDialog } from '@/components/reports/overdue-details-dialog';
import type { DuePayment } from '@/lib/mock-data';


type CustomerCredit = {
  customerName: string;
  nearing: number; // 만기 전
  due: number; // 도래 예정 (2주 내)
  overdue: number; // 만기 후
  total: number;
};

const getStatus = (dueDate: string): 'overdue' | 'due' | 'nearing' => {
  const due = parseISO(dueDate);
  const today = new Date();
  const daysDiff = differenceInDays(due, today);

  if (daysDiff < 0) return 'overdue';
  if (daysDiff <= 14) return 'due';
  return 'nearing';
};

const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CreditReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router, role]);
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const customerSummary = useMemo(() => {
    const summary: Record<string, Omit<CustomerCredit, 'customerName'>> = {};

    duePaymentsData.forEach(payment => {
      if (!summary[payment.customer.name]) {
        summary[payment.customer.name] = { nearing: 0, due: 0, overdue: 0, total: 0 };
      }

      const status = getStatus(payment.dueDate);
      summary[payment.customer.name][status] += payment.amount;
      summary[payment.customer.name].total += payment.amount;
    });

    return Object.entries(summary)
      .map(([customerName, data]) => ({ customerName, ...data }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const overdueDetails = useMemo(() => {
    if (!selectedCustomer) return [];
    return duePaymentsData.filter(p => p.customer.name === selectedCustomer && getStatus(p.dueDate) === 'overdue');
  }, [selectedCustomer]);

  const grandTotals = useMemo(() => {
    return customerSummary.reduce(
      (acc, customer) => {
        acc.nearing += customer.nearing;
        acc.due += customer.due;
        acc.overdue += customer.overdue;
        acc.total += customer.total;
        return acc;
      },
      { nearing: 0, due: 0, overdue: 0, total: 0 }
    );
  }, [customerSummary]);


  if (!role) {
    return null;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-semibold">Credit Report</h1>
                   <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
              </div>
               <Card>
                  <CardHeader>
                      <CardTitle>고객별 신용 현황</CardTitle>
                      <CardDescription>
                          전체 고객의 신용 잔액을 만기 상태별로 요약합니다. 연체 금액을 클릭하여 상세 내역을 확인하세요.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>고객명</TableHead>
                          <TableHead className="text-right">만기 전</TableHead>
                          <TableHead className="text-right">도래 예정 (2주 내)</TableHead>
                          <TableHead className="text-right">연체</TableHead>
                          <TableHead className="text-right">총 신용 잔액</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {customerSummary.map(customer => (
                          <TableRow key={customer.customerName}>
                              <TableCell className="font-medium">{customer.customerName}</TableCell>
                              <TableCell className="text-right">{formatCurrency(customer.nearing)}</TableCell>
                              <TableCell className="text-right">
                                  {customer.due > 0 ? (
                                      <Badge variant="default" className="bg-yellow-500/80 hover:bg-yellow-500/90 text-black">
                                          {formatCurrency(customer.due)}
                                      </Badge>
                                  ) : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                  {customer.overdue > 0 ? (
                                      <Badge 
                                        variant="destructive" 
                                        onClick={() => setSelectedCustomer(customer.customerName)}
                                        className="cursor-pointer"
                                      >
                                        {formatCurrency(customer.overdue)}
                                      </Badge>
                                  ) : '-'}
                              </TableCell>
                              <TableCell className="text-right font-semibold">{formatCurrency(customer.total)}</TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                          <TableRow>
                          <TableCell className="font-bold">총계</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(grandTotals.nearing)}</TableCell>
                          <TableCell className="text-right font-bold">
                               <Badge variant="default" className="bg-yellow-500/80 hover:bg-yellow-500/90 text-black">
                                  {formatCurrency(grandTotals.due)}
                              </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                              <Badge variant="destructive">{formatCurrency(grandTotals.overdue)}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(grandTotals.total)}</TableCell>
                          </TableRow>
                      </TableFooter>
                      </Table>
                  </CardContent>
              </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
      
      <OverdueDetailsDialog
        isOpen={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
        customerName={selectedCustomer || ''}
        payments={overdueDetails}
      />
    </>
  );
}
