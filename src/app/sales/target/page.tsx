
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  customers as allCustomers,
  products as allProducts,
  salesTargetInitialData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const initialData: SalesTargetCustomer[] = salesTargetInitialData.map(c => ({
      ...c,
      isNew: false,
      products: c.products.map(p => ({
        ...p,
        isNew: false,
      })),
    }));
    setCustomerData(initialData);
  }, []);
  
  useEffect(() => {
    if (isMounted && auth === undefined) return;
    if (isMounted && !auth) {
      router.push('/login');
    }
  }, [isMounted, auth, router]);

  const handleCustomerNameChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId ? { ...customer, name: newName } : customer
      )
    );
  }, []);

  const handleProductNameChange = useCallback((customerId: string, productId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.map(product =>
                product.id === productId ? { ...product, name: newName } : product
              ),
            }
          : customer
      )
    );
  }, []);
  
  const handleTargetChange = useCallback((customerId: string, productId: string, newTarget: string) => {
    const targetValue = parseInt(newTarget, 10) || 0;
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.map(product =>
                product.id === productId ? { ...product, target: targetValue } : product
              ),
            }
          : customer
      )
    );
  }, []);
  
  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const newProducts = customer.products.filter(p => p.id !== productId);
          // If all products are removed, remove the customer as well.
          if (newProducts.length === 0) {
            return null;
          }
          return { ...customer, products: newProducts };
        }
        return customer;
      }).filter(Boolean) as SalesTargetCustomer[]
    );
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
  }, []);
  
  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [
                ...customer.products,
                { id: uuidv4(), name: '', juneSales: 0, julySales: 0, augustSales: 0, target: 0, isNew: true },
              ],
            }
          : customer
      )
    );
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      name: '',
      isNew: true,
      products: [{ id: uuidv4(), name: '', juneSales: 0, julySales: 0, augustSales: 0, target: 0, isNew: true }],
    };
    setCustomerData(prevData => [...prevData, newCustomer]);
  }, []);

  const handleBack = useCallback(() => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  },[role, router]);

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
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
                <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
            </div>
            
             {role === 'admin' && (
              <Card>
                <CardHeader>
                    <CardTitle>담당자 요약</CardTitle>
                    <CardDescription>
                    팀원별 월간 매출 목표 달성 현황입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {employeeSalesTargets.map((employee) => {
                        const achievementRate = (employee.current / employee.target) * 100;
                        return (
                            <div key={employee.name} className="space-y-2">
                                <div className="flex justify-between">
                                     <Link href={`/employees/${encodeURIComponent(employee.name)}`} className="font-medium hover:underline">
                                        {employee.name}
                                    </Link>
                                    <span className="text-sm text-muted-foreground">{formatCurrency(employee.current)} / {formatCurrency(employee.target)}</span>
                                </div>
                                <Progress value={achievementRate} />
                                <div className="text-right text-sm font-semibold text-primary">
                                    {achievementRate.toFixed(1)}%
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
             </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>9월 매출 목표</CardTitle>
                    <CardDescription>
                        6월~8월 실적을 기반으로 9월 매출 목표를 설정합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">고객명</TableHead>
                                <TableHead className="w-[200px]">제품명</TableHead>
                                <TableHead className="text-right">6월 매출</TableHead>
                                <TableHead className="text-right">7월 매출</TableHead>
                                <TableHead className="text-right">8월 매출</TableHead>
                                <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerData.map((customer, customerIndex) => (
                            <Fragment key={customer.id}>
                              {customer.products.map((product, productIndex) => (
                                <TableRow key={product.id}>
                                  {productIndex === 0 && (
                                    <TableCell rowSpan={customer.products.length} className="align-top">
                                       <div className="flex items-start gap-2">
                                            {customer.isNew ? (
                                                <Combobox
                                                    items={customerOptions}
                                                    value={customer.name}
                                                    onValueChange={(newValue) => handleCustomerNameChange(customer.id, newValue)}
                                                    placeholder="고객 선택..."
                                                    searchPlaceholder="고객 검색..."
                                                    noResultsMessage="고객을 찾을 수 없습니다."
                                                />
                                            ) : (
                                                <div className="font-medium pt-2">{customer.name}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                  )}
                                  <TableCell>
                                     {product.isNew ? (
                                        <Combobox
                                            items={productOptions}
                                            value={product.name}
                                            onValueChange={(newValue) => handleProductNameChange(customer.id, product.id, newValue)}
                                            placeholder="제품 선택..."
                                            searchPlaceholder="제품 검색..."
                                            noResultsMessage="제품을 찾을 수 없습니다."
                                        />
                                    ) : (
                                        product.name
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                                  <TableCell className="text-right">
                                    <Input
                                        type="number"
                                        value={product.target}
                                        onChange={(e) => handleTargetChange(customer.id, product.id, e.target.value)}
                                        className="h-8 text-right"
                                        placeholder="목표액"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)} className="h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                      {productIndex === customer.products.length - 1 && (
                                          <Button variant="ghost" size="icon" onClick={() => handleAddProduct(customer.id)} className="h-8 w-8">
                                              <PlusCircle className="h-4 w-4" />
                                          </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                               {customer.products.length > 0 && productIndex === customer.products.length - 1 && (
                                <TableRow>
                                    <TableCell colSpan={7}></TableCell>
                                </TableRow>
                               )}
                            </Fragment>
                          ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-start">
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

    