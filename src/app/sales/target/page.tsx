
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
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { salesTargetHistoryData as initialData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TargetProduct = {
    productName: string;
    targetAmount: number;
};

type MonthlySale = {
    month: string;
    amount: number;
    products: string[];
};

type TargetData = {
    customerCode: string;
    customerName: string;
    monthlySales: MonthlySale[];
    nextMonthTarget: TargetProduct[];
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
  
  const handleTargetProductChange = (customerCode: string, productIndex: number, field: keyof TargetProduct, value: string | number) => {
    setSalesData(prevData =>
      prevData.map(item => {
        if (item.customerCode === customerCode) {
          const newTargets = [...item.nextMonthTarget];
          newTargets[productIndex] = { ...newTargets[productIndex], [field]: value };
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
          const newTargets = [...item.nextMonthTarget, { productName: '', targetAmount: 0 }];
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
  }

  const calculateTotalTarget = (targets: TargetProduct[]) => {
    return targets.reduce((sum, current) => sum + current.targetAmount, 0);
  };
  
  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">월별 고객 매출 목표</h1>
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
                    지난 3개월간의 매출 실적을 바탕으로 다음 달(10월)의 매출 목표를 제품별로 설정합니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">고객명</TableHead>
                            <TableHead className="text-right">7월 매출</TableHead>
                            <TableHead className="text-right">8월 매출</TableHead>
                            <TableHead className="text-right">9월 매출</TableHead>
                            <TableHead className="w-[200px] text-right">10월 목표 총액</TableHead>
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
                                            <TableCell key={sale.month} className="text-right">
                                                {formatCurrency(sale.amount)}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(totalTarget)}
                                        </TableCell>
                                    </TableRow>
                                    {isOpen && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="p-0">
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
                                                        <h4 className="font-semibold mb-2 text-base">10월 목표 제품 설정</h4>
                                                        <div className="space-y-2 max-w-lg">
                                                            {data.nextMonthTarget.map((target, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <Input
                                                                        placeholder="Product Name"
                                                                        value={target.productName}
                                                                        onChange={(e) => handleTargetProductChange(data.customerCode, index, 'productName', e.target.value)}
                                                                        className="h-8"
                                                                    />
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Target Amount"
                                                                        value={target.targetAmount}
                                                                        onChange={(e) => handleTargetProductChange(data.customerCode, index, 'targetAmount', parseFloat(e.target.value) || 0)}
                                                                        className="h-8 w-32 text-right"
                                                                    />
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProductFromTarget(data.customerCode, index)}>
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
                </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

