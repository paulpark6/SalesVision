
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { MonthlyDetail } from "@/lib/mock-data";
import { Fragment } from "react";

type MonthlySalesDetailDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  monthData: MonthlyDetail;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};


export function MonthlySalesDetailDialog({ isOpen, onOpenChange, monthData }: MonthlySalesDetailDialogProps) {
  const totalMonthTarget = monthData.details.reduce((acc, customer) => acc + customer.products.reduce((pAcc, p) => pAcc + p.target, 0), 0);
  const totalMonthActual = monthData.details.reduce((acc, customer) => acc + customer.products.reduce((pAcc, p) => pAcc + p.actual, 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{monthData.month} Sales Details</DialogTitle>
          <DialogDescription>
            Detailed breakdown of customer and product sales targets versus actuals.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
            <Accordion type="single" collapsible className="w-full">
            {monthData.details.map((customer) => {
                 const totalCustomerTarget = customer.products.reduce((acc, p) => acc + p.target, 0);
                 const totalCustomerActual = customer.products.reduce((acc, p) => acc + p.actual, 0);
                 const customerAchievement = totalCustomerTarget > 0 ? (totalCustomerActual / totalCustomerTarget) * 100 : 0;
                 return (
                    <AccordionItem value={customer.customerName} key={customer.customerName}>
                        <AccordionTrigger>
                            <div className="w-full flex justify-between items-center pr-4">
                                <span className="font-semibold">{customer.customerName}</span>
                                <div className="flex items-center gap-4 text-sm">
                                    <span>Actual: {formatCurrency(totalCustomerActual)}</span>
                                    <span>Target: {formatCurrency(totalCustomerTarget)}</span>
                                    <div className="flex items-center gap-2 w-32">
                                        <Progress value={customerAchievement} className="h-2 w-20" />
                                        <span className="text-xs font-medium">{customerAchievement.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Sales Target</TableHead>
                                        <TableHead className="text-right">Sales Amount</TableHead>
                                        <TableHead className="w-[150px]">Achievement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {customer.products.map((product) => {
                                    const achievementRate = product.target > 0 ? (product.actual / product.target) * 100 : 0;
                                    return (
                                    <TableRow key={product.productName}>
                                        <TableCell className="font-medium">{product.productName}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(product.target)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(product.actual)}</TableCell>
                                        <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={achievementRate} className="h-2" />
                                            <span className="text-xs text-muted-foreground">{achievementRate.toFixed(1)}%</span>
                                        </div>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                )})}
            </Accordion>
        </div>
         <div className="mt-4 flex justify-end gap-6 font-bold text-base border-t pt-4">
            <span>Total Target: {formatCurrency(totalMonthTarget)}</span>
            <span>Total Actual: {formatCurrency(totalMonthActual)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
