
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  allCustomers,
  allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/combobox';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        salesperson: 'Jane Smith',
        name: 'Alpha Inc.',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Docking Station', june: 1500, july: 1400, august: 1600, target: 1500 },
        ]
    },
    {
        id: 'cust-2',
        salesperson: 'Alex Ray',
        name: 'Beta Solutions',
        products: [
            { id: 'prod-003', name: 'Webcam HD', june: 3000, july: 3200, august: 2900, target: 3500 },
        ]
    },
    {
        id: 'cust-3',
        salesperson: 'John Doe',
        name: 'Gamma Services',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 24000, july: 25000, august: 23600, target: 26000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
];

export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleAddCustomer = useCallback(() => {
    const newCustomerId = `cust-${Date.now()}`;
    setCustomerData(prevData => [
      ...prevData,
      {
        id: newCustomerId,
        salesperson: '',
        name: '',
        products: [
          {
            id: `prod-${Date.now()}`,
            name: '',
            june: 0,
            july: 0,
            august: 0,
            target: 0,
          },
        ],
      },
    ]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
  }, []);
  
  const handleCustomerChange = useCallback((customerId: string, field: keyof SalesTargetCustomer, value: string) => {
      setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId ? { ...customer, [field]: value } : customer
      )
    );
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            products: [
              ...customer.products,
              {
                id: `prod-${Date.now()}`,
                name: '',
                june: 0,
                july: 0,
                august: 0,
                target: 0,
              },
            ],
          };
        }
        return customer;
      })
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          // If it's the last product, remove the customer as well
          if (customer.products.length === 1) {
            return null;
          }
          return {
            ...customer,
            products: customer.products.filter(p => p.id !== productId),
          };
        }
        return customer;
      }).filter(Boolean) as SalesTargetCustomer[]
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: string, value: string | number) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            products: customer.products.map(p =>
              p.id === productId ? { ...p, [field]: value } : p
            ),
          };
        }
        return customer;
      })
    );
  }, []);
  
  const handleBack = useCallback(() => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  }, [role, router]);

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

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted || !role) {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">매출 목표 설정 (9월)</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월간 매출 목표</CardTitle>
              <CardDescription>
                6-8월 실적을 바탕으로 9월 매출 목표를 설정합니다. 고객 및 상품을 추가하여 목표를 수립하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px]"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top">
                                <div className="flex items-start gap-2">
                                  <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerChange(customer.id, 'name', value)}
                                  />
                                </div>
                              </TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'name', value)}
                                />
                            </TableCell>
                            <TableCell className="text-right">${product.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseInt(e.target.value, 10) || 0)}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell>
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                    <X className="h-4 w-4" />
                               </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell colSpan={6} className="py-1 px-2 text-right">
                               <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                             <TableCell className="py-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(customer.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </TableCell>
                         </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-end gap-4">
                <div className="w-full max-w-4xl self-end">
                    <h3 className="text-lg font-semibold mb-2 text-right">담당자별 합계</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead className="text-right">6월</TableHead>
                                <TableHead className="text-right">7월</TableHead>
                                <TableHead className="text-right">8월</TableHead>
                                <TableHead className="text-right">9월 목표</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                                <TableRow key={salesperson}>
                                    <TableCell className="font-medium">{salesperson}</TableCell>
                                    <TableCell className="text-right">${totals.june.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.july.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.august.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-bold">${totals.target.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                         <TableRow className="font-bold bg-muted/50">
                            <TableCell>총계</TableCell>
                            <TableCell className="text-right">${grandTotal.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotal.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotal.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotal.target.toLocaleString()}</TableCell>
                         </TableRow>
                    </Table>
                </div>
                <Button size="lg">Submit for Approval</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
