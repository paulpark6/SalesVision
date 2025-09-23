
'use client';

import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { useAuth } from '@/hooks/use-auth';

const initialData: SalesTargetCustomer[] = salesReportData.map(
    (sale, index) => ({
      id: sale.customerCode,
      customerName: sale.customerName,
      isNew: false,
      products: [
        {
          id: `prod-${index}-1`,
          productName: allProducts[index % allProducts.length].label,
          juneSales: Math.random() > 0.3 ? Math.floor(Math.random() * 5000 + 1000) : 0,
          julySales: Math.random() > 0.3 ? Math.floor(Math.random() * 5000 + 1000) : 0,
          augustSales: Math.random() > 0.3 ? Math.floor(Math.random() * 5000 + 1000) : 0,
          septemberTarget: sale.target,
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: allProducts[index % allProducts.length].basePrice,
          isNew: false,
        },
        ...(index % 3 === 0 ? // Add a second product for some customers for demo
            [{
                id: `prod-${index}-2`,
                productName: allProducts[(index + 1) % allProducts.length].label,
                juneSales: Math.random() > 0.5 ? Math.floor(Math.random() * 3000) : 0,
                julySales: Math.random() > 0.5 ? Math.floor(Math.random() * 3000) : 0,
                augustSales: Math.random() > 0.5 ? Math.floor(Math.random() * 3000) : 0,
                septemberTarget: Math.floor(Math.random() * 10000),
                quantity: Math.floor(Math.random() * 5) + 1,
                unitPrice: allProducts[(index + 1) % allProducts.length].basePrice,
                isNew: false,
            }] : []
        )
      ],
    })
);


export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialData);
  const [availableProducts, setAvailableProducts] = useState(allProducts);

  const handleCustomerChange = (
    customerIndex: number,
    field: keyof SalesTargetCustomer,
    value: any
  ) => {
    const newData = [...customerData];
    (newData[customerIndex] as any)[field] = value;

    if (field === 'customerName') {
      const selectedCustomer = allCustomers.find(
        (c) => c.label.toLowerCase() === value.toLowerCase()
      );
      if (selectedCustomer) {
        newData[customerIndex].id = selectedCustomer.value;
      }
    }
    setCustomerData(newData);
  };

  const handleProductChange = (
    customerIndex: number,
    productIndex: number,
    field: keyof SalesTargetCustomer['products'][0],
    value: any
  ) => {
    const newData = [...customerData];
    const product = newData[customerIndex].products[productIndex];
    (product as any)[field] = value;

    if (field === 'productName') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
        if (selectedProduct) {
            product.unitPrice = selectedProduct.basePrice;
        }
    }

    if (field === 'quantity' || field === 'unitPrice') {
        product.septemberTarget = product.quantity * product.unitPrice;
    }


    setCustomerData(newData);
  };

  const addCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: `new-${customerData.length}`,
      customerName: '',
      isNew: true,
      products: [
        {
          id: 'new-prod-1',
          productName: '',
          juneSales: 0,
          julySales: 0,
          augustSales: 0,
          septemberTarget: 0,
          quantity: 1,
          unitPrice: 0,
          isNew: true,
        },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
  };

  const removeCustomer = (customerIndex: number) => {
    const newData = customerData.filter((_, i) => i !== customerIndex);
    setCustomerData(newData);
  };

  const addProduct = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: `new-prod-${new Date().getTime()}`,
      productName: '',
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
      quantity: 1,
      unitPrice: 0,
      isNew: true,
    });
    setCustomerData(newData);
  };

  const removeProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products = newData[customerIndex].products.filter(
      (_, i) => i !== productIndex
    );
    // If last product is removed, remove the customer
    if (newData[customerIndex].products.length === 0) {
      removeCustomer(customerIndex);
    } else {
      setCustomerData(newData);
    }
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
  
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
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
            <h1 className="text-2xl font-semibold">Sales Target Management</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 목표 설정</CardTitle>
              <CardDescription>
                고객 및 제품별 월별 매출 목표를 설정하고 관리합니다. 6-8월
                실적을 참고하여 9월 목표를 설정하세요.
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
                    <TableHead className="w-[120px] text-right">수량</TableHead>
                    <TableHead className="w-[120px] text-right">단가</TableHead>
                    <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top border-b">
                              {customer.isNew ? (
                                <Combobox
                                  items={allCustomers.map(c => ({ value: c.label, label: c.label }))}
                                  placeholder="Select customer"
                                  searchPlaceholder="Search customers..."
                                  noResultsMessage="No customer found."
                                  value={customer.customerName}
                                  onValueChange={(value) =>
                                    handleCustomerChange(
                                      customerIndex,
                                      'customerName',
                                      value
                                    )
                                  }
                                />
                              ) : (
                                <div className='font-medium py-2'>{customer.customerName}</div>
                              )}
                            </TableCell>
                          )}
                          <TableCell className='border-b'>
                            {product.isNew ? (
                               <Combobox
                                items={availableProducts.map(p => ({ value: p.label, label: p.label }))}
                                placeholder="Select product"
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                value={product.productName}
                                onValueChange={(value) =>
                                  handleProductChange(
                                    customerIndex,
                                    productIndex,
                                    'productName',
                                    value
                                  )
                                }
                              />
                            ) : (
                                <div className='py-2'>{product.productName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right border-b">
                            {formatCurrency(product.juneSales)}
                          </TableCell>
                          <TableCell className="text-right border-b">
                            {formatCurrency(product.julySales)}
                          </TableCell>
                          <TableCell className="text-right border-b">
                            {formatCurrency(product.augustSales)}
                          </TableCell>
                          <TableCell className="text-right border-b">
                             <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'quantity', parseInt(e.target.value) || 0)}
                                className="h-8 text-right"
                                min="0"
                             />
                          </TableCell>
                          <TableCell className="text-right border-b">
                             <Input
                                type="number"
                                value={product.unitPrice}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="h-8 text-right"
                                min="0"
                             />
                          </TableCell>
                          <TableCell className="text-right font-medium border-b">
                            {formatCurrency(product.septemberTarget)}
                          </TableCell>
                          <TableCell className='border-b'>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeProduct(customerIndex, productIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                         <TableCell 
                            colSpan={9} 
                            className="py-1 pl-40"
                         >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addProduct(customerIndex)}
                                className="text-sm"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </TableCell>
                      </TableRow>
                       {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={9} className='p-0'>
                                <div className="border-t my-2"></div>
                            </TableCell>
                          </TableRow>
                        )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4">
              <Button onClick={addCustomer} variant="outline">
                Add Customer
              </Button>
              <Button>Save Targets</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
