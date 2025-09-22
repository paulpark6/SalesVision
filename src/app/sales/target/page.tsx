
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
  customers as allCustomers,
  products as allProducts,
  salesTargetData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

const initialData: SalesTargetCustomer[] = [
    {
        id: '1',
        customerName: 'Acme Inc.',
        products: [
            { id: 'p1', productName: 'Laptop Model X', juneSales: 15000, julySales: 16000, augustSales: 17000, septemberTarget: 20000, quantity: 50 },
            { id: 'p2', productName: 'Wireless Mouse', juneSales: 2000, julySales: 2200, augustSales: 2100, septemberTarget: 2500, quantity: 100 },
        ],
    },
    {
        id: '2',
        customerName: 'Stark Industries',
        products: [
            { id: 'p3', productName: 'AI Processor v2', juneSales: 30000, julySales: 32000, augustSales: 31000, septemberTarget: 35000, quantity: 10 },
        ],
    },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialData);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      products: [],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct = {
      id: uuidv4(),
      productName: '',
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
      quantity: 0,
    };
    setCustomerData(prev =>
      prev.map(customer =>
        customer.id === customerId
          ? { ...customer, products: [...customer.products, newProduct] }
          : customer
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            products: customer.products.filter(p => p.id !== productId),
          };
        }
        return customer;
      })
    );
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prev =>
      prev.map(c => (c.id === customerId ? { ...c, customerName: newName } : c))
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, newName: string) => {
    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId
          ? {
              ...c,
              products: c.products.map(p =>
                p.id === productId ? { ...p, productName: newName } : p
              ),
            }
          : c
      )
    );
  }, []);
  
  const handleInputChange = useCallback(
    (
      customerId: string,
      productId: string,
      field: keyof SalesTargetCustomer['products'][0],
      value: string
    ) => {
      setCustomerData(prevData =>
        prevData.map(customer => {
          if (customer.id === customerId) {
            return {
              ...customer,
              products: customer.products.map(product => {
                if (product.id === productId) {
                  return { ...product, [field]: Number(value) };
                }
                return product;
              }),
            };
          }
          return customer;
        })
      );
    },
    []
  );

  const handleSubmit = () => {
    toast({
      title: '목표 제출 완료',
      description: '설정된 9월 매출 목표가 관리자에게 제출되었습니다.',
    });
    router.push(role === 'admin' ? '/dashboard' : '/admin');
  };

  const handleCancel = () => {
    router.push(role === 'admin' ? '/dashboard' : '/admin');
  };

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
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button type="button" onClick={handleSubmit}>
                승인 요청
              </Button>
            </div>
          </div>
          
           {role === 'admin' && (
            <Card>
                <CardHeader>
                    <CardTitle>담당자 요약</CardTitle>
                    <CardDescription>
                        팀원별 월간 매출 목표 달성 현황입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
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
                    </div>
                </CardContent>
            </Card>
          )}


          <Card>
            <CardHeader>
              <CardTitle>고객별 목표 설정</CardTitle>
              <CardDescription>
                6월~8월 실적을 바탕으로 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right">9월 목표 수량</TableHead>
                      <TableHead className="text-right">9월 목표 매출</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length || 1} className="align-top pt-5">
                                 <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="제품 선택"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.juneSales)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.julySales)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.augustSales)}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleInputChange(customer.id, product.id, 'quantity', e.target.value)}
                                className="text-right h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.septemberTarget}
                                onChange={(e) =>
                                  handleInputChange(customer.id, product.id, 'septemberTarget', e.target.value)
                                }
                                className="text-right h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(customer.id, product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                           <TableCell colSpan={8} className="p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddProduct(customer.id)}
                                    className="w-full"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    제품 추가
                                </Button>
                           </TableCell>
                        </TableRow>
                         {customer.products.length > 0 && (
                             <TableRow>
                                <TableCell colSpan={8} className="h-4 p-0"></TableCell>
                             </TableRow>
                         )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
             <CardFooter className="flex justify-end pt-6">
                <Button onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    