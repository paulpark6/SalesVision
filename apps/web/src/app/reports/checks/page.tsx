
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
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkPaymentsData as initialCheckPaymentsData, employees } from '@/lib/mock-data';
import type { CheckPayment, CheckStatus } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

export default function CheckReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [checkData, setCheckData] = useState<CheckPayment[]>(initialCheckPaymentsData);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role) return null;
    return employees.find(e => e.role === auth.role);
  }, [auth]);

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleStatusChange = (id: string, status: CheckStatus) => {
    const check = checkData.find(c => c.id === id);
    if (!check) return;
    
    setCheckData(prevData => prevData.map(c => c.id === id ? { ...c, status } : c));
    
    if (status === 'Confirmed') {
        toast({ title: 'Check Approved', description: `Check #${check.checkNumber} has been confirmed.` });
    } else if (status === 'Rejected') {
        toast({
            title: 'Check Rejected',
            description: `Check #${check.checkNumber} was rejected. A penalty may apply. Notifying manager and salesperson.`,
            variant: 'destructive',
        });
    }
  };

  const handleFieldChange = (id: string, field: keyof CheckPayment, value: string | Date | undefined) => {
    let finalValue = value;
    if (value instanceof Date) {
        finalValue = value.toISOString().split('T')[0];
    }
    setCheckData(prevData =>
      prevData.map(c => (c.id === id ? { ...c, [field]: finalValue } : c))
    );
  };


  const filteredCheckData = useMemo(() => {
    if (role === 'employee' && loggedInEmployee) {
      return checkData.filter(check => check.salesperson === loggedInEmployee.name);
    }
    return checkData;
  }, [role, loggedInEmployee, checkData]);
  
  const getStatusVariant = (status: CheckStatus) => {
    switch (status) {
        case 'Confirmed': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
    }
  }

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
                <h1 className="text-2xl font-semibold">수표 결제 보고서</h1>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>수표 결제 내역</CardTitle>
              <CardDescription>
                수취된 수표의 상세 내역입니다. 해당 내역은 관리자에게 보고되며, 오너(Admin)가 최종 확정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>수취일</TableHead>
                    <TableHead>만기일</TableHead>
                    {(role === 'admin' || role === 'manager') && <TableHead>영업담당자</TableHead>}
                    <TableHead>고객</TableHead>
                    <TableHead>발급은행</TableHead>
                    <TableHead>수표번호</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>입금은행</TableHead>
                    <TableHead>입금일자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCheckData.map((check) => (
                    <TableRow key={check.id} className={cn(check.status === 'Rejected' && 'bg-red-100/50 dark:bg-red-900/30')}>
                        <TableCell>{check.receiptDate}</TableCell>
                        <TableCell>{check.dueDate}</TableCell>
                        {(role === 'admin' || role === 'manager') && <TableCell>{check.salesperson}</TableCell>}
                        <TableCell>{check.customerName}</TableCell>
                        <TableCell>{check.issuingBank}</TableCell>
                        <TableCell>{check.checkNumber}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(check.amount)}</TableCell>
                        <TableCell>
                           {role === 'admin' ? (
                             <Input 
                               defaultValue={check.depositBank} 
                               className="h-8 w-32" 
                               onChange={(e) => handleFieldChange(check.id, 'depositBank', e.target.value)}
                             />
                           ) : (
                             check.depositBank
                           )}
                        </TableCell>
                        <TableCell>
                           {role === 'admin' ? (
                                <DatePicker 
                                    value={check.depositDate ? new Date(check.depositDate) : undefined}
                                    onSelect={(date) => handleFieldChange(check.id, 'depositDate', date)}
                                />
                            ) : (
                                check.depositDate
                            )}
                        </TableCell>
                         <TableCell>
                          {role === 'admin' && check.status === 'Pending' ? (
                            <div className="flex gap-1">
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:bg-green-100" onClick={() => handleStatusChange(check.id, 'Confirmed')}>
                                    <Check className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-100" onClick={() => handleStatusChange(check.id, 'Rejected')}>
                                    <X className="h-4 w-4" />
                               </Button>
                            </div>
                          ) : (
                            <Badge variant={getStatusVariant(check.status)}>{check.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                           {role !== 'employee' ? (
                            <Input defaultValue={check.notes} className="h-8 w-32" disabled={role === 'manager'} />
                           ) : (
                             check.notes
                           )}
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
