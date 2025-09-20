
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
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { customerData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getYearlySales = (customer: typeof customerData[0], year: number) => {
    const sale = customer.yearlySales.find(s => s.year === year);
    return sale ? formatCurrency(sale.amount) : '-';
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">고객 관리</h1>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>고객 목록</CardTitle>
              <CardDescription>
                담당 직원별 고객 목록, 매출 및 신용 현황입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>담당 직원</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead className="text-right">실제 월 매출</TableHead>
                    <TableHead className="text-right">월 평균 매출</TableHead>
                    <TableHead className="text-right">연 매출 (2024)</TableHead>
                    <TableHead className="text-right">연 매출 (2023)</TableHead>
                    <TableHead className="text-right">신용 잔액 (9월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => (
                      <TableRow key={customer.customerCode}>
                        <TableCell>
                           <div className="font-medium">{customer.employee}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.customerCode}
                          </div>
                        </TableCell>
                         <TableCell>
                          <Badge variant="secondary">{customer.customerGrade}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customer.monthlySales.actual)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customer.monthlySales.average)}
                        </TableCell>
                        <TableCell className="text-right">
                          {getYearlySales(customer, 2024)}
                        </TableCell>
                        <TableCell className="text-right">
                          {getYearlySales(customer, 2023)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(customer.creditBalance)}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    