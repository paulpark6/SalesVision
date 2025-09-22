
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
  customers as allCustomers,
  products as allProducts,
  salesTargetData,
  employeeSalesTargets,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';


// Helper function to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setCustomerData(salesTargetData);
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomerId = uuidv4();
    const newProductId = uuidv4();
    setCustomerData(prevData => [
      ...prevData,
      {
        id: newCustomerId,
        name: '',
        products: [
          {
            id: newProductId,
            name: '',
            juneSales: 0,
            julySales: 0,
            augustSales: 0,
            septemberTarget: 0,
          },
        ],
      },
    ]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
  }, []);
  
  const handleAddProduct = useCallback((customerId: string) => {
    const newProductId = uuidv4();
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [
                ...customer.products,
                {
                  id: newProductId,
                  name: '',
                  juneSales: 0,
                  julySales: 0,
                  augustSales: 0,
                  septemberTarget: 0,
                },
              ],
            }
          : customer
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.filter(p => p.id !== productId);
          // If it's the last product for that customer, remove the customer as well
          if (updatedProducts.length === 0) {
            return null;
          }
          return { ...customer, products: updatedProducts };
        }
        return customer;
      }).filter((c): c is SalesTargetCustomer => c !== null)
    );
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId ? { ...customer, name: newName } : customer
      )
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: string, value: string | number) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.map(product =>
                product.id === productId
                  ? { ...product, [field]: value }
                  : product
              ),
            }
          : customer
      )
    );
  }, []);

  const handleSubmit = () => {
    toast({
      title: '목표 제출 완료',
      description: '9월 매출 목표가 관리자에게 제출되었습니다.',
    });
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const totalSeptemberTarget = useMemo(() => {
    return customerData.reduce((total, customer) => {
      return total + customer.products.reduce((subTotal, product) => subTotal + product.septemberTarget, 0);
    }, 0);
  }, [customerData]);

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
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>

          {role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>담당자 요약</CardTitle>
                <CardDescription>
                  팀원별 9월 목표 달성 현황입니다.
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
                6월-8월 실적을 참고하여 9월 매출 목표를 설정합니다. 고객 또는 제품을 추가하여 신규 목표를 세울 수 있습니다.
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
                      <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top pt-5">
                                <Combobox
                                    items={customerOptions}
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    onAddNew={(newItem) => {
                                        // This is a simplified logic. A real app might need to update allCustomers list.
                                        handleCustomerChange(customer.id, newItem);
                                    }}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                               <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'name', value)}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    onAddNew={(newItem) => {
                                        // This is a simplified logic. A real app might need to update allProducts list.
                                        handleProductChange(customer.id, product.id, 'name', newItem);
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={product.septemberTarget}
                                onChange={(e) => handleProductChange(customer.id, product.id, 'septemberTarget', parseInt(e.target.value) || 0)}
                                className="text-right"
                                placeholder="0"
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
                            <TableCell colSpan={2}>
                                <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    제품 추가
                                </Button>
                            </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-start mt-4">
                <Button variant="outline" onClick={handleAddCustomer}>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  고객 추가
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-6">
                <div className="text-lg font-bold">
                    총 9월 목표: {formatCurrency(totalSeptemberTarget)}
                </div>
                <Button onClick={handleSubmit}>목표 제출</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
