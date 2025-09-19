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

export function DuePaymentsTable() {
  const getStatusVariant = (status: 'due' | 'overdue' | 'nearing') => {
    switch (status) {
      case 'overdue':
        return 'destructive';
      case 'due':
        return 'secondary';
      case 'nearing':
      default:
        return 'outline';
    }
  };
  
  const getStatusRowClass = (status: 'due' | 'overdue' | 'nearing') => {
    switch (status) {
      case 'overdue':
        return 'bg-destructive/10 hover:bg-destructive/20';
      case 'due':
        return 'bg-secondary/50';
      default:
        return '';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Sales Management</CardTitle>
        <CardDescription>
          Monitor and manage upcoming and overdue credit payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duePaymentsData.map((payment, index) => (
              <TableRow key={index} className={cn(getStatusRowClass(payment.status))}>
                <TableCell>
                  <div className="font-medium">{payment.customer.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {payment.customer.email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {payment.dueDate}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={getStatusVariant(payment.status)}
                    className="capitalize"
                  >
                    {payment.status}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
