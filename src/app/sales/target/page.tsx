
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
  salesTargetData,
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Combobox } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [targetData, setTargetData] =
    useState<typeof salesTargetData>(salesTargetData);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleCustomerChange = (
    index: number,
    field: keyof SalesTargetCustomer,
    value: any
  ) => {
    const newCustomers = [...targetData.customers];
    (newCustomers[index] as any)[field] = value;
    setTargetData({ ...targetData, customers: newCustomers });
  };

  const handleProductChange = (
    customerIndex: number,
    productIndex: number,
    field: 'product' | 'june' | 'july' | 'august' | 'target',
    value: any
  ) => {
    const newCustomers = [...targetData.customers];
    (newCustomers[customerIndex].products[productIndex] as any)[field] = value;
    setTargetData({ ...targetData, customers: newCustomers });
  };

  const addCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: `C-${targetData.customers.length + 1}`,
      customerName: '',
      salesperson: '',
      products: [],
    };
    setTargetData({
      ...targetData,
      customers: [...targetData.customers, newCustomer],
    });
  };

  const removeCustomer = (index: number) => {
    const newCustomers = targetData.customers.filter((_, i) => i !== index);
    setTargetData({ ...targetData, customers: newCustomers });
    toast({
      title: 'Customer Removed',
      description: 'The customer has been removed from the target list.',
    });
  };

  const addProduct = (customerIndex: number) => {
    const newCustomers = [...targetData.customers];
    newCustomers[customerIndex].products.push({
      product: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0,
    });
    setTargetData({ ...targetData, customers: newCustomers });
  };

  const removeProduct = (customerIndex: number, productIndex: number) => {
    const newCustomers = [...targetData.customers];
    newCustomers[customerIndex].products = newCustomers[
      customerIndex
    ].products.filter((_, i) => i !== productIndex);
    setTargetData({ ...targetData, customers: newCustomers });
  };

  const handleSubmitForApproval = () => {
    toast({
      title: 'Approval Request Sent',
      description:
        'The sales targets have been submitted to your manager for approval.',
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
  
  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    targetData.customers.forEach(customer => {
        if (!totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(product => {
            totals[customer.salesperson].june += product.june;
            totals[customer.salesperson].july += product.july;
            totals[customer.salesperson].august += product.august;
            totals[customer.salesperson].target += product.target;
        });
    });
    return totals;
  }, [targetData]);

  const filteredCustomers = useMemo(() => {
    if (selectedEmployee === 'all') {
        return targetData.customers;
    }
    const employeeData = employees.find(e => e.value === selectedEmployee);
    if (employeeData) {
        return targetData.customers.filter(c => c.salesperson === employeeData.name);
    }
    return [];
  }, [selectedEmployee, targetData.customers]);


  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  const customerOptions = allCustomers.map(c => ({ value: c.label, label: c.label }));
  const productOptions = allProducts.map(p => ({ value: p.label, label: p.label }));

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Dashboard
              </Button>
              <Button onClick={handleSubmitForApproval}>
                Submit for Approval
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                과거 3개월 매출 실적을 기반으로 9월 매출 목표를 설정합니다.
                고객 및 제품을 추가/삭제하고 목표를 설정한 후 승인을 요청하세요.
              </CardDescription>
              <div className="flex items-center gap-4 pt-4">
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          {employees.map(e => <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' ? (
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
                        {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                            <TableRow key={salesperson}>
                                <TableCell className="font-medium">{salesperson}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
                <div className="space-y-6">
                {filteredCustomers.map((customer, customerIndex) => {
                  const customerTotal = customer.products.reduce(
                    (acc, p) => ({
                      june: acc.june + p.june,
                      july: acc.july + p.july,
                      august: acc.august + p.august,
                      target: acc.target + p.target,
                    }),
                    { june: 0, july: 0, august: 0, target: 0 }
                  );
                  return (
                    <div key={customer.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4 w-full">
                          {(role === 'manager' || role === 'admin') && (
                              <Select
                                value={customer.salesperson}
                                onValueChange={(value) =>
                                  handleCustomerChange(
                                    customerIndex,
                                    'salesperson',
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-[160px]">
                                  <SelectValue placeholder="담당자 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employees.map((e) => (
                                    <SelectItem key={e.value} value={e.name}>
                                      {e.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                          )}
                          <div className='w-full max-w-xs'>
                            <Combobox
                                items={customerOptions}
                                placeholder="고객 선택 또는 입력..."
                                searchPlaceholder="고객 검색..."
                                noResultsMessage="고객을 찾을 수 없습니다."
                                value={customer.customerName}
                                onValueChange={(value) => handleCustomerChange(customerIndex, 'customerName', value)}
                                onAddNew={(newValue) => handleCustomerChange(customerIndex, 'customerName', newValue)}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomer(customerIndex)}
                        >
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">제품</TableHead>
                            <TableHead className="text-right">6월 실적</TableHead>
                            <TableHead className="text-right">7월 실적</TableHead>
                            <TableHead className="text-right">8월 실적</TableHead>
                            <TableHead className="text-right w-[150px]">
                              9월 목표
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customer.products.map((p, productIndex) => (
                            <TableRow key={productIndex}>
                              <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="제품 선택 또는 입력..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={p.product}
                                    onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'product', value)}
                                    onAddNew={(value) => handleProductChange(customerIndex, productIndex, 'product', value)}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(p.june)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(p.july)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(p.august)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  value={p.target}
                                  onChange={(e) =>
                                    handleProductChange(
                                      customerIndex,
                                      productIndex,
                                      'target',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="h-8 text-right"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeProduct(customerIndex, productIndex)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                           <TableRow>
                                <TableCell colSpan={6}>
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addProduct(customerIndex)}
                                    className="w-full"
                                    >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                      <div className="flex justify-end gap-6 font-bold text-sm mt-4 pr-4">
                        <span>6월 합계: {formatCurrency(customerTotal.june)}</span>
                        <span>7월 합계: {formatCurrency(customerTotal.july)}</span>
                        <span>8월 합계: {formatCurrency(customerTotal.august)}</span>
                        <span>9월 목표 합계: {formatCurrency(customerTotal.target)}</span>
                      </div>
                    </div>
                  );
                })}
                 <Separator className="my-6"/>
                <Button onClick={addCustomer} variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  고객 추가
                </Button>
              </div>
              )}

            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

