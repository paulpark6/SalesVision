
'use client';
import { MoreHorizontal, Download } from 'lucide-react';
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
  TableFooter,
} from '@/components/ui/table';
import { duePaymentsData as initialDuePaymentsData } from '@/lib/mock-data';
import { differenceInDays, parseISO } from 'date-fns';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

type CustomerCredit = {
  customerName: string;
  nearing: number;
  due: number;
  overdue: number;
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


export function DuePaymentsTable() {
    const { toast } = useToast();
    
    const customerSummary = useMemo(() => {
        const summary: Record<string, Omit<CustomerCredit, 'customerName'>> = {};

        initialDuePaymentsData.forEach(payment => {
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


    const handleExportOverdue = () => {
        const overduePayments = initialDuePaymentsData
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
        link.setAttribute('download', 'overdue_payments.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: '다운로드 시작',
            description: '연체 내역 CSV 파일이 다운로드됩니다.',
        });
    };


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>고객별 미수금 요약</CardTitle>
          <CardDescription>
            고객별 미수금 현황을 만기 상태에 따라 요약합니다.
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
              <TableHead>고객명</TableHead>
              <TableHead className="text-right">만기 전</TableHead>
              <TableHead className="text-right">만기 임박</TableHead>
              <TableHead className="text-right">연체</TableHead>
              <TableHead className="text-right">총 미수금</TableHead>
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
                        <Badge variant="destructive">{formatCurrency(customer.overdue)}</Badge>
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
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.due)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.overdue)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.total)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}

