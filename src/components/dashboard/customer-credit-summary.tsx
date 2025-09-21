
'use client';
import { useMemo } from 'react';
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

type CustomerCredit = {
  customerName: string;
  employee: string;
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

export function CustomerCreditSummary() {
  const customerSummary = useMemo(() => {
    const summary: Record<string, Omit<CustomerCredit, 'customerName'>> = {};

    duePaymentsData.forEach(payment => {
      if (!summary[payment.customer.name]) {
        summary[payment.customer.name] = { employee: payment.employee, nearing: 0, due: 0, overdue: 0, total: 0 };
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>고객별 미수금 요약</CardTitle>
        <CardDescription>
          고객별 미수금 현황을 만기 상태에 따라 요약합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>고객명</TableHead>
              <TableHead>담당자</TableHead>
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
                <TableCell>{customer.employee}</TableCell>
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
              <TableCell colSpan={2} className="font-bold">총계</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.nearing)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.due)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.overdue)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(grandTotals.total)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
