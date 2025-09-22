
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
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Acme Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 1500, july: 1600, august: 1550, target: 1700 },
        ]
    },
    {
        id: 'cust-003',
        name: 'Wayne Enterprises',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 24000, july: 25000, august: 23600, target: 26000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleAddCustomer = () => {
    setCustomerData([
      ...customerData,
      {
        id: uuidv4(),
        name: '',
        salesperson: 'Unassigned',
        products: [{ id: uuidv4(), name: '', june: 0, july: 0, august: 0, target: 0 }],
      },
    ]);
  };

  const handleRemoveCustomer = (customerId: string) => {
    setCustomerData(customerData.filter(c => c.id !== customerId));
  };
  
  const handleCustomerChange = (customerId: string, field: 'name' | 'salesperson', value: string) => {
      setCustomerData(prevData =>
        prevData.map(customer => {
            if (customer.id === customerId) {
                return { ...customer, [field]: value };
            }
            return customer;
        })
      );
  };
  
  const handleAddProduct = (customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            products: [...customer.products, { id: uuidv4(), name: '', june: 0, july: 0, august: 0, target: 0 }],
          };
        }
        return customer;
      })
    );
  };
  
  const handleRemoveProduct = (customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return { ...customer, products: customer.products.filter(p => p.id !== productId) };
        }
        return customer;
      })
    );
  };

  const handleProductChange = (customerId: string, productId: string, field: 'name' | 'june' | 'july' | 'august' | 'target', value: string | number) => {
      setCustomerData(prevData =>
        prevData.map(customer => {
            if (customer.id === customerId) {
                return {
                    ...customer,
                    products: customer.products.map(product => {
                        if (product.id === productId) {
                            return { ...product, [field]: value };
                        }
                        return product;
                    })
                };
            }
            return customer;
        })
      );
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
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
    return customerData.reduce((acc, customer) => {
        customer.products.forEach(product => {
            acc.june += product.june;
            acc.july += product.july;
            acc.august += product.august;
            acc.target += product.target;
        });
        return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [customerData]);
    
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted || !role) {
    return null; // Or a loading spinner
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
                <Button type="button" variant="outline" onClick={handleBack}>
                    Dashboard로 돌아가기
                </Button>
                <Button>승인 요청</Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
                <CardTitle>고객별/제품별 목표</CardTitle>
                <CardDescription>
                    지난 3개월 실적을 바탕으로 9월 목표를 설정합니다. 고객 또는 제품을 추가하여 계획을 수립하세요.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                        <TableHead className='w-[200px]'>고객명</TableHead>
                        <TableHead className='w-[200px]'>제품명</TableHead>
                        <TableHead className='text-right'>6월 실적</TableHead>
                        <TableHead className='text-right'>7월 실적</TableHead>
                        <TableHead className='text-right'>8월 실적</TableHead>
                        <TableHead className='w-[150px] text-right'>9월 목표</TableHead>
                        <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top border-r">
                                 <div className="flex flex-col gap-2">
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(customer.id, 'name', value)}
                                    />
                                    <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveCustomer(customer.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> 고객 삭제
                                    </Button>
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
                            <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                            <TableCell className='text-right'>
                                <Input 
                                    type="number" 
                                    value={product.target} 
                                    onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseInt(e.target.value) || 0)}
                                    className="text-right"
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                    <Button onClick={handleAddCustomer}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 고객 추가
                    </Button>
                </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8 mt-4">
             {role === 'admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle>담당자 요약</CardTitle>
                        <CardDescription>
                            영업 담당자별 9월 목표 총합 및 달성률입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>영업 담당자</TableHead>
                                    <TableHead className="text-right">9월 목표 합계</TableHead>
                                    <TableHead className="text-right">달성률</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(employeeTotals).map(([employee, totals]) => {
                                    const achievementRate = totals.target > 0 ? ((totals.june + totals.july + totals.august) / totals.target) * 100 : 0;
                                    return (
                                        <TableRow key={employee}>
                                            <TableCell>{employee}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(totals.target)}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={achievementRate >= 100 ? 'default' : 'secondary'}>
                                                    {achievementRate.toFixed(1)}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Card>
                 <CardHeader>
                    <CardTitle>총계</CardTitle>
                    <CardDescription>
                        전체 고객 및 제품에 대한 월별 실적 및 9월 목표 총합입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">6월 총 실적</span>
                            <span className="font-semibold">{formatCurrency(grandTotals.june)}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="font-medium">7월 총 실적</span>
                            <span className="font-semibold">{formatCurrency(grandTotals.july)}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="font-medium">8월 총 실적</span>
                            <span className="font-semibold">{formatCurrency(grandTotals.august)}</span>
                        </div>
                         <div className="flex justify-between items-center border-t pt-4 mt-4">
                            <span className="font-bold text-lg">9월 총 목표</span>
                            <span className="font-bold text-lg">{formatCurrency(grandTotals.target)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    