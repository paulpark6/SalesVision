
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
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const initialData: SalesTargetCustomer[] = [
  {
    id: 'C-101',
    name: 'Cybernetics Inc.',
    grade: 'A',
    products: [
      { id: 'P-001', name: 'Quantum Drive', sales: { june: 5000, july: 5500, august: 6000 }, target: { quantity: 0, price: 0 } },
      { id: 'P-002', name: 'Nano Bots', sales: { june: 3000, july: 3200, august: 3500 }, target: { quantity: 0, price: 0 } },
    ],
    isNew: false
  },
  {
    id: 'C-102',
    name: 'Stellar Solutions',
    grade: 'B',
    products: [
      { id: 'P-003', name: 'Fusion Core', sales: { june: 10000, july: 11000, august: 12000 }, target: { quantity: 0, price: 0 } },
    ],
    isNew: false
  },
    {
    id: 'C-103',
    name: 'Bio-Gen',
    grade: 'A',
    products: [
        { id: 'P-004', name: 'Genetic Sequencer', sales: { june: 7000, july: 7500, august: 8000 }, target: { quantity: 0, price: 0 } },
    ],
    isNew: false
    },
];

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
}

export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    setCustomerData(initialData);
  }, []);

  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const handleCustomerChange = (
    customerIndex: number,
    field: 'name' | 'id' | 'grade',
    value: string
  ) => {
    const newData = [...customerData];
    const customer = newData[customerIndex];

    if (field === 'name') {
        const selectedCustomer = allCustomers.find(c => c.label === value);
        if (selectedCustomer) {
            customer.id = selectedCustomer.value;
            customer.name = selectedCustomer.label;
            customer.grade = selectedCustomer.grade;
        } else {
             customer.name = value;
             customer.id = '';
             customer.grade = '';
        }
    }

    setCustomerData(newData);
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, field: 'name' | 'id', value: string) => {
    const newData = [...customerData];
    const product = newData[customerIndex].products[productIndex];

    if(field === 'name') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
        if(selectedProduct) {
            product.name = selectedProduct.label;
            product.id = selectedProduct.value;
        } else {
            product.name = value;
            product.id = '';
        }
    }
    
    setCustomerData(newData);
  };
  
  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    const newData = [...customerData];
    const product = newData[customerIndex].products[productIndex];
    product.target.quantity = quantity;

    const selectedProduct = allProducts.find(p => p.value === product.id);
    const customerGrade = newData[customerIndex].grade;
    if (selectedProduct && customerGrade) {
        const discount = getDiscount(customerGrade);
        product.target.price = selectedProduct.basePrice * (1 - discount);
    } else {
        product.target.price = 0;
    }

    setCustomerData(newData);
  }

  const handleAddProduct = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: '',
      name: '',
      sales: { june: 0, july: 0, august: 0 },
      target: { quantity: 0, price: 0 },
      isNew: true
    });
    setCustomerData(newData);
  };
  
  const handleAddCustomer = () => {
    setCustomerData(prevData => [
      ...prevData,
      {
        id: `new-${Date.now()}`,
        name: '',
        grade: '',
        products: [
            { id: '', name: '', sales: { june: 0, july: 0, august: 0 }, target: { quantity: 0, price: 0 }, isNew: true },
        ],
        isNew: true
      }
    ]);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    if(newData[customerIndex].products.length === 1) {
        // If it's the last product, remove the customer
        newData.splice(customerIndex, 1);
    } else {
        newData[customerIndex].products.splice(productIndex, 1);
    }
    setCustomerData(newData);
  };
  
  const handleRemoveCustomer = (customerIndex: number) => {
    const newData = [...customerData];
    newData.splice(customerIndex, 1);
    setCustomerData(newData);
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitted Data:', customerData);
    // Here you would typically send the data to your backend
    alert('Changes saved! Check the console for the data.');
    router.push('/admin');
  };

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

  if (!role) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>월별/고객별 매출 목표 설정</CardTitle>
              <CardDescription>
                과거 3개월간의 매출 실적을 바탕으로 9월의 매출 목표를 설정합니다. 신규 고객 및 제품을 추가하여 목표를 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">고객명</TableHead>
                      <TableHead className="w-[180px]">제품명</TableHead>
                      <TableHead className="text-right">6월 매출</TableHead>
                      <TableHead className="text-right">7월 매출</TableHead>
                      <TableHead className="text-right">8월 매출</TableHead>
                      <TableHead className="w-[100px] text-right">수량</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, customerIndex) => (
                      <Fragment key={customer.id}>
                        {customer.products.map((product, productIndex) => {
                           const totalTarget = product.target.quantity * product.target.price;
                           return (
                          <TableRow key={`${customer.id}-${product.id}-${productIndex}`}>
                            {productIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="align-top font-medium border-r">
                                    {customer.isNew ? (
                                        <Combobox
                                            items={customerOptions}
                                            value={customer.name}
                                            onValueChange={(value) => handleCustomerChange(customerIndex, 'name', value)}
                                            placeholder="Select customer"
                                            searchPlaceholder="Search customers..."
                                            noResultsMessage="No customer found."
                                        />
                                    ) : (
                                        customer.name
                                    )}
                                    <div className='text-xs text-muted-foreground mt-1'>
                                        {customer.grade && `Grade: ${customer.grade}`}
                                    </div>
                                </TableCell>
                            )}
                            <TableCell>
                                {product.isNew ? (
                                    <Combobox
                                        items={productOptions}
                                        value={product.name}
                                        onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'name', value)}
                                        placeholder="Select product"
                                        searchPlaceholder="Search products..."
                                        noResultsMessage="No product found."
                                    />
                                ) : (
                                    product.name
                                )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                             <TableCell className="text-right">
                                <Input
                                    type="number"
                                    value={product.target.quantity || ''}
                                    onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                                    className="h-8 text-right"
                                    min="0"
                                />
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(totalTarget)}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        );
                        })}
                        <TableRow>
                            <TableCell colSpan={8} className="py-2 px-4">
                               <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddProduct(customerIndex)}
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Product
                                </Button>
                            </TableCell>
                        </TableRow>
                        {customerIndex < customerData.length - 1 && (
                            <TableRow>
                                <TableCell colSpan={8} className='p-0'>
                                    <div className="border-t my-2"></div>
                                </TableCell>
                            </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
                 <div className="mt-4">
                    <Button type="button" variant="outline" onClick={handleAddCustomer}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                </div>
                <CardFooter className="flex justify-end gap-2 mt-8">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
