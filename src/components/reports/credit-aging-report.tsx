
'use client';

import * as React from 'react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { creditNoteData } from '@/lib/mock-data';
import type { CreditNote } from '@/lib/mock-data';
import { differenceInDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';


type AgingBucket = 'Current' | '1-30' | '31-60' | '61-90' | '>90';

const getAgingBucket = (dueDate: string): AgingBucket => {
  const due = parseISO(dueDate);
  const today = new Date();
  const daysOverdue = differenceInDays(today, due);

  if (daysOverdue <= 0) return 'Current';
  if (daysOverdue <= 30) return '1-30';
  if (daysOverdue <= 60) return '31-60';
  if (daysOverdue <= 90) return '61-90';
  return '>90';
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
};


export function CreditAgingReport() {
    const { toast } = useToast();

    const agingBuckets = React.useMemo(() => {
        const buckets: Record<AgingBucket, CreditNote[]> = {
        Current: [],
        '1-30': [],
        '31-60': [],
        '61-90': [],
        '>90': [],
        };

        creditNoteData.forEach(note => {
            const bucket = getAgingBucket(note.dueDate);
            buckets[bucket].push(note);
        });

        return buckets;
    }, []);

    const bucketOrder: AgingBucket[] = ['Current', '1-30', '31-60', '61-90', '>90'];

    const totals = bucketOrder.reduce((acc, bucket) => {
        acc[bucket] = agingBuckets[bucket].reduce((sum, note) => sum + note.amount, 0);
        return acc;
    }, {} as Record<AgingBucket, number>);

    const grandTotal = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

    const handleExport = () => {
        const exportData = creditNoteData.map(note => {
            const daysOverdue = differenceInDays(new Date(), parseISO(note.dueDate));
            return {
                'Sales Date': note.salesDate,
                'Salesperson': note.salesperson,
                'Customer': note.customerName,
                'Amount': note.amount,
                'Due Date': note.dueDate,
                'Days Overdue': daysOverdue > 0 ? daysOverdue : 0,
                'Aging Bucket': getAgingBucket(note.dueDate),
            }
        });

        const csv = Papa.unparse(exportData);
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'credit_aging_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: 'Report Exported',
            description: 'The credit aging report has been downloaded as a CSV file.',
        });
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Credit Aging Report</CardTitle>
                <CardDescription>
                    This report shows outstanding credit notes grouped by their aging status.
                </CardDescription>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Aging Bucket</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">No. of Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bucketOrder.map(bucket => (
                    <TableRow key={bucket}>
                        <TableCell className="font-medium">{bucket}{bucket !== 'Current' && ' Days'}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(totals[bucket])}</TableCell>
                        <TableCell className="text-right">
                             <Badge variant={agingBuckets[bucket].length > 0 ? "secondary" : "outline"}>
                                {agingBuckets[bucket].length}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">Grand Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(grandTotal)}</TableCell>
                    <TableCell className="text-right font-bold">
                        <Badge>{creditNoteData.length}</Badge>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
        <Accordion type="single" collapsible className="w-full mt-6">
          {bucketOrder.map(bucket => (
             agingBuckets[bucket].length > 0 && (
              <AccordionItem value={bucket} key={bucket}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>{bucket}{bucket !== 'Current' && ' Days'}</span>
                    <span className="font-semibold">{formatCurrency(totals[bucket])}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sales Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Salesperson</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agingBuckets[bucket].map(note => (
                        <TableRow key={note.id}>
                          <TableCell>{note.salesDate}</TableCell>
                          <TableCell>{note.dueDate}</TableCell>
                          <TableCell>{note.salesperson}</TableCell>
                          <TableCell>{note.customerName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(note.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
