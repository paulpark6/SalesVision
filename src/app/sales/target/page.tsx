
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
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { customers, products, employees, monthlyPerformanceData } from '@/lib/mock-data';
import { Combobox } from '@/components/ui/combobox';
import { MonthlyPerformanceChart } from '@/components/dashboard/monthly-performance-chart';

type TargetItem = {
  customer: string;
  product: string;
  quantity: number;
  targetAmount: number;
};

const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
}

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  
  const currentMonth = new Date().getMonth() + 1; // January is 0, so +1
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState({ customer: '', product: '', quantity: 0, targetAmount: 0 });

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleAddTarget = () => {
    if (!currentTarget.customer || !currentTarget.product || currentTarget.quantity <= 0) {
      toast({
        title: '입력 오류',
        description: '고객, 제품, 수량을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    setTargets([...targets, currentTarget]);
    setCurrentTarget({ customer: '', product: '', quantity: 0, targetAmount: 0 });
  };

  const handleProductSelect = (productValue: string) => {
    const selectedProduct = products.find(p => p.value === productValue.split(' (')[1].replace(')',''));
    if (selectedProduct) {
      const newTargetAmount = currentTarget.quantity * selectedProduct.basePrice;
      setCurrentTarget(prev => ({
        ...prev,
        product: selectedProduct.label,
        targetAmount: newTargetAmount
      }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10) || 0;
    const selectedProduct = products.find(p => p.label === currentTarget.product);
    const newTargetAmount = selectedProduct ? quantity * selectedProduct.basePrice : 0;
    setCurrentTarget(prev => ({ ...prev, quantity, targetAmount: newTargetAmount }));
  };

  const handleSaveTargets = () => {
    toast({
      title: '목표 저장 완료',
      description: `${getMonthName(parseInt(selectedMonth))}월 매출 목표가 성공적으로 저장되었습니다.`,
    });
    setTargets([]);
  };

  const performanceDataForChart = useMemo(() => {
    const monthIndex = parseInt(selectedMonth, 10) -1;
    // Get data for selected month and two previous months
    return monthlyPerformanceData.filter(d => {
        const dMonth = new Date(Date.parse(d.month +" 1, 2024")).getMonth(); // Simple month parsing
        return dMonth <= monthIndex && dMonth > monthIndex - 3;
    });
  }, [selectedMonth]);
  
  const availableMonths = Array.from({length: 12}, (_, i) => ({ value: String(i + 1), label: getMonthName(i + 1) }));

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">월별 매출 목표</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          
            <div className="grid gap-2 w-[200px]">
                <Label htmlFor="month-select">조회 월</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-select">
                    <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                    {availableMonths.map(month => (
                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>

            <MonthlyPerformanceChart data={performanceDataForChart} />

            <Card>
                <CardHeader>
                <CardTitle>월별 목표 설정: {getMonthName(parseInt(selectedMonth))}</CardTitle>
                <CardDescription>
                    고객별, 제품별 수량을 입력하여 매출 목표를 설정합니다.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4 p-4 border rounded-lg">
                        <div className="grid gap-2">
                            <Label>고객</Label>
                            <Combobox
                                items={customers}
                                placeholder="고객 선택..."
                                searchPlaceholder="고객 검색..."
                                noResultsMessage="고객을 찾을 수 없습니다."
                                value={currentTarget.customer}
                                onValueChange={(value) => setCurrentTarget(prev => ({...prev, customer: value}))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>제품</Label>
                            <Combobox
                                items={products.map(p => ({ value: `${p.label} (${p.value})`, label: p.label }))}
                                placeholder="제품 선택..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={currentTarget.product}
                                onValueChange={handleProductSelect}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">수량</Label>
                            <Input id="quantity" type="number" value={currentTarget.quantity} onChange={handleQuantityChange} min="1" />
                        </div>
                        <div className="grid gap-2">
                            <Label>목표 금액</Label>
                            <Input value={`$${currentTarget.targetAmount.toLocaleString()}`} readOnly className="bg-muted" />
                        </div>
                        <Button onClick={handleAddTarget}>추가</Button>
                    </div>

                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>고객</TableHead>
                            <TableHead>제품</TableHead>
                            <TableHead className="text-right">수량</TableHead>
                            <TableHead className="text-right">목표 금액</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {targets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">설정된 목표가 없습니다.</TableCell>
                            </TableRow>
                        ) : (
                            targets.map((target, index) => (
                                <TableRow key={index}>
                                <TableCell>{target.customer}</TableCell>
                                <TableCell>{target.product}</TableCell>
                                <TableCell className="text-right">{target.quantity}</TableCell>
                                <TableCell className="text-right font-medium">${target.targetAmount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-end mt-4">
                <Button onClick={handleSaveTargets} disabled={targets.length === 0}>
                    {getMonthName(parseInt(selectedMonth))}월 목표 저장
                </Button>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
