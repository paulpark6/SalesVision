
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
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer, SalesTargetProduct } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid'; // For unique keys

// Initial data representing customers and their product sales from June to August
const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        salesperson: 'Jane Smith',
        customerName: 'Customer A',
        products: [
            { id: 'prod-1', productName: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-2', productName: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
    {
        id: 'cust-2',
        salesperson: 'Alex Ray',
        customerName: 'Customer B',
        products: [
            { id: 'prod-3', productName: 'Monitor 27"', june: 25000, july: 25500, august: 26000, target: 27000 },
        ]
    },
];


export default function SalesTargetPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      salesperson: '',
      customerName: '',
      products: [
        { id: uuidv4(), productName: '', june: 0, july: 0, august: 0, target: 0 }
      ],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, []);

  const handleDeleteCustomer = useCallback((customerId: string) => {
    setCustomerData(prev => prev.filter(customer => customer.id !== customerId));
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct: SalesTargetProduct = {
      id: uuidv4(),
      productName: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0
    };
    setCustomerData(prev => prev.map(customer => 
        customer.id === customerId 
            ? { ...customer, products: [...customer.products, newProduct] } 
            : customer
    ));
  }, []);

  const handleDeleteProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updatedProducts = customer.products.filter(product => product.id !== productId);
        // If all products are removed, remove the customer as well
        if (updatedProducts.length === 0) {
          return null;
        }
        return { ...customer, products: updatedProducts };
      }
      return customer;
    }).filter(Boolean) as SalesTargetCustomer[]);
  }, []);

  const handleCustomerChange = useCallback((customerId: string, field: 'salesperson' | 'customerName', value: string) => {
    setCustomerData(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, [field]: value } : customer
    ));
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: keyof Omit<SalesTargetProduct, 'id'>, value: string | number) => {
    setCustomerData(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          products: customer.products.map(product => 
            product.id === productId ? { ...product, [field]: value } : product
          )
        };
      }
      return customer;
    }));
  }, []);
  
  const handleNumericProductChange = useCallback((customerId: string, productId: string, field: 'june' | 'july' | 'august' | 'target', value: string) => {
      const numericValue = parseFloat(value) || 0;
      handleProductChange(customerId, productId, field, numericValue);
  }, [handleProductChange]);

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
    return Object.values(employeeTotals).reduce((acc, totals) => {
      acc.june += totals.june;
      acc.july += totals.july;
      acc.august += totals.august;
      acc.target += totals.target;
      return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [employeeTotals]);


  const handleSubmit = () => {
    toast({
      title: 'Approval Request Sent',
      description: 'The sales target plan has been submitted for manager approval.',
    });
    // In a real app, you would likely send the data to a server
    // and then redirect or update the UI.
  };

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
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
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Back to Dashboard
              </Button>
              <Button onClick={handleSubmit}>Submit for Approval</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                과거 3개월 실적을 기반으로 9월 매출 목표를 설정합니다. 설정된 목표는 관리자에게 보고됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      { (role === 'admin' || role === 'manager') && <TableHead className="w-[180px]">담당자</TableHead>}
                      <TableHead className="w-[250px]">고객</TableHead>
                      <TableHead className="w-[250px]">제품</TableHead>
                      <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[120px]">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <>
                                { (role === 'admin' || role === 'manager') && (
                                  <TableCell rowSpan={customer.products.length}>
                                    <Combobox
                                      items={employees}
                                      placeholder="담당자 선택..."
                                      searchPlaceholder="담당자 검색..."
                                      noResultsMessage="담당자를 찾을 수 없습니다."
                                      value={customer.salesperson}
                                      onValueChange={(value) => handleCustomerChange(customer.id, 'salesperson', value)}
                                    />
                                  </TableCell>
                                )}
                                <TableCell rowSpan={customer.products.length} className="align-top">
                                  <div className="flex flex-col gap-2">
                                     <Combobox
                                        items={customerOptions}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                        onAddNew={(newValue) => handleCustomerChange(customer.id, 'customerName', newValue)}
                                    />
                                    <Button size="sm" variant="outline" onClick={() => handleAddProduct(customer.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                    </Button>
                                  </div>
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              <Combobox
                                items={productOptions}
                                placeholder="제품 선택..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customer.id, product.id, 'productName', value)}
                                onAddNew={(newValue) => handleProductChange(customer.id, product.id, 'productName', newValue)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                               <Input type="number" value={product.june} onChange={(e) => handleNumericProductChange(customer.id, product.id, 'june', e.target.value)} className="h-8 text-right" />
                            </TableCell>
                            <TableCell className="text-right">
                               <Input type="number" value={product.july} onChange={(e) => handleNumericProductChange(customer.id, product.id, 'july', e.target.value)} className="h-8 text-right" />
                            </TableCell>
                            <TableCell className="text-right">
                               <Input type="number" value={product.august} onChange={(e) => handleNumericProductChange(customer.id, product.id, 'august', e.target.value)} className="h-8 text-right" />
                            </TableCell>
                            <TableCell className="text-right">
                               <Input type="number" value={product.target} onChange={(e) => handleNumericProductChange(customer.id, product.id, 'target', e.target.value)} className="h-8 text-right bg-blue-50 dark:bg-blue-900/30" />
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleDeleteProduct(customer.id, product.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    {prodIndex === 0 && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteCustomer(customer.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                               </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                   <TableFooter>
                        {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                             (role === 'admin' || role === 'manager') && (
                                <TableRow key={salesperson} className="bg-muted/50 font-semibold">
                                    <TableCell colSpan={3}>{salesperson} Total</TableCell>
                                    <TableCell className="text-right">${totals.june.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.july.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.august.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.target.toLocaleString()}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            )
                        ))}
                        <TableRow className="font-bold text-base">
                            <TableCell colSpan={role === 'employee' ? 2 : 3}>Grand Total</TableCell>
                            <TableCell className="text-right">${grandTotals.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotals.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotals.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${grandTotals.target.toLocaleString()}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <Button size="sm" variant="outline" className="mt-4" onClick={handleAddCustomer}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
