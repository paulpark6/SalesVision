
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
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { CustomerProductSale } from "@/lib/mock-data";

type CustomerSalesDetailDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customerName: string;
  salesData: CustomerProductSale[];
};

export function CustomerSalesDetailDialog({ isOpen, onOpenChange, customerName, salesData }: CustomerSalesDetailDialogProps) {
  const totalSales = salesData.reduce((acc, sale) => acc + sale.salesAmount, 0);
  const totalTarget = salesData.reduce((acc, sale) => acc + sale.salesTarget, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{customerName} - 제품별 매출 실적</DialogTitle>
          <DialogDescription>
            해당 고객의 제품별 매출 목표와 실적 상세 내역입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제품명</TableHead>
                <TableHead className="text-right">매출 목표</TableHead>
                <TableHead className="text-right">매출액</TableHead>
                <TableHead className="w-[150px]">달성률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.length > 0 ? (
                salesData.map((sale) => {
                  const achievementRate = sale.salesTarget > 0
                    ? (sale.salesAmount / sale.salesTarget) * 100
                    : (sale.salesAmount > 0 ? 100 : 0);
                  return (
                    <TableRow key={sale.productName}>
                      <TableCell className="font-medium">{sale.productName}</TableCell>
                      <TableCell className="text-right">${sale.salesTarget.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${sale.salesAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={achievementRate} className="h-2" />
                          <span className="text-xs text-muted-foreground">{achievementRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    매출 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           <div className="mt-4 flex justify-end gap-4 font-medium">
                <span>Total Target: ${totalTarget.toLocaleString()}</span>
                <span>Total Sales: ${totalSales.toLocaleString()}</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
