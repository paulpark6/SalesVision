
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
import { duePaymentsData, employees } from '@/lib/mock-data';
import { differenceInDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { OverdueDetailsDialog } from '@/components/reports/overdue-details-dialog';
import type { DuePayment } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users } from 'lucide-react';


type CustomerCredit = {
  customerName: string;
  employeeId: string;
  nearing: number; // 만기 전
  due: number; // 도래 예정 (2주 내)
  overdue: number; // 만기 후
  total: number;
  collectedAmount: number;
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
  const loggedInEmployeeId = auth?.userId;
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showMyCollections, setShowMyCollections] = useState(false);
  const [collectedAmounts, setCollectedAmounts] = useState<Record<string, number>>({});

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

  const customerSummary = useMemo(() => {
    const summary: Record<string, Omit<CustomerCredit, 'customerName'>> = {};

    duePaymentsData.forEach(payment => {
      if (!summary[payment.customer.name]) {
        summary[payment.customer.name] = { 
            employeeId: payment.employeeId,
            nearing: 0, 
            due: 0, 
            overdue: 0, 
            total: 0,
            collectedAmount: collectedAmounts[payment.customer.name] || 0 
        };
      }

      const status = getStatus(payment.dueDate);
      summary[payment.customer.name][status] += payment.amount;
      summary[payment.customer.name].total += payment.amount;
    });

    return Object.entries(summary)
      .map(([customerName, data]) => ({ customerName, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [collectedAmounts]);
  
  const filteredCustomerSummary = useMemo(() => {
    if (role === 'admin' && showMyCollections) {
      return customerSummary.filter(c => c.employeeId === loggedInEmployeeId);
    }
    return customerSummary;
  }, [customerSummary, role, showMyCollections, loggedInEmployeeId]);


  const overdueDetails = useMemo(() => {
    if (!selectedCustomer) return [];
    return duePaymentsData.filter(p => p.customer.name === selectedCustomer && getStatus(p.dueDate) === 'overdue');
  }, [selectedCustomer]);

  const grandTotals = useMemo(() => {
    return filteredCustomerSummary.reduce(
      (acc, customer) => {
        acc.nearing += customer.nearing;
        acc.due += customer.due;
        acc.overdue += customer.overdue;
        acc.total += customer.total;
        acc.collectedAmount += customer.collectedAmount;
        return acc;
      },
      { nearing: 0, due: 0, overdue: 0, total: 0, collectedAmount: 0 }
    );
  }, [filteredCustomerSummary]);
  
  const totalMyCollections = useMemo(() => {
      if (!loggedInEmployeeId) return 0;
      return customerSummary
        .filter(c => c.employeeId === loggedInEmployeeId)
        .reduce((sum, cust) => sum + cust.collectedAmount, 0)
  }, [customerSummary, loggedInEmployeeId]);
  
  const totalAllCollections = useMemo(() => {
      return customerSummary.reduce((sum, cust) => sum + cust.collectedAmount, 0)
  }, [customerSummary]);


  const handleCollectionChange = (customerName: string, amount: string) => {
    const newAmount = parseFloat(amount) || 0;
    setCollectedAmounts(prev => ({
        ...prev,
        [customerName]: newAmount
    }));
  };

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
                       {role === 'admin' && (
                          <div className="flex items-center space-x-2 pt-4">
                              <Users className="h-4 w-4" />
                              <Label htmlFor="my-collections-filter">내 수금내역만 보기</Label>
                              <Switch
                                  id="my-collections-filter"
                                  checked={showMyCollections}
                                  onCheckedChange={setShowMyCollections}
                              />
                          </div>
                        )}
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
                           {role === 'admin' && <TableHead className="text-right w-[150px]">수금액 (당월)</TableHead>}
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredCustomerSummary.map(customer => (
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
                              {role === 'admin' && (
                                <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="h-8 text-right"
                                        value={customer.collectedAmount || ''}
                                        onChange={(e) => handleCollectionChange(customer.customerName, e.target.value)}
                                    />
                                </TableCell>
                              )}
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
                           {role === 'admin' && (
                                <TableCell className="text-right font-bold">{formatCurrency(grandTotals.collectedAmount)}</TableCell>
                           )}
                          </TableRow>
                      </TableFooter>
                      </Table>
                      {role === 'admin' && !showMyCollections && (
                        <div className="flex justify-end gap-6 font-bold text-base mt-6 pr-4 border-t pt-4">
                            <span>본인 수금 합계: {formatCurrency(totalMyCollections)}</span>
                            <span>전체 수금 합계: {formatCurrency(totalAllCollections)}</span>
                        </div>
                      )}
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

    