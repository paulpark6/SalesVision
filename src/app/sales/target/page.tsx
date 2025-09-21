
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { customers, products, employees, pastSalesDetails, salesTargetData as initialSalesTargetData } from '@/lib/mock-data';
import type { SalesTarget, PastSaleDetail } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}월`,
}));

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [salesTargets, setSalesTargets] = useState<SalesTarget[]>([]);
  
  // States for the new target form
  const [currentTargetCustomer, setCurrentTargetCustomer] = useState('');
  const [currentTargetProduct, setCurrentTargetProduct] = useState('');
  const [currentTargetQuantity, setCurrentTargetQuantity] = useState(0);
  const [currentTargetUnitPrice, setCurrentTargetUnitPrice] = useState(0);


  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleAddTarget = () => {
    const customer = customers.find(c => c.label.toLowerCase() === currentTargetCustomer.toLowerCase());
    const product = products.find(p => p.label.toLowerCase() === currentTargetProduct.toLowerCase());

    if (!customer || !product || currentTargetQuantity <= 0) {
      toast({
        title: '입력 오류',
        description: '고객, 제품, 수량을 올바르게 입력하세요.',
        variant: 'destructive',
      });
      return;
    }
    
    const newTarget: SalesTarget = {
        id: `${customer.value}-${product.value}-${Date.now()}`,
        customer: { name: customer.label, code: customer.value },
        product: { name: product.label, code: product.value },
        quantity: currentTargetQuantity,
        unitPrice: currentTargetUnitPrice,
        totalAmount: currentTargetQuantity * currentTargetUnitPrice,
    };

    setSalesTargets(prev => [...prev, newTarget]);
    // Reset form
    setCurrentTargetCustomer('');
    setCurrentTargetProduct('');
    setCurrentTargetQuantity(0);
    setCurrentTargetUnitPrice(0);
  };
  
  const handleRemoveTarget = (id: string) => {
    setSalesTargets(prev => prev.filter(target => target.id !== id));
  };
  
  const handleSaveAllTargets = () => {
    if (salesTargets.length === 0) {
      toast({
        title: '저장할 목표 없음',
        description: '먼저 매출 목표를 추가해주세요.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: '목표 저장 완료',
      description: `${selectedMonth}월 매출 목표가 성공적으로 저장되었습니다.`,
    });
    setSalesTargets([]);
  };

  const performanceMonths = useMemo(() => {
    const month = parseInt(selectedMonth, 10);
    return [
        (month - 3 > 0 ? month - 3 : month - 3 + 12) + '월',
        (month - 2 > 0 ? month - 2 : month - 2 + 12) + '월',
        (month - 1 > 0 ? month - 1 : month - 1 + 12) + '월'
    ];
  }, [selectedMonth]);

  const customerPerformance = useMemo(() => {
    const filteredSales = pastSalesDetails.filter(sale => performanceMonths.includes(sale.month));
    
    const groupedByCustomer: Record<string, Record<string, PastSaleDetail[]>> = {};

    filteredSales.forEach(sale => {
      if (!groupedByCustomer[sale.customerName]) {
        groupedByCustomer[sale.customerName] = {};
      }
      if (!groupedByCustomer[sale.customerName][sale.month]) {
        groupedByCustomer[sale.customerName][sale.month] = [];
      }
      groupedByCustomer[sale.customerName][sale.month].push(sale);
    });

    return groupedByCustomer;
  }, [performanceMonths]);

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
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="월 선택" />
                        </SelectTrigger>
                        <SelectContent>
                        {months.map(month => (
                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>최근 3개월 실적 ({performanceMonths.join(', ')})</CardTitle>
                    <CardDescription>지난 3개월간의 고객별, 제품별 판매 실적입니다. 이를 참고하여 {selectedMonth}월 목표를 설정하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Accordion type="single" collapsible className="w-full">
                     {Object.entries(customerPerformance).map(([customerName, monthlyData]) => (
                        <AccordionItem value={customerName} key={customerName}>
                          <AccordionTrigger>{customerName}</AccordionTrigger>
                          <AccordionContent>
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead>월</TableHead>
                                          <TableHead>제품명</TableHead>
                                          <TableHead className="text-right">수량</TableHead>
                                          <TableHead className="text-right">매출액</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {performanceMonths.map(month => (
                                        <Fragment key={month}>
                                          {monthlyData[month] ? (
                                              monthlyData[month].map((sale, index) => (
                                                  <TableRow key={`${month}-${sale.productName}-${index}`}>
                                                      {index === 0 && <TableCell rowSpan={monthlyData[month].length} className="align-top font-medium">{month}</TableCell>}
                                                      <TableCell>{sale.productName}</TableCell>
                                                      <TableCell className="text-right">{sale.quantity}</TableCell>
                                                      <TableCell className="text-right">{formatCurrency(sale.salesAmount)}</TableCell>
                                                  </TableRow>
                                              ))
                                          ) : (
                                            <TableRow>
                                                <TableCell className="font-medium">{month}</TableCell>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">매출 없음</TableCell>
                                            </TableRow>
                                          )}
                                        </Fragment>
                                    ))}
                                  </TableBody>
                              </Table>
                          </AccordionContent>
                        </AccordionItem>
                     ))}
                   </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{selectedMonth}월 매출 목표 설정</CardTitle>
                    <CardDescription>
                        직원이 고객별 제품과 수량을 입력하면 자동으로 목표가 설정됩니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2 md:col-span-1">
                            <Label>고객</Label>
                            <Combobox
                                items={customers}
                                placeholder="고객 선택..."
                                searchPlaceholder="고객 검색..."
                                noResultsMessage="고객을 찾을 수 없습니다."
                                value={currentTargetCustomer}
                                onValueChange={setCurrentTargetCustomer}
                            />
                        </div>
                         <div className="space-y-2 md:col-span-1">
                            <Label>제품</Label>
                             <Combobox
                                items={products}
                                placeholder="제품 선택..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={currentTargetProduct}
                                onValueChange={(value) => {
                                    setCurrentTargetProduct(value);
                                    const product = products.find(p => p.label.toLowerCase() === value.toLowerCase());
                                    if(product) setCurrentTargetUnitPrice(product.basePrice);
                                    else setCurrentTargetUnitPrice(0);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>수량</Label>
                            <Input type="number" value={currentTargetQuantity} onChange={(e) => setCurrentTargetQuantity(Number(e.target.value))} placeholder="수량" />
                        </div>
                        <div className="space-y-2">
                            <Label>단가</Label>
                            <Input type="number" value={currentTargetUnitPrice} onChange={(e) => setCurrentTargetUnitPrice(Number(e.target.value))} placeholder="단가" />
                        </div>
                        <Button onClick={handleAddTarget}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            목표 추가
                        </Button>
                    </div>

                    {salesTargets.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-2">설정된 목표 목록</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>고객</TableHead>
                                        <TableHead>제품</TableHead>
                                        <TableHead className="text-right">수량</TableHead>
                                        <TableHead className="text-right">단가</TableHead>
                                        <TableHead className="text-right">목표 금액</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesTargets.map(target => (
                                        <TableRow key={target.id}>
                                            <TableCell>{target.customer.name}</TableCell>
                                            <TableCell>{target.product.name}</TableCell>
                                            <TableCell className="text-right">{target.quantity}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(target.unitPrice)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(target.totalAmount)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveTarget(target.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleSaveAllTargets}>전체 목표 저장</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    