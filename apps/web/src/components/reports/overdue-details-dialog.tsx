
'use client';
import * as React from 'react';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { differenceInDays, parseISO } from 'date-fns';
// import type { DuePayment } from "@/lib/mock-data";
export interface DuePayment {
  id: string;
  employee: string;
  employeeId?: string;
  customer: { name: string; email: string };
  dueDate: string;
  amount: number;
  collectionPlan?: string;
}

type OverdueDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customerName: string;
  payments: DuePayment[];
};

const getOverdueBucket = (dueDate: string): '1-30' | '31-90' | '>90' => {
  const due = parseISO(dueDate);
  const today = new Date();
  const daysOverdue = differenceInDays(today, due);

  if (daysOverdue <= 30) return '1-30';
  if (daysOverdue <= 90) return '31-90';
  return '>90';
};

const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function OverdueDetailsDialog({ isOpen, onOpenChange, customerName, payments }: OverdueDetailsDialogProps) {

  const bucketedPayments = useMemo(() => {
    const buckets: { [key: string]: { total: number; items: DuePayment[] } } = {
      '1-30': { total: 0, items: [] },
      '31-90': { total: 0, items: [] },
      '>90': { total: 0, items: [] },
    };

    payments.forEach(payment => {
      const bucket = getOverdueBucket(payment.dueDate);
      if (buckets[bucket]) {
        buckets[bucket].total += payment.amount;
        buckets[bucket].items.push(payment);
      }
    });

    return buckets;
  }, [payments]);

  const totalOverdue = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Overdue Details: {customerName}</DialogTitle>
          <DialogDescription>
            Displays the selected customer's overdue balances grouped by aging bucket.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aging Bucket</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(bucketedPayments).map(([bucket, data]) => (
                data.items.length > 0 && (
                  <React.Fragment key={bucket}>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={3}>
                        {bucket === '>90' ? 'Over 90 Days' : `${bucket} Days`}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(data.total)}</TableCell>
                    </TableRow>
                    {data.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell></TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">Total Overdue Amount</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalOverdue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
