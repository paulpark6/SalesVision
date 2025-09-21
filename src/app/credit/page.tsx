
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
import { customerData } from '@/lib/mock-data';

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
};

const totalCredit = customerData.reduce((sum, customer) => sum + customer.creditBalance, 0);

export default function CreditManagementPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (!role || role !== 'admin') {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Credit Management</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
             <div className="grid gap-4 md:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>고객별 총 신용 잔액</CardTitle>
                        <CardDescription>
                            각 고객의 총 미수금 잔액을 표시합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>고객명</TableHead>
                                    <TableHead>담당 직원</TableHead>
                                    <TableHead className="text-right">총 신용 잔액</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerData.sort((a,b) => b.creditBalance - a.creditBalance).map(customer => (
                                    <TableRow key={customer.customerCode}>
                                        <TableCell>
                                            <div className="font-medium">{customer.customerName}</div>
                                            <div className="text-sm text-muted-foreground">{customer.customerCode}</div>
                                        </TableCell>
                                        <TableCell>{customer.employee}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(customer.creditBalance)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="font-bold">총계</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(totalCredit)}</TableCell>
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
