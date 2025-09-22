
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  salesTargetData as initialSalesTargetData,
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialSalesTargetData.customers);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

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

  const handleCustomerChange = (index: number, field: keyof SalesTargetCustomer, value: any) => {
    const updatedData = [...customerData];
    (updatedData[index] as any)[field] = value;
    setCustomerData(updatedData);
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, field: string, value: any) => {
    const updatedData = [...customerData];
    (updatedData[customerIndex].products[productIndex] as any)[field] = value;
    setCustomerData(updatedData);
  };

  const handleAddCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      customerName: '',
      salesperson: '',
      products: [],
      isNew: true,
    };
    setCustomerData([...customerData, newCustomer]);
  };

  const handleRemoveCustomer = (index: number) => {
    const updatedData = customerData.filter((_, i) => i !== index);
    setCustomerData(updatedData);
    toast({ title: 'Customer Removed', description: 'The customer has been removed from the target list.' });
  };
  
  const handleAddProduct = (customerIndex: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products.push({
      name: '',
      pastSales: { june: 0, july: 0, august: 0 },
      septemberTarget: 0,
      isNew: true,
    });
    setCustomerData(updatedData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products = updatedData[customerIndex].products.filter((_, i) => i !== productIndex);
    setCustomerData(updatedData);
    toast({ title: 'Product Removed', description: 'The product has been removed from the customer\'s target list.' });
  };

  const handleSubmitForApproval = () => {
    toast({
      title: 'Submitted for Approval',
      description: 'Your sales targets have been submitted for manager approval.',
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCustomerData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return customerData;
    }
    return customerData.filter(c => c.salesperson === selectedEmployee);
  }, [customerData, selectedEmployee]);

  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
        if (!totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(product => {
            totals[customer.salesperson].june += product.pastSales.june;
            totals[customer.salesperson].july += product.pastSales.july;
            totals[customer.salesperson].august += product.pastSales.august;
            totals[customer.salesperson].target += product.septemberTarget;
        });
    });
    return Object.entries(totals).map(([name, data]) => ({ name, ...data }));
  }, [customerData]);


  if (!role || (role !== 'admin' && role !== 'manager')) {
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
                <Button onClick={handleSubmitForApproval}>Submit for Approval</Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                 Back to Dashboard
                </Button>
            </div>
          </div>

          <Card>
             <CardHeader>
                <CardTitle>직원별 실적 요약</CardTitle>
                <CardDescription>직원별 과거 3개월 실적 및 9월 목표 합계입니다.</CardDescription>
                <div className="flex items-end gap-4 pt-2">
                    <div className="grid gap-2">
                        <Label htmlFor="employee-filter">직원 선택</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger id="employee-filter" className="w-[180px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
             </CardHeader>
             {selectedEmployee === 'all' && (
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead className="text-right">6월 실적</TableHead>
                                <TableHead className="text-right">7월 실적</TableHead>
                                <TableHead className="text-right">8월 실적</TableHead>
                                <TableHead className="text-right">9월 목표</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeeTotals.map(emp => (
                                <TableRow key={emp.name}>
                                    <TableCell className="font-medium">{emp.name}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(emp.june)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(emp.july)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(emp.august)}</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(emp.target)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>고객별/제품별 9월 매출 목표</CardTitle>
              <CardDescription>
                과거 3개월간의 고객별 제품 매출을 확인하고 9월(당월) 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {role !== 'employee' && <TableHead className="w-[150px]">담당자</TableHead>}
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px] text-center">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomerData.map((customer, customerIndex) => (
                    <>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={`${customer.customerName}-${product.name}-${productIndex}`}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length + 1}>
                              {role !== 'employee' && (
                                customer.isNew ? (
                                    <Select 
                                        value={customer.salesperson}
                                        onValueChange={(val) => handleCustomerChange(customerIndex, 'salesperson', val)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="담당자 선택" /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                ) : customer.salesperson
                              )}
                            </TableCell>
                          )}
                           {productIndex === 0 && (
                             <TableCell rowSpan={customer.products.length + 1}>
                               {customer.isNew ? (
                                 <Combobox
                                    items={allCustomers.map(c => ({value: c.label, label: c.label}))}
                                    placeholder="고객 선택 또는 입력"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객 없음."
                                    value={customer.customerName}
                                    onValueChange={(val) => handleCustomerChange(customerIndex, 'customerName', val)}
                                 />
                               ) : customer.customerName}
                             </TableCell>
                           )}
                          
                          <TableCell>
                            {product.isNew ? (
                                <Combobox 
                                    items={allProducts.map(p => ({value: p.label, label: p.label}))}
                                    placeholder="제품 선택 또는 입력"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품 없음."
                                    value={product.name}
                                    onValueChange={(val) => handleProductChange(customerIndex, productIndex, 'name', val)}
                                />
                            ) : product.name}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales.august)}</TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                value={product.septemberTarget}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'septemberTarget', parseInt(e.target.value) || 0)}
                                className="h-8 text-right"
                             />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          {productIndex === 0 && (
                             <TableCell rowSpan={customer.products.length + 1} className="text-center align-middle">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(customerIndex)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                             </TableCell>
                          )}
                        </TableRow>
                      ))}
                      <TableRow>
                          <TableCell colSpan={role !== 'employee' ? 4 : 3}>
                            <Button variant="outline" size="sm" onClick={() => handleAddProduct(customerIndex)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                제품 추가
                            </Button>
                          </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                  <Button onClick={handleAddCustomer}>
                    <PlusCircle className="h-4 w-4 mr-2" />
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


    