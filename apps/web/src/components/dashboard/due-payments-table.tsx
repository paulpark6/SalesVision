
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
                'Account Owner': p.employee,
                'Customer': p.customer.name,
                'Customer Email': p.customer.email,
                'Due Date': p.dueDate,
                'Amount': p.amount,
                'Collection Notes': p.collectionPlan || 'None',
            }));

        if (overduePayments.length === 0) {
            toast({
                title: 'No Overdue Records',
                description: 'There are no overdue invoices to export.',
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
            title: 'Download Started',
            description: 'The overdue detail CSV file is downloading.',
        });
    };
    
    const handleSavePlan = (paymentId: string, plan: string) => {
        setDuePaymentsData(prevData =>
            prevData.map(p => (p.id === paymentId ? { ...p, collectionPlan: plan } : p))
        );
        setSelectedPayment(null);
        toast({
            title: 'Collection Plan Submitted',
            description: 'The collection plan has been sent to the manager.',
        })
    };


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Overdue & Upcoming Receivables</CardTitle>
          <CardDescription>
            Track invoices that are overdue or approaching their due date.
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
              <TableHead>Account Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Collection Plan</TableHead>
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
