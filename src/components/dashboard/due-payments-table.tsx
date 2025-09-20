
'use client';
import { MoreHorizontal, ChevronDown, Download } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { duePaymentsData as initialDuePaymentsData, DuePayment } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';
import { useState, Fragment } from 'react';
import { CollectionPlanDialog } from './collection-plan-dialog';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

export function DuePaymentsTable() {
    const { toast } = useToast();
    const [duePaymentsData, setDuePaymentsData] = useState<DuePayment[]>(initialDuePaymentsData);
    const [selectedPayment, setSelectedPayment] = useState<DuePayment | null>(null);
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

    const getStatus = (dueDate: string): 'overdue' | 'due' | 'nearing' => {
        const due = parseISO(dueDate);
        const today = new Date();
        const daysDiff = differenceInDays(due, today);

        if (daysDiff < 0) return 'overdue';
        if (daysDiff <= 14) return 'due';
        return 'nearing';
    };

    const getStatusVariant = (status: 'due' | 'overdue' | 'nearing') => {
        switch (status) {
        case 'overdue':
            return 'destructive';
        case 'due':
            return 'default';
        case 'nearing':
        default:
            return 'secondary';
        }
    };
    
    const getStatusRowClass = (status: 'due' | 'overdue' | 'nearing') => {
        switch (status) {
        case 'overdue':
            return 'bg-destructive/10 hover:bg-destructive/20';
        case 'due':
            return 'bg-yellow-100/50 dark:bg-yellow-900/50';
        default:
            return '';
        }
    };

    const getStatusText = (status: 'due' | 'overdue' | 'nearing') => {
        switch (status) {
            case 'overdue':
                return '연체';
            case 'due':
                return '만기 임박';
            case 'nearing':
                return '정상';
        }
    }
    
    const sortedPayments = [...duePaymentsData].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const handleOpenDialog = (payment: DuePayment) => {
        setSelectedPayment(payment);
    };

    const handleSavePlan = (paymentId: string, plan: string) => {
        setDuePaymentsData(prevData =>
            prevData.map(p => (p.id === paymentId ? { ...p, collectionPlan: plan } : p))
        );
        setSelectedPayment(null);
        toast({
            title: '수금 계획 제출됨',
            description: '계획이 관리자에게 전달되었습니다.',
        });
    };

    const handleExportOverdue = () => {
        const overduePayments = sortedPayments
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
          <CardTitle>미수금 현황</CardTitle>
          <CardDescription>
            다가오는 만기 및 연체된 신용 결제를 모니터링하고 관리합니다. 만기가 2주 내외로 도래하는 건은 '만기 임박'으로 표시됩니다.
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
              <TableHead>담당자</TableHead>
              <TableHead>고객</TableHead>
              <TableHead className="hidden md:table-cell">만기일</TableHead>
              <TableHead className="hidden md:table-cell">상태</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayments.map((payment) => {
                const status = getStatus(payment.dueDate);
                const isOpen = openCollapsible === payment.id;
              return (
              <Fragment key={payment.id}>
              <TableRow className={cn(getStatusRowClass(status))} onClick={() => setOpenCollapsible(isOpen ? null : payment.id)}>
                <TableCell className="font-medium">{payment.employee}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180", !payment.collectionPlan && "invisible")} />
                    <div>
                        <div className="font-medium">{payment.customer.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                            {payment.customer.email}
                        </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {payment.dueDate}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={getStatusVariant(status)}
                    className="capitalize"
                  >
                    {getStatusText(status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenDialog(payment)}>수금 계획 관리</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
               {isOpen && payment.collectionPlan && (
                <TableRow className="bg-muted/30 hover:bg-muted/40">
                    <TableCell colSpan={6} className="py-2 px-8">
                        <div className="text-xs">
                            <span className="font-semibold">수금 활동 내용: </span>
                            <span className="text-muted-foreground">{payment.collectionPlan}</span>
                        </div>
                    </TableCell>
                </TableRow>
               )}
              </Fragment>
            )})}
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
