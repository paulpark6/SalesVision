
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { salesTargetManagementData, employees, products as mockProducts, customers as mockCustomers } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { PlusCircle, Trash2, X } from 'lucide-react';
import type { SalesTarget } from '@/lib/mock-data';

const employeeOptions = [
    { value: 'all', label: '전체' },
    ...employees.map(e => ({ value: e.value, label: e.name }))
];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();
  const role = auth?.role;

  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('9');
  const [targets, setTargets] = useState<SalesTarget[]>(salesTargetManagementData);
  

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
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

  const employeeSummary = useMemo(() => {
    if (selectedEmployee !== 'all') return [];

    const summary = employees.reduce((acc, emp) => {
        acc[emp.value] = { name: emp.name, target: 0, actual: 0 };
        return acc;
    }, {} as Record<string, { name: string; target: number; actual: number; }>);

    targets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          if (p.monthlyTarget) {
            summary[item.employeeId].target += p.monthlyTarget[selectedMonth as keyof typeof p.monthlyTarget] || 0;
          }
          if (p.monthlyActual) {
            summary[item.employeeId].actual += p.monthlyActual[selectedMonth as keyof typeof p.monthlyActual] || 0;
          }
        });
      }
    });

    return Object.values(summary);
}, [targets, selectedEmployee, selectedMonth]);


  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(d => d.employeeId === selectedEmployee);
  }, [selectedEmployee, targets]);

  const handleTargetChange = (customerIndex: number, productIndex: number, field: 'quantity' | 'monthlyTarget', value: number) => {
    const newTargets = [...targets];
    const customer = newTargets[customerIndex];
    if (!customer) return;
    
    const product = customer.products[productIndex];
    if (!product) return;

    if (field === 'quantity') {
      product.targetQuantity = value;
    } else { // monthlyTarget
        if (!product.monthlyTarget) {
            product.monthlyTarget = { '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 };
        }
       product.monthlyTarget[selectedMonth as keyof typeof product.monthlyTarget] = value;
    }
    setTargets(newTargets);
  };

  const handleCustomerChange = (customerIndex: number, value: string) => {
      const newTargets = [...targets];
      const customer = newTargets[customerIndex];
      const selectedCustomer = mockCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
      
      if (selectedCustomer) {
          customer.customerName = selectedCustomer.label;
          customer.customerCode = selectedCustomer.value;
      } else {
          // New customer being typed
          customer.customerName = value;
          customer.customerCode = `new-${Date.now()}`;
      }
      setTargets(newTargets);
  };

  const handleAddCustomer = () => {
    const newCustomerTarget: SalesTarget = {
        employeeId: selectedEmployee !== 'all' ? selectedEmployee : '',
        employeeName: selectedEmployee !== 'all' ? employeeOptions.find(e => e.value === selectedEmployee)?.label || '' : '',
        customerName: '',
        customerCode: `new-${Date.now()}`,
        products: [
            {
                categoryCode: 'new-cat',
                categoryName: 'New Category',
                productCode: 'new-prod',
                productName: 'New Product',
                pastSales: { '6': 0, '7': 0, '8': 0 },
                targetQuantity: 0,
                monthlyTarget: { '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 },
                monthlyActual: { '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 },
            }
        ]
    };
    setTargets(prev => [...prev, newCustomerTarget]);
    toast({
        title: "고객 추가됨",
        description: "새로운 고객 목표 설정 행이 추가되었습니다. 세부사항을 입력해주세요.",
    });
  };

  const handleDeleteCustomer = (customerIndex: number) => {
    setTargets(prev => prev.filter((_, index) => index !== customerIndex));
    toast({
        title: "고객 목표 삭제됨",
        variant: 'destructive'
    });
  };

  const handleAddProduct = (customerIndex: number) => {
    const newTargets = [...targets];
    newTargets[customerIndex].products.push({
        categoryCode: 'new-cat',
        categoryName: 'New Category',
        productCode: `new-prod-${Date.now()}`,
        productName: '',
        pastSales: { '6': 0, '7': 0, '8': 0 },
        targetQuantity: 0,
        monthlyTarget: { '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 },
        monthlyActual: { '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 },
    });
    setTargets(newTargets);
     toast({
        title: "제품 추가됨",
        description: "새로운 제품 목표 설정 행이 추가되었습니다.",
    });
  };

  const handleDeleteProduct = (customerIndex: number, productIndex: number) => {
    const newTargets = [...targets];
    const customer = newTargets[customerIndex];
    if (customer.products.length > 1) {
        customer.products.splice(productIndex, 1);
        setTargets(newTargets);
    } else {
        // If it's the last product, delete the customer
        handleDeleteCustomer(customerIndex);
    }
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
            <h1 className="text-2xl font-semibold">월별 매출 목표 관리</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                직원 및 월별로 고객의 제품 판매 목표를 설정하고 관리합니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="month-select">월 선택</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-select" className="w-[120px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 7 }, (_, i) => String(i + 6)).map(month => (
                        <SelectItem key={month} value={month}>{month}월</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(role === 'admin' || role === 'manager') && (
                    <div className="grid gap-2">
                    <Label htmlFor="employee-select">직원 선택</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                        <SelectTrigger id="employee-select" className="w-[180px]">
                        <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                           {employeeOptions.map(emp => (
                                <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </div>
                )}
                 <Button>조회</Button>
              </div>
            </CardHeader>
            <CardContent>
                {selectedEmployee === 'all' && (
                    <div className='mb-8'>
                        <h3 className="text-lg font-semibold mb-2">전체 직원 {selectedMonth}월 목표 요약</h3>
                        <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>직원</TableHead>
                                   <TableHead className="text-right">매출 목표</TableHead>
                                   <TableHead className="text-right">매출 실적</TableHead>
                                   <TableHead className="w-[200px]">달성률</TableHead>
                               </TableRow>
                           </TableHeader>
                            <TableBody>
                                {employeeSummary.map(emp => {
                                    const achievementRate = emp.target > 0 ? (emp.actual / emp.target) * 100 : 0;
                                    return (
                                        <TableRow key={emp.name}>
                                            <TableCell className='font-medium'>{emp.name}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(emp.target)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(emp.actual)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={achievementRate} className="h-2" />
                                                    <span className="text-xs font-semibold w-12 text-right">
                                                        {achievementRate.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>고객명</TableHead>
                    {(role === 'admin' || role === 'manager') && <TableHead>담당자</TableHead>}
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="text-right">목표수량</TableHead>
                    <TableHead className="text-right">매출목표 ({selectedMonth}월)</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target, customerIndex) => (
                    <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode || customerIndex}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}`}>
                          {pIndex === 0 && (
                            <TableCell rowSpan={target.products.length + 1} className="align-top font-medium w-[200px]">
                                <div className="flex items-start gap-2">
                                    <Combobox
                                        items={mockCustomers}
                                        value={target.customerName}
                                        onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                        placeholder="Select or add customer"
                                        searchPlaceholder="Search customers..."
                                        noResultsMessage="No customer found."
                                        onAddNew={(newValue) => handleCustomerChange(customerIndex, newValue)}
                                    />
                                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleDeleteCustomer(customerIndex)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">{target.customerCode}</div>
                            </TableCell>
                          )}
                           {pIndex === 0 && (role === 'admin' || role === 'manager') && (
                                <TableCell rowSpan={target.products.length + 1} className="align-top">
                                    {target.employeeName}
                                </TableCell>
                            )}
                          <TableCell>
                            <Combobox
                                items={mockProducts}
                                value={product.productName}
                                onValueChange={(value) => {
                                    const newTargets = [...targets];
                                    const selectedProd = mockProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
                                    if(selectedProd) {
                                        newTargets[customerIndex].products[pIndex].productName = selectedProd.label;
                                        newTargets[customerIndex].products[pIndex].productCode = selectedProd.value;
                                    } else {
                                        newTargets[customerIndex].products[pIndex].productName = value;
                                    }
                                    setTargets(newTargets);
                                }}
                                placeholder="Select or add product"
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                            />
                            <div className="text-sm text-muted-foreground">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales ? product.pastSales[6] || 0 : 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales ? product.pastSales[7] || 0 : 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales ? product.pastSales[8] || 0 : 0)}</TableCell>
                          <TableCell className="text-right">
                            <Input 
                                type="number" 
                                value={product.targetQuantity} 
                                onChange={(e) => handleTargetChange(customerIndex, pIndex, 'quantity', parseInt(e.target.value))}
                                className="h-8 w-24 text-right ml-auto"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                value={product.monthlyTarget ? product.monthlyTarget[selectedMonth as keyof typeof product.monthlyTarget] : 0} 
                                onChange={(e) => handleTargetChange(customerIndex, pIndex, 'monthlyTarget', parseInt(e.target.value))}
                                className="h-8 w-32 text-right ml-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(customerIndex, pIndex)}>
                                <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                         <TableCell colSpan={role === 'admin' || role === 'manager' ? 7 : 6}>
                           <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customerIndex)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                제품 추가
                            </Button>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                  <Button variant="outline" onClick={handleAddCustomer}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      고객 추가
                  </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    