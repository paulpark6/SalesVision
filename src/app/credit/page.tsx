
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
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

type CustomerCredit = {
  customerName: string;
  total: number;
};

const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function CreditReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router, role]);
  
  const customerSummary = useMemo(() => {
    const summary: Record<string, number> = {};

    duePaymentsData.forEach(payment => {
      if (!summary[payment.customer.name]) {
        summary[payment.customer.name] = 0;
      }
      summary[payment.customer.name] += payment.amount;
    });

    return Object.entries(summary)
      .map(([customerName, total]) => ({ customerName, total }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const grandTotal = useMemo(() => {
    return customerSummary.reduce((acc, customer) => acc + customer.total, 0);
  }, [customerSummary]);


  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

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
                <h1 className="text-2xl font-semibold">Credit Report</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
             <div className="grid gap-4 md:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>고객별 총 미수금 현황</CardTitle>
                        <CardDescription>
                           고객별로 총 미수금 잔액을 표시합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>고객명</TableHead>
                                    <TableHead className="text-right">총 미수금</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerSummary.map(customer => (
                                    <TableRow key={customer.customerName}>
                                        <TableCell className="font-medium">{customer.customerName}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(customer.total)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="font-bold">총계</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(grandTotal)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
