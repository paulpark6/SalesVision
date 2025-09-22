
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { customers as allCustomers, products as allProducts } from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        customerName: 'Acme Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-1-1', productName: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 0 },
            { id: 'prod-1-2', productName: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 0 },
        ]
    },
    {
        id: 'cust-2',
        customerName: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-2-1', productName: 'Monitor 27"', june: 3000, july: 3200, august: 3100, target: 0 },
        ]
    },
    {
        id: 'cust-3',
        customerName: 'Wayne Enterprises',
        salesperson: 'John Doe',
        products: [
            { id: 'prod-3-1', productName: 'Docking Station', june: 1500, july: 1550, august: 1600, target: 0 },
        ]
    },
];

export default function SalesTargetPage() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

  const { auth } = useAuth();
  const router = useRouter();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newSalesperson, setNewSalesperson] = useState('Jane Smith');


  useEffect(() => {
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleAddCustomer = useCallback(() => {
    setCustomerData(prevData => [
      ...prevData,
      {
        id: uuidv4(),
        customerName: '',
        salesperson: newSalesperson,
        products: [{ id: uuidv4(), productName: '', june: 0, july: 0, august: 0, target: 0 }]
      }
    ]);
  }, [newSalesperson]);

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
            products: [...customer.products, { id: uuidv4(), productName: '', june: 0, july: 0, august: 0, target: 0 }]
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
          // If it's the last product, remove the customer instead
          if (customer.products.length === 1) {
            return null;
          }
          return {
            ...customer,
            products: customer.products.filter(product => product.id !== productId)
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
                      products: customer.products.map(product =>
                          product.id === productId ? { ...product, [field]: value } : product
                      )
                  };
              }
              return customer;
          })
      );
  }, []);

  const handleSubmit = () => {
    toast({
      title: '목표 제출 완료',
      description: '9월 매출 목표가 관리자에게 제출되었습니다.',
    });
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

  if (!isMounted || !auth) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    if(amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <AppSidebar role={role || 'employee'} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <Button onClick={handleSubmit}>목표 제출 (승인요청)</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
             {role === 'admin' && (
              <Card>
                  <CardHeader>
                      <CardTitle>담당자 요약</CardTitle>
                      <CardDescription>담당자별 월별 실적 및 9월 목표 합계입니다.</CardDescription>
                  </CardHeader>
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
                              {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                                  <TableRow key={salesperson}>
                                      <TableCell>{salesperson}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                      <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                          <CardFooter className="p-0">
                                <Table>
                                <TableBody>
                                <TableRow className="border-t-2">
                                  <TableCell className="font-bold">총계</TableCell>
                                  <TableCell className="text-right font-bold">{formatCurrency(grandTotal.june)}</TableCell>
                                  <TableCell className="text-right font-bold">{formatCurrency(grandTotal.july)}</TableCell>
                                  <TableCell className="text-right font-bold">{formatCurrency(grandTotal.august)}</TableCell>
                                  <TableCell className="text-right font-bold text-lg">{formatCurrency(grandTotal.target)}</TableCell>
                                </TableRow>
                                </TableBody>
                                </Table>
                          </CardFooter>
                      </Table>
                  </CardContent>
              </Card>
             )}
            <Card>
              <CardHeader>
                <CardTitle>고객별 목표 설정</CardTitle>
                <CardDescription>
                  고객 및 제품별 6월-8월 실적을 참고하여 9월 목표를 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[100px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top border-r">
                                <div className="flex items-start gap-2">
                                    <Combobox
                                        items={customerOptions}
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                    />
                                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemoveCustomer(customer.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="align-top">
                                <Combobox
                                    items={productOptions}
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'productName', value)}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                            </TableCell>
                            <TableCell className="text-right align-top">{formatCurrency(product.june)}</TableCell>
                            <TableCell className="text-right align-top">{formatCurrency(product.july)}</TableCell>
                            <TableCell className="text-right align-top">{formatCurrency(product.august)}</TableCell>
                            <TableCell className="align-top">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseFloat(e.target.value) || 0)}
                                className="text-right"
                                placeholder="목표액"
                              />
                            </TableCell>
                            <TableCell className="text-center align-top">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => handleRemoveProduct(customer.id, product.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={6} className="py-1 px-2 border-b">
                                <Button variant="link" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    제품 추가
                                </Button>
                            </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
                </div>
                <div className="mt-4">
                    <Button variant="secondary" onClick={handleAddCustomer}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        고객 추가
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    