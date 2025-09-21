
'use client';
import { MoreHorizontal, Download, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { duePaymentsData as initialDuePaymentsData } from '@/lib/mock-data';
import type { DuePayment } from '@/lib/mock-data';
import { differenceInDays, parseISO } from 'date-fns';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { CollectionPlanDialog } from './collection-plan-dialog';

const getStatus = (dueDate: string): 'overdue' | 'due' | 'nearing' => {
  const due = parseISO(dueDate);
  const today = new Date();
  const daysDiff = differenceInDays(due, today);

  if (daysDiff < 0) return 'overdue';
  if (daysDiff <= 14) return 'due';
  return 'nearing';
};

const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


export function DuePaymentsTable() {
    const { toast } = useToast();
    const [duePaymentsData, setDuePaymentsData] = useState(initialDuePaymentsData);
    const [selectedPayment, setSelectedPayment] = useState<DuePayment | null>(null);

    const handleExportOverdue = () => {
        const overduePayments = duePaymentsData
            .filter(p => getStatus(p.dueDate) === 'overdue')
            .map(p => ({
                '담당자': p.employee,
                '고객명': p.customer.name,
                '고객 이메일': p.customer.email,
                '만기일': p.dueDate,
                '금액': p.amount,
                '수금 활동 내용': p.collectionPlan || '없음',
            }));

        if (overduePayments.length === 0) {
            toast({
                title: '연체 내역 없음',
                description: '내보낼 연체된 결제 항목이 없습니다.',
            });
            return;
        }

        const csv = Papa.unparse(overduePayments);
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'overdue_payments_with_plans.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: '다운로드 시작',
            description: '연체 내역 CSV 파일이 다운로드됩니다.',
        });
    };
    
    const handleSavePlan = (paymentId: string, plan: string) => {
        setDuePaymentsData(prevData =>
            prevData.map(p => (p.id === paymentId ? { ...p, collectionPlan: plan } : p))
        );
        setSelectedPayment(null);
        toast({
            title: "수금 계획 제출 완료",
            description: "수금 계획이 관리자에게 성공적으로 제출되었습니다.",
        })
    };


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>연체 및 만기 도래 미수금</CardTitle>
          <CardDescription>
            연체되었거나 곧 만기가 도래하는 미수금 목록입니다.
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" className="ml-auto gap-1" onClick={handleExportOverdue}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Overdue as CSV</span>
            <span className="inline sm:hidden">Export</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead>만기일</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>수금 계획</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duePaymentsData.filter(p => getStatus(p.dueDate) !== 'nearing').map((payment) => {
              const status = getStatus(payment.dueDate);
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{payment.customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.customer.email}
                    </div>
                  </TableCell>
                  <TableCell>{payment.employee}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={status === 'overdue' ? 'destructive' : 'secondary'} className={status === 'due' ? 'bg-yellow-500/80 text-black' : ''}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     {status === 'overdue' ? (
                        <div className="flex items-center gap-2">
                            <span className="truncate max-w-28">{payment.collectionPlan || '-'}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPayment(payment)}>
                                <Pencil className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        '-'
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {selectedPayment && (
        <CollectionPlanDialog
          isOpen={!!selectedPayment}
          onOpenChange={(isOpen) => !isOpen && setSelectedPayment(null)}
          payment={selectedPayment}
          onSave={handleSavePlan}
        />
      )}
    </>
  );
}
