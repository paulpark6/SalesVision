import { MoreHorizontal } from 'lucide-react';
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
import { duePaymentsData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

export function DuePaymentsTable() {
    const getStatus = (dueDate: string): 'overdue' | 'due' | 'nearing' => {
        const due = parseISO(dueDate);
        const today = new Date();
        const daysDiff = differenceInDays(due, today);

        if (daysDiff < -14) return 'overdue';
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


  return (
    <Card>
      <CardHeader>
        <CardTitle>신용 판매 관리</CardTitle>
        <CardDescription>
          다가오는 만기 및 연체된 신용 결제를 모니터링하고 관리합니다. 만기가 2주 내외로 도래하는 건은 '만기 임박'으로 표시됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>고객</TableHead>
              <TableHead className="hidden md:table-cell">담당자</TableHead>
              <TableHead className="hidden md:table-cell">만기일</TableHead>
              <TableHead className="hidden md:table-cell">상태</TableHead>
              <TableHead className="text-right">금액</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duePaymentsData.map((payment, index) => {
                const status = getStatus(payment.dueDate);
              return (
              <TableRow key={index} className={cn(getStatusRowClass(status))}>
                <TableCell>
                  <div className="font-medium">{payment.customer.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {payment.customer.email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{payment.employee}</TableCell>
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
                      <DropdownMenuItem>Log Follow-up</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
