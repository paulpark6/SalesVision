
'use client';

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
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Updated initial data to include specific product sales for June, July, August
const salesTargetInitialData: SalesTargetCustomer[] = [
  {
    id: '1',
    customerName: 'Acme Inc.',
    isNew: false,
    products: [
      {
        id: 'p1',
        productName: 'Eco-friendly Widget',
        isNew: false,
        sales: { june: 1200, july: 1500, august: 1400 },
        target: 1500,
        achievement: 0,
      },
      {
        id: 'p2',
        productName: 'Premium Gadget',
        isNew: false,
        sales: { june: 800, july: 900, august: 850 },
        target: 1000,
        achievement: 0,
      },
    ],
  },
  {
    id: '2',
    customerName: 'Innovate LLC',
    isNew: false,
    products: [
      {
        id: 'p3',
        productName: 'Synergy Sphere',
        isNew: false,
        sales: { june: 2200, july: 2500, august: 2300 },
        target: 2500,
        achievement: 0,
      },
    ],
  },
  {
    id: '3',
    customerName: 'Solutions Co.',
    isNew: false,
    products: [
      {
        id: 'p4',
        productName: 'Eco-friendly Widget',
        isNew: false,
        sales: { june: 500, july: 600, august: 550 },
        target: 600,
        achievement: 0,
      },
       {
        id: 'p5',
        productName: 'Premium Gadget',
        isNew: false,
        sales: { june: 1100, july: 1300, august: 1200 },
        target: 1400,
        achievement: 0,
      },
       {
        id: 'p6',
        productName: 'Synergy Sphere',
        isNew: false,
        sales: { june: 300, july: 400, august: 350 },
        target: 500,
        achievement: 0,
      },
    ],
  },
];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();
  const role = auth?.role;

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const employeeSalesTargets = [
      { name: 'Jane Smith', current: 38000, target: 45000 },
      { name: 'Alex Ray', current: 52000, target: 50000 },
      { name: 'John Doe', current: 41000, target: 40000 },
  ];

  useEffect(() => {
    setIsMounted(true);
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    const initialData: SalesTargetCustomer[] = salesTargetInitialData.map(c => ({
      ...c,
      isNew: false,
      products: c.products.map(p => ({
        ...p,
        isNew: false,
        achievement: p.target > 0 ? ((p.sales.august / p.target) * 100) : 0, // Example achievement calc
      }))
    }));
    setCustomerData(initialData);
  }, []);

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

  const handleAddCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      isNew: true,
      products: [],
    };
    setCustomerData(prevData => [...prevData, newCustomer]);
  };

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(c => c.id !== customerId));
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(c => (c.id === customerId ? { ...c, customerName: newName, isNew: false } : c))
    );
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct = {
      id: uuidv4(),
      productName: '',
      isNew: true,
      sales: { june: 0, july: 0, august: 0 },
      target: 0,
      achievement: 0,
    };
    setCustomerData(prevData =>
      prevData.map(customer =>
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
          return { ...customer, products: customer.products.filter(p => p.id !== productId) };
        }
        return customer;
      })
    );
  }, []);
  
  const handleProductChange = useCallback((customerId: string, productId: string, newName: string) => {
      setCustomerData(prevData =>
          prevData.map(customer => {
              if (customer.id === customerId) {
                  return {
                      ...customer,
                      products: customer.products.map(p => p.id === productId ? {...p, productName: newName, isNew: false} : p)
                  };
              }
              return customer;
          })
      );
  }, []);

  const handleTargetChange = useCallback((customerId: string, productId: string, newTarget: number) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            products: customer.products.map(p =>
              p.id === productId ? { ...p, target: newTarget } : p
            ),
          };
        }
        return customer;
      })
    );
  }, []);

  const handleSave = () => {
    toast({
      title: '목표 저장됨',
      description: '9월 매출 목표가 성공적으로 저장되었습니다.',
    });
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Dashboard
              </Button>
              <Button type="button" onClick={handleSave}>
                목표 저장
              </Button>
            </div>
          </div>
          
          {role === 'admin' && (
            <Card className="mb-8">
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
              <CardTitle>고객 및 제품별 목표</CardTitle>
              <CardDescription>
                6월-8월 실적을 바탕으로 9월 매출 목표를 설정합니다.
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
                    <TableHead className="w-[100px] text-center">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top">
                              {customer.isNew ? (
                                <Combobox
                                    items={customerOptions}
                                    value={customer.customerName}
                                    onValueChange={(newName) => handleCustomerChange(customer.id, newName)}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
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
                                    value={product.productName}
                                    onValueChange={(newName) => handleProductChange(customer.id, product.id, newName)}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                            ) : (
                                <div className='font-medium'>{product.productName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={product.target}
                              onChange={(e) => handleTargetChange(customer.id, product.id, parseInt(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-center">
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
                         <TableCell colSpan={6} className="py-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddProduct(customer.id)}
                            className="w-full justify-start gap-2"
                          >
                            <PlusCircle className="h-4 w-4" />
                            제품 추가
                          </Button>
                        </TableCell>
                        <TableCell className="text-center py-1">
                            {customerIndex > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveCustomer(customer.id)}
                                >
                                    <X className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-start border-t pt-6">
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
