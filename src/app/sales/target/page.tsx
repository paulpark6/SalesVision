
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Fragment, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  TableFooter
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { salesTargetHistoryData as initialData, products, customerData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';

type TargetProduct = {
    productName: string;
    quantity: number;
    price: number;
    targetAmount: number;
};

type MonthlySale = {
    month: string;
    quantity: number;
    amount: number;
    products: string[];
};

type TargetData = {
    customerCode: string;
    customerName: string;
    monthlySales: MonthlySale[];
    nextMonthTarget: TargetProduct[];
};

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [salesData, setSalesData] = useState<TargetData[]>(initialData);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) { // All roles can access this page
      router.push('/login');
    }
  }, [auth, router]);
  
 const handleTargetProductChange = (
    customerCode: string,
    productIndex: number,
    field: 'productName' | 'quantity',
    value: string | number
  ) => {
    setSalesData(prevData =>
      prevData.map(item => {
        if (item.customerCode === customerCode) {
          const newTargets = [...item.nextMonthTarget];
          const currentTarget = { ...newTargets[productIndex] };

          if (field === 'productName') {
            currentTarget.productName = value as string;
            const product = products.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
            const customer = customerData.find(c => c.customerCode === customerCode);
            if (product && customer) {
              const discount = getDiscount(customer.customerGrade);
              currentTarget.price = product.basePrice * (1 - discount);
            } else {
              currentTarget.price = 0;
            }
          } else if (field === 'quantity') {
            currentTarget.quantity = Number(value) || 0;
          }
          
          currentTarget.targetAmount = currentTarget.price * currentTarget.quantity;
          newTargets[productIndex] = currentTarget;

          return { ...item, nextMonthTarget: newTargets };
        }
        return item;
      })
    );
  };
  
  const handleAddProductToTarget = (customerCode: string) => {
    setSalesData(prevData =>
      prevData.map(item => {
        if (item.customerCode === customerCode) {
          const newTargets = [...item.nextMonthTarget, { productName: '', quantity: 0, price: 0, targetAmount: 0 }];
          return { ...item, nextMonthTarget: newTargets };
        }
        return item;
      })
    );
  };

  const handleRemoveProductFromTarget = (customerCode: string, productIndex: number) => {
     setSalesData(prevData =>
      prevData.map(item => {
        if (item.customerCode === customerCode) {
          const newTargets = item.nextMonthTarget.filter((_, index) => index !== productIndex);
          return { ...item, nextMonthTarget: newTargets };
        }
        return item;
      })
    );
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleSubmitForApproval = () => {
    toast({
        title: "Approval Request Sent",
        description: "The monthly sales targets have been submitted for administrator approval.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
  };

  const calculateTotalTarget = (targets: TargetProduct[]) => {
    return targets.reduce((sum, current) => sum + current.targetAmount, 0);
  };

  const grandTotals = useMemo(() => {
    if (!salesData || salesData.length === 0 || !salesData[0].monthlySales) {
        return { totalQuantities: [0, 0, 0], totalAmounts: [0, 0, 0], totalSeptemberTarget: 0 };
    }
    const totalQuantities = salesData[0].monthlySales.map((_, i) =>
        salesData.reduce((sum, customer) => sum + (customer.monthlySales[i]?.quantity || 0), 0)
    );
    const totalAmounts = salesData[0].monthlySales.map((_, i) =>
        salesData.reduce((sum, customer) => sum + (customer.monthlySales[i]?.amount || 0), 0)
    );
    const totalSeptemberTarget = salesData.reduce((sum, customer) => sum + calculateTotalTarget(customer.nextMonthTarget), 0);

    return { totalQuantities, totalAmounts, totalSeptemberTarget };
  }, [salesData]);

  
  if (!role) {
    return null;
  }

  const productComboboxItems = products.map(p => ({ value: p.label, label: p.label }));

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
                { (role === 'employee' || role === 'manager') &&
                    <Button onClick={handleSubmitForApproval}>
                        Submit for Approval
                    </Button>
                }
            </div>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>고객별 매출 목표 설정</CardTitle>
                <CardDescription>
                    지난 3개월간의 매출 실적을 바탕으로 9월의 매출 목표를 제품별로 설정합니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead rowSpan={2} className="align-bottom">고객명</TableHead>
                            <TableHead colSpan={2} className="text-center">6월 매출</TableHead>
                            <TableHead colSpan={2} className="text-center">7월 매출</TableHead>
                            <TableHead colSpan={2} className="text-center">8월 매출</TableHead>
                            <TableHead rowSpan={2} className="align-bottom text-right w-[200px]">9월 목표 총액</TableHead>
                        </TableRow>
                         <TableRow>
                            <TableHead className="text-right">수량</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                            <TableHead className="text-right">수량</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                            <TableHead className="text-right">수량</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesData.map((data) => {
                            const isOpen = openCollapsible === data.customerCode;
                            const totalTarget = calculateTotalTarget(data.nextMonthTarget);
                            return (
                                <Fragment key={data.customerCode}>
                                    <TableRow className="cursor-pointer" onClick={() => setOpenCollapsible(isOpen ? null : data.customerCode)}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                                <div className="font-medium">{data.customerName}</div>
                                                <div className="text-sm text-muted-foreground">{data.customerCode}</div>
                                            </div>
                                        </TableCell>
                                        {data.monthlySales.map(sale => (
                                           <Fragment key={sale.month}>
                                             <TableCell className="text-right">{sale.quantity}</TableCell>
                                             <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                                           </Fragment>
                                        ))}
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(totalTarget)}
                                        </TableCell>
                                    </TableRow>
                                    {isOpen && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="p-0">
                                                <div className="bg-muted/50 p-4 space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-base">지난 3개월 판매 제품</h4>
                                                         <div className="grid grid-cols-3 gap-4">
                                                            {data.monthlySales.map(sale => (
                                                                <div key={sale.month}>
                                                                    <h5 className="font-medium mb-2">{sale.month}</h5>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {sale.products.length > 0 ? sale.products.map(product => (
                                                                            <Badge key={product} variant="secondary">{product}</Badge>
                                                                        )) : <span className="text-xs text-muted-foreground">No sales</span>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-base">9월 목표 제품 설정</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 font-medium text-sm px-2">
                                                                <Label className="flex-1">제품</Label>
                                                                <Label className="w-20 text-center">수량</Label>
                                                                <Label className="w-28 text-right">단가</Label>
                                                                <Label className="w-32 text-right">목표금액</Label>
                                                                <div className="w-8"></div>
                                                            </div>
                                                            {data.nextMonthTarget.map((target, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <Combobox
                                                                        items={productComboboxItems}
                                                                        placeholder="Select product..."
                                                                        searchPlaceholder="Search products..."
                                                                        noResultsMessage="No product found."
                                                                        value={target.productName}
                                                                        onValueChange={(value) => handleTargetProductChange(data.customerCode, index, 'productName', value)}
                                                                    />
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="수량"
                                                                        value={target.quantity || ''}
                                                                        onChange={(e) => handleTargetProductChange(data.customerCode, index, 'quantity', e.target.value)}
                                                                        className="h-9 w-20 text-center"
                                                                    />
                                                                    <Input
                                                                        type="text"
                                                                        readOnly
                                                                        value={formatCurrency(target.price)}
                                                                        className="h-9 w-28 text-right bg-muted"
                                                                    />
                                                                    <Input
                                                                        type="text"
                                                                        readOnly
                                                                        value={formatCurrency(target.targetAmount)}
                                                                        className="h-9 w-32 text-right bg-muted font-semibold"
                                                                    />
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemoveProductFromTarget(data.customerCode, index)}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                             <Button variant="outline" size="sm" onClick={() => handleAddProductToTarget(data.customerCode)}>
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Add Product
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            )
                        })}
                    </TableBody>
                     <TableFooter>
                        <TableRow>
                            <TableCell className="font-bold">총계</TableCell>
                            <TableCell className="text-right font-bold">{grandTotals.totalQuantities[0]}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.totalAmounts[0])}</TableCell>
                            <TableCell className="text-right font-bold">{grandTotals.totalQuantities[1]}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.totalAmounts[1])}</TableCell>
                            <TableCell className="text-right font-bold">{grandTotals.totalQuantities[2]}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.totalAmounts[2])}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(grandTotals.totalSeptemberTarget)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
