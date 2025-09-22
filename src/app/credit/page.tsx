
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users, Check, X } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CollectionStatus = 'pending' | 'confirmed' | 'rejected' | 'none';

type CustomerCredit = {
  customerName: string;
  employeeId: string;
  nearing: number; // 만기 전
  due: number; // 도래 예정 (2주 내)
  overdue: number; // 만기 후
  total: number;
  collectedAmount: number;
  collectionDate?: Date;
  collectionStatus: CollectionStatus;
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
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showMyCollections, setShowMyCollections] = useState(false);
  const [customerCreditData, setCustomerCreditData] = useState<CustomerCredit[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    const summary: Record<string, Omit<CustomerCredit, 'customerName'>> = {};

    duePaymentsData.forEach(payment => {
      if (!summary[payment.customer.name]) {
        summary[payment.customer.name] = { 
            employeeId: payment.employeeId,
            nearing: 0, 
            due: 0, 
            overdue: 0, 
            total: 0,
            collectedAmount: 0,
            collectionDate: undefined,
            collectionStatus: 'none',
        };
      }

      const status = getStatus(payment.dueDate);
      summary[payment.customer.name][status] += payment.amount;
      summary[payment.customer.name].total += payment.amount;
    });

    const initialData = Object.entries(summary)
      .map(([customerName, data]) => ({ customerName, ...data }))
      .sort((a, b) => b.total - a.total);
      
    setCustomerCreditData(initialData);

  }, []);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const filteredCustomerSummary = useMemo(() => {
    if (role === 'admin' && showMyCollections) {
      return customerCreditData.filter(c => c.employeeId === loggedInEmployeeId);
    }
    return customerCreditData;
  }, [customerCreditData, role, showMyCollections, loggedInEmployeeId]);


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
        if(customer.collectionStatus === 'confirmed') {
            acc.collectedAmount += customer.collectedAmount;
        }
        return acc;
      },
      { nearing: 0, due: 0, overdue: 0, total: 0, collectedAmount: 0 }
    );
  }, [filteredCustomerSummary]);
  
  const totalMyCollections = useMemo(() => {
      if (!loggedInEmployeeId) return 0;
      return customerCreditData
        .filter(c => c.employeeId === loggedInEmployeeId && c.collectionStatus === 'confirmed')
        .reduce((sum, cust) => sum + cust.collectedAmount, 0)
  }, [customerCreditData, loggedInEmployeeId]);
  
  const totalAllCollections = useMemo(() => {
      return customerCreditData
        .filter(c => c.collectionStatus === 'confirmed')
        .reduce((sum, cust) => sum + cust.collectedAmount, 0)
  }, [customerCreditData]);


  const handleCollectionChange = (customerName: string, field: 'collectedAmount' | 'collectionDate', value: number | Date | undefined) => {
      setCustomerCreditData(prev => 
        prev.map(c => {
            if (c.customerName === customerName) {
                const updatedCustomer = { ...c };
                if (field === 'collectedAmount') {
                    updatedCustomer.collectedAmount = value as number || 0;
                }
                if (field === 'collectionDate') {
                    updatedCustomer.collectionDate = value as Date | undefined;
                }
                // If we change the value, it should go back to 'none' status until submitted
                if (updatedCustomer.collectionStatus === 'confirmed' || updatedCustomer.collectionStatus === 'rejected') {
                    updatedCustomer.collectionStatus = 'none';
                }
                return updatedCustomer;
            }
            return c;
        })
      );
  };
  
  const handleSubmitForApproval = (customerName: string) => {
    const customer = customerCreditData.find(c => c.customerName === customerName);
    if (!customer || !customer.collectedAmount || !customer.collectionDate) {
        toast({
            title: '입력 오류',
            description: '수금액과 수금일을 모두 입력해야 합니다.',
            variant: 'destructive',
        });
        return;
    }

    setCustomerCreditData(prev => prev.map(c => c.customerName === customerName ? { ...c, collectionStatus: 'pending'} : c));
    toast({
        title: '제출 완료',
        description: '수금 내역이 관리자에게 보고되었습니다.',
    });
  }
  
  const handleApprovalAction = (customerName: string, action: 'confirmed' | 'rejected') => {
    setCustomerCreditData(prev => prev.map(c => c.customerName === customerName ? { ...c, collectionStatus: action } : c));
    toast({
        title: `수금 내역 ${action === 'confirmed' ? '확정' : '반려'}`,
        description: `해당 고객의 수금 내역이 ${action === 'confirmed' ? '확정' : '반려'}되었습니다.`,
    });
  };

  const getStatusBadge = (status: CollectionStatus) => {
    switch (status) {
        case 'pending': return <Badge variant="secondary">Pending</Badge>;
        case 'confirmed': return <Badge variant="default" className='bg-green-600 hover:bg-green-700'>Confirmed</Badge>;
        case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
        default: return <span className="text-xs text-muted-foreground">-</span>;
    }
  }


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
                      <div className="overflow-x-auto">
                        <Table className="min-w-max">
                        <TableHeader>
                            <TableRow>
                            <TableHead>고객명</TableHead>
                            <TableHead className="text-right">만기 전</TableHead>
                            <TableHead className="text-right">도래 예정 (2주 내)</TableHead>
                            <TableHead className="text-right">연체</TableHead>
                            <TableHead className="w-[150px]">수금액</TableHead>
                            <TableHead className="w-[200px]">수금일</TableHead>
                            <TableHead className="text-center w-[120px]">상태</TableHead>
                            <TableHead className="text-right">총 신용 잔액</TableHead>
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
                                <TableCell>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="h-8 text-right"
                                        value={customer.collectedAmount || ''}
                                        onChange={(e) => handleCollectionChange(customer.customerName, 'collectedAmount', parseFloat(e.target.value))}
                                        disabled={role === 'admin' && customer.collectionStatus === 'pending'}
                                    />
                                </TableCell>
                                 <TableCell>
                                    <DatePicker
                                        value={customer.collectionDate}
                                        onSelect={(date) => handleCollectionChange(customer.customerName, 'collectionDate', date)}
                                        disabled={role === 'admin' && customer.collectionStatus === 'pending'}
                                    />
                                </TableCell>
                                 <TableCell className="text-center">
                                    {role === 'admin' && customer.collectionStatus === 'pending' ? (
                                        <div className="flex gap-1 justify-center">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:bg-green-100" onClick={() => handleApprovalAction(customer.customerName, 'confirmed')}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-100" onClick={() => handleApprovalAction(customer.customerName, 'rejected')}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            {getStatusBadge(customer.collectionStatus)}
                                            {role !== 'admin' && customer.collectionStatus === 'none' && customer.collectedAmount > 0 && (
                                                <Button size="sm" className="h-7" onClick={() => handleSubmitForApproval(customer.customerName)}>제출</Button>
                                            )}
                                        </div>
                                    )}
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
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.collectedAmount)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.total)}</TableCell>
                            </TableRow>
                        </TableFooter>
                        </Table>
                      </div>
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
