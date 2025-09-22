
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
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

// Helper to generate a unique ID
const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: generateId(),
        name: 'Customer A',
        salesperson: 'Jane Smith',
        products: [
            { id: generateId(), name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: generateId(), name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
    {
        id: generateId(),
        name: 'Customer B',
        salesperson: 'Alex Ray',
        products: [
            { id: generateId(), name: 'Wireless Mouse', june: 800, july: 850, august: 820, target: 900 },
        ]
    },
];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();
  const role = auth?.role;

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddCustomer = useCallback(() => {
    setCustomerData(prev => [
      ...prev,
      {
        id: generateId(),
        name: '',
        salesperson: '',
        products: [{ id: generateId(), name: '', june: 0, july: 0, august: 0, target: 0 }],
      },
    ]);
  }, []);
  
  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prev => prev.filter(customer => customer.id !== customerId));
  }, []);

  const handleCustomerChange = useCallback((customerId: string, field: 'name' | 'salesperson', value: string) => {
    setCustomerData(prev =>
      prev.map(customer =>
        customer.id === customerId ? { ...customer, [field]: value } : customer
      )
    );
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prev =>
      prev.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [...customer.products, { id: generateId(), name: '', june: 0, july: 0, august: 0, target: 0 }],
            }
          : customer
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          const newProducts = customer.products.filter(p => p.id !== productId);
          // If all products are removed, keep one blank product line
          if (newProducts.length === 0) {
            return { ...customer, products: [{ id: generateId(), name: '', june: 0, july: 0, august: 0, target: 0 }] };
          }
          return { ...customer, products: newProducts };
        }
        return customer;
      })
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: string, value: string | number) => {
    setCustomerData(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          const newProducts = customer.products.map(p =>
            p.id === productId ? { ...p, [field]: value } : p
          );
          return { ...customer, products: newProducts };
        }
        return customer;
      })
    );
  }, []);
  
  const handleSubmit = () => {
    toast({
      title: 'Approval Request Sent',
      description: 'The monthly sales targets have been submitted for approval.',
    });
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath);
  };
  
  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
        if (customer.salesperson && !totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        if (customer.salesperson) {
            customer.products.forEach(product => {
                totals[customer.salesperson].june += product.june;
                totals[customer.salesperson].july += product.july;
                totals[customer.salesperson].august += product.august;
                totals[customer.salesperson].target += product.target;
            });
        }
    });
    return totals;
  }, [customerData]);

  const grandTotal = useMemo(() => {
      const total = { june: 0, july: 0, august: 0, target: 0 };
      Object.values(employeeTotals).forEach(empTotal => {
          total.june += empTotal.june;
          total.july += empTotal.july;
          total.august += empTotal.august;
          total.target += empTotal.target;
      });
      return total;
  }, [employeeTotals]);


  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!role || !isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 기반으로 9월(당월) 매출 목표를 설정합니다. 목표 설정 후 관리자에게 보고됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      { (role === 'admin' || role === 'manager') && <TableHead className="w-[180px]">담당자</TableHead> }
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[40px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <>
                                { (role === 'admin' || role === 'manager') && (
                                <TableCell rowSpan={customer.products.length}>
                                    <Combobox
                                      items={employees.map(e => ({ value: e.name, label: e.name }))}
                                      placeholder="Select employee..."
                                      searchPlaceholder="Search employees..."
                                      noResultsMessage="No employee found."
                                      value={customer.salesperson}
                                      onValueChange={(value) => handleCustomerChange(customer.id, 'salesperson', value)}
                                    />
                                </TableCell>
                                )}
                                <TableCell rowSpan={customer.products.length}>
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="Select or add customer..."
                                        searchPlaceholder="Search customers..."
                                        noResultsMessage="No customer found."
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(customer.id, 'name', value)}
                                        onAddNew={(newValue) => handleCustomerChange(customer.id, 'name', newValue)}
                                    />
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                               <Combobox
                                    items={productOptions}
                                    placeholder="Select or add product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'name', value)}
                                    onAddNew={(newValue) => handleProductChange(customer.id, product.id, 'name', newValue)}
                               />
                            </TableCell>
                            <TableCell className="text-right">${product.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleProductChange(customer.id, product.id, 'target', Number(e.target.value))}
                                className="h-8 text-right"
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveProduct(customer.id, product.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                             {prodIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="text-center align-middle">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemoveCustomer(customer.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                             )}
                          </TableRow>
                        ))}
                        <TableRow>
                           <TableCell colSpan={role === 'employee' ? 2 : 3} className="py-1">
                                <Button variant="link" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                           </TableCell>
                           <TableCell colSpan={5} className="py-1"></TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                 <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                </Button>
              </div>

              { (role === 'admin' || role === 'manager') && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>담당자별 합계</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                                    <TableRow key={salesperson}>
                                        <TableCell>{salesperson}</TableCell>
                                        <TableCell className="text-right">${totals.june.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${totals.july.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${totals.august.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">${totals.target.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
              )}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>총 합계</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="flex justify-around font-semibold text-lg">
                           <div className="text-center">
                               <p className="text-sm text-muted-foreground">6월 총계</p>
                               <p>${grandTotal.june.toLocaleString()}</p>
                           </div>
                           <div className="text-center">
                               <p className="text-sm text-muted-foreground">7월 총계</p>
                               <p>${grandTotal.july.toLocaleString()}</p>
                           </div>
                           <div className="text-center">
                               <p className="text-sm text-muted-foreground">8월 총계</p>
                               <p>${grandTotal.august.toLocaleString()}</p>
                           </div>
                           <div className="text-center">
                               <p className="text-sm text-muted-foreground">9월 목표 총계</p>
                               <p>${grandTotal.target.toLocaleString()}</p>
                           </div>
                       </div>
                    </CardContent>
                </Card>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSubmit}>관리자에게 보고</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    