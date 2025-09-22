
'use client';

import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newProductName, setNewProductName] = useState('');

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    const initialData: SalesTargetCustomer[] = salesTargetData.map(c => ({
      ...c,
      isNew: false,
      products: c.products.map(p => ({
        ...p,
        isNew: false,
        septemberTarget: {
          quantity: 0,
          unitPrice: 0,
          total: 0
        }
      }))
    }));
    setCustomerData(initialData);
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      isNew: true,
      products: []
    };
    setCustomerData(prevData => [...prevData, newCustomer]);
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const newProduct = {
            id: uuidv4(),
            productName: '',
            isNew: true,
            juneSales: 0,
            julySales: 0,
            augustSales: 0,
            septemberTarget: { quantity: 0, unitPrice: 0, total: 0 }
          };
          return { ...customer, products: [...customer.products, newProduct] };
        }
        return customer;
      })
    );
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(c => c.id !== customerId));
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return { ...customer, products: customer.products.filter(p => p.id !== productId) };
        }
        return customer;
      })
    );
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(c => (c.id === customerId ? { ...c, customerName: newName } : c))
    );
  }, []);
  
  const handleProductChange = useCallback((customerId: string, productId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.map(p =>
            p.id === productId ? { ...p, productName: newName } : p
          );
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  }, []);


  const handleTargetChange = useCallback((customerId: string, productId: string, field: 'quantity' | 'unitPrice', value: number) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.map(product => {
            if (product.id === productId) {
              const newTarget = { ...product.septemberTarget };
              newTarget[field] = value;
              newTarget.total = newTarget.quantity * newTarget.unitPrice;
              return { ...product, septemberTarget: newTarget };
            }
            return product;
          });
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  }, []);
  
  const handleSubmit = () => {
    toast({
      title: '성공적으로 제출되었습니다',
      description: '매출 목표가 관리자에게 승인을 위해 제출되었습니다.',
    });
    router.push(role === 'admin' ? '/dashboard' : '/admin');
  };

  const handleBack = () => {
    router.push(role === 'admin' ? '/dashboard' : '/admin');
  };
  
  const formatCurrency = (amount: number) => {
      if (amount === 0) return '-';
      return `$${amount.toLocaleString()}`;
  }

  const totals = useMemo(() => {
    const totals = { june: 0, july: 0, august: 0, september: 0 };
    customerData.forEach(customer => {
        customer.products.forEach(product => {
            totals.june += product.juneSales || 0;
            totals.july += product.julySales || 0;
            totals.august += product.augustSales || 0;
            totals.september += product.septemberTarget.total || 0;
        });
    });
    return totals;
  }, [customerData]);

  const employeeSummary = useMemo(() => {
    return employeeSalesTargets.map(emp => {
        const totalSeptember = customerData.reduce((acc, curr) => acc + curr.products.reduce((pAcc, p) => pAcc + p.septemberTarget.total, 0), 0);
        // This logic is simplified. A real app would assign customers/sales to employees
        // For now, let's assume the total target is distributed among employees. 
        // Here we just display static target for demonstration.
        const achievementRate = (emp.current / emp.target) * 100;
        return {
            ...emp,
            projectedTarget: totalSeptember, // Simplified projection
            achievementRate
        }
    })
  }, [customerData]);


  if (!isMounted || !role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Dashboard
              </Button>
              <Button onClick={handleSubmit}>
                승인 제출
              </Button>
            </div>
          </div>
          
           {role === 'admin' && (
              <Card>
                <CardHeader>
                    <CardTitle>담당자 요약</CardTitle>
                    <CardDescription>
                    9월 매출 목표에 따른 담당자별 예상 실적입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {employeeSummary.map((employee) => (
                         <div key={employee.name} className="space-y-2">
                            <div className="flex justify-between">
                                <Link href={`/employees/${encodeURIComponent(employee.name)}`} className="font-medium hover:underline">
                                    {employee.name}
                                </Link>
                                <span className="text-sm text-muted-foreground">{formatCurrency(employee.current)} / {formatCurrency(employee.target)}</span>
                            </div>
                            <Progress value={employee.achievementRate} />
                            <div className="text-right text-sm font-semibold text-primary">
                                {employee.achievementRate.toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </CardContent>
             </Card>
           )}

          <Card>
            <CardHeader>
              <CardTitle>고객 및 제품별 목표</CardTitle>
              <CardDescription>
                6월-8월 실적을 기반으로 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품명</TableHead>
                    <TableHead className="text-right">6월 실적</TableHead>
                    <TableHead className="text-right">7월 실적</TableHead>
                    <TableHead className="text-right">8월 실적</TableHead>
                    <TableHead className="w-[100px] text-right">9월 목표수량</TableHead>
                    <TableHead className="w-[120px] text-right">9월 목표단가</TableHead>
                    <TableHead className="w-[120px] text-right">9월 목표금액</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, custIndex) => (
                      <Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length + 1} className="align-top pt-5">
                                {customer.isNew ? (
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                    />
                                ) : (
                                  <div className="font-medium">{customer.customerName}</div>
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                               {product.isNew ? (
                                    <Combobox
                                        items={productOptions}
                                        placeholder="제품 선택..."
                                        searchPlaceholder="제품 검색..."
                                        noResultsMessage="제품을 찾을 수 없습니다."
                                        value={product.productName}
                                        onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                    />
                                ) : (
                                  product.productName
                                )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                            <TableCell className="text-right">
                              <Input type="number" className="h-8 text-right" 
                                onChange={(e) => handleTargetChange(customer.id, product.id, 'quantity', parseInt(e.target.value))}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Input type="number" className="h-8 text-right"
                                onChange={(e) => handleTargetChange(customer.id, product.id, 'unitPrice', parseFloat(e.target.value))}
                              />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.septemberTarget.total)}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell colSpan={8}>
                                <div className='flex items-center gap-2'>
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                </Button>
                                {customer.isNew && (
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveCustomer(customer.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> 고객 삭제
                                    </Button>
                                )}

                                </div>
                            </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                    <TableRow>
                        <TableCell colSpan={9}>
                             <Button variant="outline" onClick={handleAddCustomer}>
                                <PlusCircle className="mr-2 h-4 w-4" /> 신규 고객 추가
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
                 <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={2} className="text-center">합계</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.september)}</TableCell>
                    <TableCell></TableCell>
                 </TableRow>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    