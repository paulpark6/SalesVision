
'use client';

import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';

// A simplified initial data structure for demonstration
const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        salesperson: 'Jane Smith',
        customerName: 'Customer A', 
        products: [
            { id: 'prod-1-1', productName: 'Laptop Model X', june: 5000, july: 5200, august: 4800, target: 5500 },
            { id: 'prod-1-2', productName: 'Wireless Mouse', june: 3000, july: 2800, august: 3200, target: 3300 },
        ]
    },
     {
        id: 'cust-2',
        salesperson: 'Alex Ray',
        customerName: 'Customer B',
        products: [
            { id: 'prod-2-1', productName: '4K Monitor', june: 12000, july: 12500, august: 11800, target: 13000 },
        ]
    },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCustomerChange = useCallback((customerId: string, field: 'salesperson' | 'customerName', value: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId ? { ...customer, [field]: value } : customer
      )
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: 'productName' | 'target', value: string | number) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.map(product =>
            product.id === productId ? { ...product, [field]: value } : product
          );
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      salesperson: '',
      customerName: '',
      products: [],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct = {
      id: uuidv4(),
      productName: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0,
    };
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? { ...customer, products: [...customer.products, newProduct] }
          : customer
      )
    );
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
  }, []);

_
  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.filter(p => p.id !== productId);
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('Submitting data:', customerData);
    toast({
        title: '목표 제출 완료',
        description: '9월 매출 목표가 관리자에게 제출되었습니다.'
    });
  }, [customerData, toast]);
  
  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

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

  const grandTotal = useMemo(() => {
    return Object.values(employeeTotals).reduce((acc, totals) => {
        acc.june += totals.june;
        acc.july += totals.july;
        acc.august += totals.august;
        acc.target += totals.target;
        return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [employeeTotals]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  if (!isMounted) {
    return null;
  }
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  return (
    <SidebarProvider>
      <AppSidebar role={role || 'employee'} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표 설정</CardTitle>
              <CardDescription>
                6월-8월 실적을 참고하여 9월 매출 목표를 설정합니다. 신규 고객 및 제품을 추가하여 목표를 등록할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">담당자</TableHead>
                      <TableHead className="w-[220px]">고객명</TableHead>
                      <TableHead className="w-[220px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[100px] text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length || 1} className="align-top">
                                <select
                                  value={customer.salesperson}
                                  onChange={(e) => handleCustomerChange(customer.id, 'salesperson', e.target.value)}
                                  className="w-full p-2 border rounded-md bg-transparent"
                                >
                                  <option value="">담당자 선택</option>
                                  {employees.map(e => <option key={e.value} value={e.name}>{e.name}</option>)}
                                </select>
                              </TableCell>
                            )}
                            {prodIndex === 0 && (
                               <TableCell rowSpan={customer.products.length || 1} className="align-top">
                                    <Combobox
                                        items={customerOptions}
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                        placeholder="고객 선택 또는 입력"
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                    />
                                </TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'productName', value)}
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
                                onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseInt(e.target.value))}
                                className="w-full text-right"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            {customer.products.length === 0 && (
                                <>
                                    <TableCell>
                                        <select
                                            value={customer.salesperson}
                                            onChange={(e) => handleCustomerChange(customer.id, 'salesperson', e.target.value)}
                                            className="w-full p-2 border rounded-md bg-transparent"
                                        >
                                            <option value="">담당자 선택</option>
                                            {employees.map(e => <option key={e.value} value={e.name}>{e.name}</option>)}
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <Combobox
                                            items={customerOptions}
                                            value={customer.customerName}
                                            onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                            placeholder="고객 선택 또는 입력"
                                            searchPlaceholder="고객 검색..."
                                            noResultsMessage="고객을 찾을 수 없습니다."
                                        />
                                    </TableCell>
                                </>
                            )}
                            <TableCell colSpan={customer.products.length > 0 ? 3 : 1}>
                               <Button variant="link" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                제품 추가
                              </Button>
                            </TableCell>
                             {customer.products.length === 0 && <TableCell colSpan={4}></TableCell>}
                             <TableCell className="text-center" colSpan={customer.products.length > 0 ? 3 : 1}>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomer(customer.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-start mt-4">
                 <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-4">
              <div className="w-full max-w-2xl self-end">
                <h3 className="text-lg font-semibold mb-2">Total Summary</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>구분</TableHead>
                            <TableHead className="text-right">6월</TableHead>
                            <TableHead className="text-right">7월</TableHead>
                            <TableHead className="text-right">8월</TableHead>
                            <TableHead className="text-right">9월 목표 총액</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(employeeTotals).map(([employee, totals]) => (
                            <TableRow key={employee}>
                                <TableCell>{employee}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(totals.target)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableRow className="font-bold border-t-2">
                        <TableCell>총계</TableCell>
                        <TableCell className="text-right">{formatCurrency(grandTotal.june)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(grandTotal.july)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(grandTotal.august)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(grandTotal.target)}</TableCell>
                    </TableRow>
                </Table>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmit}>Submit for Approval</Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    