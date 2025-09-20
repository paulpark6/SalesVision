
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
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { checkPaymentsData, employees } from '@/lib/mock-data';
import type { CheckPayment } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';

export default function CheckReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role) return null;
    return employees.find(e => e.role === auth.role);
  }, [auth]);

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredCheckData = useMemo(() => {
    if (role === 'employee' && loggedInEmployee) {
      return checkPaymentsData.filter(check => check.salesperson === loggedInEmployee.name);
    }
    return checkPaymentsData;
  }, [role, loggedInEmployee]);
  
  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">수표 결제 보고서</h1>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>수표 결제 내역</CardTitle>
              <CardDescription>
                수취된 수표의 상세 내역입니다. 해당 내역은 관리자에게 보고됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수취일자</TableHead>
                    {(role === 'admin' || role === 'manager') && <TableHead>영업담당자</TableHead>}
                    <TableHead>고객</TableHead>
                    <TableHead>발급은행</TableHead>
                    <TableHead>수표번호</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>예정 Deposit 일자</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCheckData.map((check) => (
                    <TableRow key={check.id}>
                        <TableCell>{check.receiptDate}</TableCell>
                        {(role === 'admin' || role === 'manager') && <TableCell>{check.salesperson}</TableCell>}
                        <TableCell>{check.customerName}</TableCell>
                        <TableCell>{check.issuingBank}</TableCell>
                        <TableCell>{check.checkNumber}</TableCell>
                        <TableCell className="text-right">{formatCurrency(check.amount)}</TableCell>
                        <TableCell>{check.depositDate}</TableCell>
                        <TableCell>
                            <Input defaultValue={check.notes} className="h-8" />
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
