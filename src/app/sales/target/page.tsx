
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { products, employees, pastSalesDetails } from '@/lib/mock-data';
import type { SalesTarget, CustomerPastSales, PastSaleProduct } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, PlusCircle, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

type TargetItem = {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targetMonth, setTargetMonth] = useState('9');
  const [salesTargets, setSalesTargets] = useState<Map<string, TargetItem[]>>(new Map());

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role || !auth?.name) return null;
    return employees.find((e) => e.name === auth.name);
  }, [auth]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const availableMonths = [
    { value: '1', label: '1월' },
    { value: '2', label: '2월' },
    { value: '3', label: '3월' },
    { value: '4', label: '4월' },
    { value: '5', label: '5월' },
    { value: '6', label: '6월' },
    { value: '7', label: '7월' },
    { value: '8', label: '8월' },
    { value: '9', label: '9월' },
    { value: '10', label: '10월' },
    { value: '11', label: '11월' },
    { value: '12', label: '12월' },
  ];
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const filteredCustomers = useMemo(() => {
      // For a real app, you would also filter by loggedInEmployee
      return pastSalesDetails.filter(customer => 
          customer.history.some(month => month.total > 0)
      );
  }, []);

  const handleAddTargetItem = (customerCode: string) => {
    const newTargets = new Map(salesTargets);
    const currentTargets = newTargets.get(customerCode) || [];
    const newProduct = products[0];
    currentTargets.push({ productId: newProduct.value, productName: newProduct.label, quantity: 0, price: newProduct.basePrice });
    newTargets.set(customerCode, currentTargets);
    setSalesTargets(newTargets);
  };

  const handleRemoveTargetItem = (customerCode: string, index: number) => {
    const newTargets = new Map(salesTargets);
    const currentTargets = newTargets.get(customerCode) || [];
    currentTargets.splice(index, 1);
    newTargets.set(customerCode, currentTargets);
    setSalesTargets(newTargets);
  };
  
  const handleTargetChange = (customerCode: string, index: number, field: 'productId' | 'quantity', value: string | number) => {
      const newTargets = new Map(salesTargets);
      const currentTargets = newTargets.get(customerCode) || [];
      const targetItem = currentTargets[index];

      if (field === 'productId') {
          const product = products.find(p => p.value === value);
          if (product) {
              targetItem.productId = product.value;
              targetItem.productName = product.label;
              targetItem.price = product.basePrice;
          }
      } else if (field === 'quantity') {
          targetItem.quantity = Number(value);
      }

      newTargets.set(customerCode, currentTargets);
      setSalesTargets(newTargets);
  }

  const calculateCustomerTotal = (customerCode: string): number => {
    const targets = salesTargets.get(customerCode) || [];
    return targets.reduce((total, item) => total + (item.quantity * item.price), 0);
  }

  const grandTotal = useMemo(() => {
      let total = 0;
      salesTargets.forEach((targets, code) => {
          total += calculateCustomerTotal(code);
      });
      return total;
  }, [salesTargets]);


  const handleSubmitTargets = () => {
    toast({
        title: "Targets Submitted",
        description: `Total target of ${formatCurrency(grandTotal)} has been set for ${availableMonths.find(m => m.value === targetMonth)?.label}.`
    });
  }

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
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="target-month">대상 월</Label>
                <Select value={targetMonth} onValueChange={setTargetMonth}>
                  <SelectTrigger id="target-month" className="w-[120px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별 실적 및 목표 설정</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 판매 실적을 기반으로 {availableMonths.find(m => m.value === targetMonth)?.label} 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">고객명</TableHead>
                    <TableHead className="w-[20%]">6월 실적</TableHead>
                    <TableHead className="w-[20%]">7월 실적</TableHead>
                    <TableHead className="w-[20%]">8월 실적</TableHead>
                    <TableHead className="w-[25%]">{availableMonths.find(m => m.value === targetMonth)?.label} 목표</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                      const customerTargetItems = salesTargets.get(customer.customerCode) || [];
                      const customerTotal = calculateCustomerTotal(customer.customerCode);
                      return (
                        <TableRow key={customer.customerCode} className="align-top">
                            <TableCell className="font-medium">
                                <p>{customer.customerName}</p>
                                <p className="text-xs text-muted-foreground">{customer.customerCode}</p>
                            </TableCell>
                            {['June', 'July', 'August'].map(monthName => {
                                const monthData = customer.history.find(h => h.month === monthName);
                                return (
                                    <TableCell key={monthName}>
                                        {monthData && monthData.sales.length > 0 ? (
                                            <div className="space-y-2">
                                                {monthData.sales.map((sale, idx) => (
                                                    <div key={idx} className="text-xs">
                                                        <p className="font-medium truncate">{sale.productName}</p>
                                                        <p>수량: {sale.quantity} · 금액: {formatCurrency(sale.total)}</p>
                                                    </div>
                                                ))}
                                                <p className="font-bold text-xs border-t pt-1 mt-1">월 합계: {formatCurrency(monthData.total)}</p>
                                            </div>
                                        ) : <span className="text-xs text-muted-foreground">매출 없음</span>}
                                    </TableCell>
                                )
                            })}
                            <TableCell>
                                <div className="space-y-2">
                                    {customerTargetItems.map((item, index) => (
                                        <div key={index} className="flex items-end gap-2">
                                             <div className="grid gap-1.5 w-full">
                                                <Label htmlFor={`product-${customer.customerCode}-${index}`} className="text-xs">제품</Label>
                                                <Select value={item.productId} onValueChange={(val) => handleTargetChange(customer.customerCode, index, 'productId', val)}>
                                                    <SelectTrigger id={`product-${customer.customerCode}-${index}`} className="h-8 text-xs">
                                                        <SelectValue placeholder="제품 선택" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map(p => <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                             </div>
                                             <div className="grid gap-1.5 w-24">
                                                <Label htmlFor={`quantity-${customer.customerCode}-${index}`} className="text-xs">수량</Label>
                                                <Input id={`quantity-${customer.customerCode}-${index}`} type="number" value={item.quantity} onChange={(e) => handleTargetChange(customer.customerCode, index, 'quantity', e.target.value)} className="h-8 text-xs" />
                                             </div>
                                             <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveTargetItem(customer.customerCode, index)}>
                                                 <Trash2 className="h-4 w-4 text-destructive" />
                                             </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="h-8 w-full mt-2" onClick={() => handleAddTargetItem(customer.customerCode)}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        제품 추가
                                    </Button>
                                    <p className="font-bold text-sm border-t pt-2 mt-2">고객 목표 합계: {formatCurrency(customerTotal)}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                      )
                  })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold text-base">총 목표 합계</TableCell>
                        <TableCell className="font-bold text-base">{formatCurrency(grandTotal)}</TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
              <div className="flex justify-end mt-6">
                  <Button onClick={handleSubmitTargets}>목표 제출</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
