
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  salesReportData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer, SalesTargetProduct } from '@/lib/mock-data';
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

// Helper to find product details from sales report data
const findProductSales = (customerCode: string, productName: string) => {
    const customerReport = salesReportData.find(r => r.customerCode === customerCode);
    // This is a mock. In reality, we'd have detailed product-level sales data.
    // Here we'll just simulate it.
    if (customerReport) {
        if (productName.includes('Quantum')) return { june: 12000, july: 13500, august: 14000 };
        if (productName.includes('Hyper')) return { june: 5000, july: 4500, august: 6000 };
        if (productName.includes('Photon')) return { june: 2000, july: 2500, august: 1800 };
    }
    return { june: 0, july: 0, august: 0 };
};

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: '1',
        customerName: 'Cybernetics Inc.',
        customerCode: 'C001',
        isNew: false,
        products: [
            {
                id: 'p1-1',
                productName: 'Quantum Drive',
                productCode: 'QD-001',
                juneSales: 12000,
                julySales: 13500,
                augustSales: 14000,
                septemberTarget: 15000,
            },
            {
                id: 'p1-2',
                productName: 'Hyper-V-L Processor',
                productCode: 'HVP-002',
                juneSales: 5000,
                julySales: 4500,
                augustSales: 6000,
                septemberTarget: 7000,
            }
        ]
    },
    {
        id: '2',
        customerName: 'Stellar Solutions',
        customerCode: 'C002',
        isNew: false,
        products: [
            {
                id: 'p2-1',
                productName: 'Photon Emitter',
                productCode: 'PE-003',
                juneSales: 2000,
                julySales: 2500,
                augustSales: 1800,
                septemberTarget: 3000,
            }
        ]
    }
];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCustomerData(initialCustomerData);
  }, []);

  const handleTargetChange = (customerIndex: number, productIndex: number, value: string) => {
    const newData = [...customerData];
    newData[customerIndex].products[productIndex].septemberTarget = parseInt(value, 10) || 0;
    setCustomerData(newData);
  };

  const addProductToCustomer = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      productCode: '',
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
    });
    setCustomerData(newData);
  };

  const removeProductFromCustomer = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.splice(productIndex, 1);
    setCustomerData(newData);
  };
  
  const addNewCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      customerCode: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          productName: '',
          productCode: '',
          juneSales: 0,
          julySales: 0,
          augustSales: 0,
          septemberTarget: 0,
        },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
  };
  
  const removeCustomer = (customerIndex: number) => {
    const newData = customerData.filter((_, index) => index !== customerIndex);
    setCustomerData(newData);
  };

  const handleCustomerChange = (customerIndex: number, value: string) => {
    const newData = [...customerData];
    const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
    if (selectedCustomer) {
        newData[customerIndex].customerName = selectedCustomer.label;
        newData[customerIndex].customerCode = selectedCustomer.value;
    } else {
        newData[customerIndex].customerName = value;
        newData[customerIndex].customerCode = '';
    }
    setCustomerData(newData);
  }

  const handleProductChange = (customerIndex: number, productIndex: number, value: string) => {
      const newData = [...customerData];
      const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
      if (selectedProduct) {
          newData[customerIndex].products[productIndex].productName = selectedProduct.label;
          newData[customerIndex].products[productIndex].productCode = selectedProduct.value;
      } else {
          newData[customerIndex].products[productIndex].productName = value;
          newData[customerIndex].products[productIndex].productCode = '';
      }
      setCustomerData(newData);
  }

  const handleSubmitTargets = () => {
    toast({
      title: '목표 제출 완료',
      description: '설정된 9월 매출 목표가 성공적으로 제출되었습니다.',
    });
  };

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted) {
    return null;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!role) return null;

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <Button type="button" variant="outline" onClick={() => router.push(role === 'admin' ? '/dashboard' : '/admin')}>
              Back to Dashboard
            </Button>
          </div>
          
          {role === 'admin' && (
             <Card>
              <CardHeader>
                <CardTitle>담당자 요약</CardTitle>
                <CardDescription>
                  팀원별 9월 목표 달성 현황 요약입니다.
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
              <CardTitle>고객별, 제품별 목표 설정</CardTitle>
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
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top border-r">
                              {customer.isNew ? (
                                <Combobox
                                  items={customerOptions}
                                  value={customer.customerName}
                                  onValueChange={(value) => handleCustomerChange(customerIndex, value)}
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
                            {customer.isNew || !product.productName ? (
                                <Combobox
                                    items={productOptions}
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                            ) : (
                                <div>{product.productName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={product.septemberTarget}
                              onChange={(e) => handleTargetChange(customerIndex, productIndex, e.target.value)}
                              className="h-8 text-right"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {productIndex === customer.products.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => addProductToCustomer(customerIndex)}
                                  className="h-8 w-8"
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProductFromCustomer(customerIndex, productIndex)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {productIndex === 0 && customer.products.length > 1 && (
                          <TableRow>
                            <TableCell colSpan={6} className='p-0'>
                                <div className="border-t"></div>
                            </TableCell>
                          </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={addNewCustomer} variant="outline" className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </CardContent>
            <CardFooter className="justify-end border-t pt-6">
                <Button onClick={handleSubmitTargets}>목표 제출</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    