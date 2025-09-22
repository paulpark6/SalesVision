
'use client';

import React from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
import { Combobox } from '@/components/ui/combobox';

// Initial data for the page, this would typically come from an API
const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Acme Inc',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-002', name: 'Monitor ProView', june: 8000, july: 8200, august: 8100, target: 8500 },
        ]
    },
];


export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [isMounted, setIsMounted] = useState(false);

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleCustomerChange = useCallback((custIndex: number, newValue: string) => {
    const newCustomer = allCustomers.find(c => c.label.toLowerCase() === newValue.toLowerCase());
    setCustomerData(prev => {
        const newData = [...prev];
        newData[custIndex].name = newCustomer?.label || newValue;
        return newData;
    });
  }, []);
  
  const handleProductChange = useCallback((custIndex: number, prodIndex: number, newValue: string) => {
      const newProduct = allProducts.find(p => p.label.toLowerCase() === newValue.toLowerCase());
      setCustomerData(prev => {
          const newData = [...prev];
          newData[custIndex].products[prodIndex].name = newProduct?.label || newValue;
          return newData;
      });
  }, []);

  const handleTargetChange = useCallback((custIndex: number, prodIndex: number, newTarget: number) => {
    setCustomerData(prev => {
        const newData = [...prev];
        newData[custIndex].products[prodIndex].target = newTarget;
        return newData;
    });
  }, []);

  const handleSalespersonChange = useCallback((custIndex: number, newSalesperson: string) => {
    setCustomerData(prev => {
        const newData = [...prev];
        newData[custIndex].salesperson = newSalesperson;
        return newData;
    });
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: `cust-${Date.now()}`,
      name: '',
      salesperson: '',
      products: [
        { id: `prod-${Date.now()}`, name: '', june: 0, july: 0, august: 0, target: 0 }
      ]
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, []);
  
  const handleAddProduct = useCallback((custIndex: number) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0
    };
    setCustomerData(prev => {
        const newData = [...prev];
        newData[custIndex].products.push(newProduct);
        return newData;
    });
  }, []);

  const handleRemoveProduct = useCallback((custIndex: number, prodIndex: number) => {
    setCustomerData(prev => {
        const newData = [...prev];
        if (newData[custIndex].products.length > 1) {
            newData[custIndex].products.splice(prodIndex, 1);
        } else {
            // If it's the last product, remove the customer as well
            newData.splice(custIndex, 1);
        }
        return newData;
    });
  }, []);

  const handleRemoveCustomer = useCallback((custIndex: number) => {
    setCustomerData(prev => {
        const newData = [...prev];
        newData.splice(custIndex, 1);
        return newData;
    });
  }, []);

  const handleSubmit = () => {
    toast({
      title: 'Approval Request Sent',
      description: 'The sales target plan has been submitted for administrator approval.',
    });
  };
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
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
  }, [customerData]);

  const grandTotals = useMemo(() => {
    return Object.values(employeeTotals).reduce((acc, totals) => {
        acc.june += totals.june;
        acc.july += totals.july;
        acc.august += totals.august;
        acc.target += totals.target;
        return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [employeeTotals]);
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted || !role) {
    return null; // or a loading skeleton
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={handleBack}>Back to Dashboard</Button>
                    <Button onClick={handleSubmit}>Submit for Approval</Button>
                 </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 기반으로 9월 매출 목표를 설정합니다. 목표 설정 후 관리자에게 보고됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">고객명</TableHead>
                      { (role === 'manager' || role === 'admin') && <TableHead className="w-[150px]">담당자</TableHead> }
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                      <TableHead className="w-12"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top border-r">
                                <div className="flex items-start">
                                   <Combobox
                                        items={customerOptions}
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(custIndex, value)}
                                        placeholder="고객 선택 또는 입력"
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                    />
                                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0" onClick={() => handleRemoveCustomer(custIndex)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                            {prodIndex === 0 && (role === 'manager' || role === 'admin') && (
                              <TableCell rowSpan={customer.products.length} className="align-top border-r">
                                <Combobox
                                    items={employees.map(e => ({ value: e.name, label: e.name }))}
                                    value={customer.salesperson}
                                    onValueChange={(value) => handleSalespersonChange(custIndex, value)}
                                    placeholder="담당자 선택"
                                    searchPlaceholder="담당자 검색..."
                                    noResultsMessage="담당자를 찾을 수 없습니다."
                                />
                              </TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(custIndex, prodIndex, value)}
                                    placeholder="제품 선택 또는 입력"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleTargetChange(custIndex, prodIndex, parseInt(e.target.value))}
                                className="h-8 text-right"
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell>
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(custIndex, prodIndex)}>
                                 <X className="h-4 w-4" />
                               </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell colSpan={ (role === 'manager' || role === 'admin') ? 2 : 1 } className="border-t">
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(custIndex)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                제품 추가
                                </Button>
                            </TableCell>
                            <TableCell className="text-right font-medium border-t">월별 합계</TableCell>
                            <TableCell className="text-right font-medium border-t">{formatCurrency(customer.products.reduce((acc, p) => acc + p.june, 0))}</TableCell>
                            <TableCell className="text-right font-medium border-t">{formatCurrency(customer.products.reduce((acc, p) => acc + p.july, 0))}</TableCell>
                            <TableCell className="text-right font-medium border-t">{formatCurrency(customer.products.reduce((acc, p) => acc + p.august, 0))}</TableCell>
                            <TableCell className="text-right font-medium border-t">{formatCurrency(customer.products.reduce((acc, p) => acc + p.target, 0))}</TableCell>
                            <TableCell className="border-t"></TableCell>
                         </TableRow>
                      </React.Fragment>
                    ))}
                    <TableRow>
                        <TableCell colSpan={(role === 'manager' || role === 'admin') ? 8 : 7}>
                            <Button variant="outline" onClick={handleAddCustomer}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                고객 추가
                            </Button>
                        </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

               { (role === 'manager' || role === 'admin') && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">담당자별 합계</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead className="text-right">6월 합계</TableHead>
                                <TableHead className="text-right">7월 합계</TableHead>
                                <TableHead className="text-right">8월 합계</TableHead>
                                <TableHead className="text-right">9월 목표 합계</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(employeeTotals).map(([name, totals]) => (
                                <TableRow key={name}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.target)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
               )}

                <div className="mt-8 flex justify-end font-bold text-lg border-t pt-4 space-x-6">
                    <span>총 6월 실적: {formatCurrency(grandTotals.june)}</span>
                    <span>총 7월 실적: {formatCurrency(grandTotals.july)}</span>
                    <span>총 8월 실적: {formatCurrency(grandTotals.august)}</span>
                    <span>총 9월 목표: {formatCurrency(grandTotals.target)}</span>
                </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
