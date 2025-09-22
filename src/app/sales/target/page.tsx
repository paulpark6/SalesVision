
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
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
  salesReportData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
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

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    // This is a temporary solution to create a more detailed structure
    // In a real app, this data would come from an API
    const initialData: SalesTargetCustomer[] = salesReportData.map((customer, index) => ({
      id: customer.customerCode,
      name: customer.customerName,
      employee: customer.employeeName,
      isNew: false,
      products: [
        {
          id: `P${index}-1`,
          name: 'Quantum Drive',
          juneSales: customer.actual > 20000 ? 12000 : 4000,
          julySales: customer.actual > 20000 ? 15000 : 5000,
          augustSales: customer.actual > 20000 ? 18000 : 6000,
          septemberTarget: 22000,
          isNew: false,
        },
        ...(customer.actual > 30000 ? [{
          id: `P${index}-2`,
          name: 'Nano Bots',
          juneSales: 5000,
          julySales: 6000,
          augustSales: 7000,
          septemberTarget: 10000,
          isNew: false,
        }] : []),
      ]
    }));
    setCustomerData(initialData);
  }, []);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleCustomerChange = (customerIndex: number, newCustomerName: string) => {
    const newCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerName.toLowerCase());
    if (newCustomer) {
      setCustomerData(prev => {
        const newData = [...prev];
        newData[customerIndex].name = newCustomer.label;
        newData[customerIndex].id = newCustomer.value;
        return newData;
      });
    }
  };

  const handleProductChange = (customerIndex: number, productIndex: number, newProductName: string) => {
    const newProduct = allProducts.find(p => p.label.toLowerCase() === newProductName.toLowerCase());
    if (newProduct) {
      setCustomerData(prev => {
        const newData = [...prev];
        newData[customerIndex].products[productIndex].name = newProduct.label;
        newData[customerIndex].products[productIndex].id = newProduct.value;
        return newData;
      });
    }
  };

  const handleTargetChange = (customerIndex: number, productIndex: number, newTarget: string) => {
    const targetValue = parseInt(newTarget, 10) || 0;
    setCustomerData(prev => {
      const newData = [...prev];
      newData[customerIndex].products[productIndex].septemberTarget = targetValue;
      return newData;
    });
  };

  const handleAddProductRow = (customerIndex: number) => {
    const newProduct = {
      id: uuidv4(),
      name: '',
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
      isNew: true,
    };
    const newData = [...customerData];
    newData[customerIndex].products.push(newProduct);
    setCustomerData(newData);
  };

  const handleRemoveProductRow = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    // If it's the last product for that customer, remove the customer
    if (newData[customerIndex].products.length === 1) {
      newData.splice(customerIndex, 1);
    } else {
      newData[customerIndex].products.splice(productIndex, 1);
    }
    setCustomerData(newData);
  };

  const handleAddCustomerRow = () => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      name: '',
      employee: 'Unassigned',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          name: '',
          juneSales: 0,
          julySales: 0,
          augustSales: 0,
          septemberTarget: 0,
          isNew: true,
        },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
  };
  
  const handleSaveTargets = () => {
    toast({
      title: '목표 저장 완료',
      description: '9월 매출 목표가 성공적으로 저장되었습니다.',
    });
  };


  if (!role) {
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
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          
          {(role === 'manager' || role === 'admin') && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>팀원별 9월 목표 달성 현황</CardTitle>
                <CardDescription>
                  팀원별 월간 매출 목표 달성 현황입니다. 이름을 클릭하면 상세 실적을 볼 수 있습니다.
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
              <CardTitle>고객 및 제품별 목표 설정</CardTitle>
              <CardDescription>
                6월-8월 실적을 기반으로 9월 매출 목표를 설정합니다. 새로운 고객 및 제품 목표를 추가할 수 있습니다.
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
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top font-medium border-r">
                                {customer.isNew ? (
                                    <Combobox
                                    items={allCustomers}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="No customer found."
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    />
                                ) : (
                                    customer.name
                                )}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                <Combobox
                                items={allProducts}
                                placeholder="Select product..."
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                value={product.name}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
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
                              type="text"
                              value={product.septemberTarget}
                              onChange={(e) => handleTargetChange(customerIndex, productIndex, e.target.value)}
                              className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveProductRow(customerIndex, productIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={7} className="p-1">
                          <Button variant="link" size="sm" onClick={() => handleAddProductRow(customerIndex)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product to {customer.name || "New Customer"}
                          </Button>
                        </TableCell>
                      </TableRow>
                       {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={7} className='p-0'>
                                <div className="border-t my-2"></div>
                            </TableCell>
                          </TableRow>
                       )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={handleSaveTargets}>9월 목표 저장</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
