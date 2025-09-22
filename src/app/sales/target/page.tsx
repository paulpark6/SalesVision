
'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
import {
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const initialData: SalesTargetCustomer[] = [
    {
        id: 'C001',
        customerName: 'Cybernetics Inc.',
        products: [
            { id: 'P001-1', productName: 'Quantum Drive', june: 15000, july: 18000, august: 16000, target: 20000, isNew: false },
            { id: 'P002-1', productName: 'Nano Bots', june: 8000, july: 7500, august: 9000, target: 10000, isNew: false },
        ],
        isNew: false
    },
    {
        id: 'C002',
        customerName: 'Stellar Solutions',
        products: [
            { id: 'P003-2', productName: 'Plasma Rifle', june: 22000, july: 25000, august: 23000, target: 28000, isNew: false },
        ],
        isNew: false
    },
    {
        id: 'C003',
        customerName: 'Galaxy Emporium',
        products: [
            { id: 'P004-3', productName: 'Ion Shield', june: 12000, july: 11000, august: 13000, target: 15000, isNew: false },
            { id: 'P001-3', productName: 'Quantum Drive', june: 5000, july: 6000, august: 5500, target: 7000, isNew: false },
            { id: 'P005-3', productName: 'Gravity Boots', june: 3000, july: 3500, august: 4000, target: 5000, isNew: false },
        ],
        isNew: false
    }
];

const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000, lastYear: 35000 },
    { name: 'Alex Ray', current: 52000, target: 50000, lastYear: 55000 },
    { name: 'John Doe', current: 41000, target: 40000, lastYear: 39000 },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialData);
  
  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleAddCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          productName: '',
          june: 0,
          july: 0,
          august: 0,
          target: 0,
          isNew: true,
        },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
  };

  const handleRemoveCustomer = (customerId: string) => {
    setCustomerData(customerData.filter((c) => c.id !== customerId));
    toast({
      title: 'Customer Removed',
      description: 'The customer and their products have been removed from the target list.',
      variant: 'destructive'
    });
  };

  const handleAddProduct = (customerId: string) => {
    const newData = customerData.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          products: [
            ...c.products,
            {
              id: uuidv4(),
              productName: '',
              june: 0,
              july: 0,
              august: 0,
              target: 0,
              isNew: true,
            },
          ],
        };
      }
      return c;
    });
    setCustomerData(newData);
  };

  const handleRemoveProduct = (customerId: string, productId: string) => {
    const newData = customerData.map((c) => {
      if (c.id === customerId) {
        // If it's the last product, remove the customer as well
        if (c.products.length === 1) {
          handleRemoveCustomer(customerId);
          return null; 
        }
        return {
          ...c,
          products: c.products.filter((p) => p.id !== productId),
        };
      }
      return c;
    }).filter(Boolean) as SalesTargetCustomer[];

    setCustomerData(newData);
     toast({
      title: 'Product Removed',
      description: 'The product has been removed from the list.',
      variant: 'destructive'
    });
  };
  
  const handleCustomerChange = (customerId: string, newCustomerName: string) => {
     const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerName.toLowerCase());
     setCustomerData(customerData.map(c => 
        c.id === customerId ? { ...c, customerName: selectedCustomer?.label || newCustomerName } : c
     ));
  };
  
  const handleProductChange = (customerId: string, productId: string, newProductName: string) => {
    const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newProductName.toLowerCase());
    setCustomerData(customerData.map(c => {
        if (c.id === customerId) {
            return {
                ...c,
                products: c.products.map(p => 
                    p.id === productId ? { ...p, productName: selectedProduct?.label || newProductName } : p
                )
            };
        }
        return c;
    }));
  };

  const handleTargetChange = (customerId: string, productId: string, newTarget: number) => {
    setCustomerData(
      customerData.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            products: c.products.map((p) =>
              p.id === productId ? { ...p, target: newTarget } : p
            ),
          };
        }
        return c;
      })
    );
  };

  const handleSaveTargets = () => {
    // In a real app, you'd send this data to your backend.
    console.log(customerData);
    toast({
      title: 'Targets Saved',
      description: 'The sales targets for September have been successfully saved.',
    });
  };
  
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const totalTeamTarget = useMemo(() => {
    return employeeSalesTargets.reduce((sum, item) => sum + item.target, 0);
  }, []);
  const totalTeamActual = useMemo(() => {
    return employeeSalesTargets.reduce((sum, item) => sum + item.current, 0);
  }, []);
  const totalTeamAchievement = totalTeamTarget > 0 ? (totalTeamActual / totalTeamTarget) * 100 : 0;
  
  if (!role) {
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
          
           {(role === 'admin' || role === 'manager') && (
            <Card>
              <CardHeader>
                <CardTitle>팀원별 9월 목표 달성 현황</CardTitle>
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
                 <div className="flex justify-end gap-6 font-bold text-lg mt-6 pt-4 border-t">
                  <div>
                      <span>팀 총 목표: {formatCurrency(totalTeamTarget)}</span>
                  </div>
                  <div>
                      <span>팀 총 실적: {formatCurrency(totalTeamActual)}</span>
                  </div>
                   <div>
                      <span>팀 총 달성률: {totalTeamAchievement.toFixed(1)}%</span>
                  </div>
              </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>고객/제품별 9월 목표 설정</CardTitle>
              <CardDescription>
                6월-8월 실적을 기반으로 9월 매출 목표를 설정합니다. 신규 고객 또는 제품을 추가할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[250px]'>고객명</TableHead>
                    <TableHead className='w-[250px]'>제품명</TableHead>
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
                            <TableCell rowSpan={customer.products.length} className="align-top border-b">
                                <div className="flex items-start pt-1.5">
                                {customer.isNew ? (
                                    <Combobox
                                        items={allCustomers}
                                        placeholder="Select customer..."
                                        searchPlaceholder="Search customers..."
                                        noResultsMessage="No customer found."
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                    />
                                ) : (
                                    <span className='font-medium'>{customer.customerName}</span>
                                )}
                                </div>
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                               <Combobox
                                    items={allProducts}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                />
                            ) : (
                                <span className='font-medium'>{product.productName}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="h-8 text-right"
                              placeholder="0"
                              value={product.target || ''}
                              onChange={(e) => handleTargetChange(customer.id, product.id, parseInt(e.target.value) || 0)}
                            />
                          </TableCell>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top border-b">
                                <div className="flex items-center space-x-1 pt-1.5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleAddProduct(customer.id)}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => handleRemoveCustomer(customer.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                          )}
                           {productIndex > 0 && (
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleRemoveProduct(customer.id, product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={7} className='p-0'>
                                <div className="border-t"></div>
                            </TableCell>
                          </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-start mt-4">
                 <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSaveTargets}>Save Targets</Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
