
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

// This is a temporary data structure to simulate historical sales.
// In a real application, this would come from a database query.
const historicalSalesData = [
    { customerCode: "C-101", productCode: "p-001", sales: { june: 12000, july: 13500, august: 14000 } },
    { customerCode: "C-102", productCode: "p-002", sales: { june: 8000, july: 8500, august: 9000 } },
    { customerCode: "C-102", productCode: "p-003", sales: { june: 3000, july: 3200, august: 3500 } },
    { customerCode: "C-103", productCode: "p-004", sales: { june: 21000, july: 22000, august: 20500 } },
];


const getInitialData = (): SalesTargetCustomer[] => {
    const customerMap: { [key: string]: SalesTargetCustomer } = {};

    historicalSalesData.forEach(item => {
        const customerInfo = allCustomers.find(c => c.value === item.customerCode);
        const productInfo = allProducts.find(p => p.value === item.productCode);

        if (!customerInfo || !productInfo) return;

        if (!customerMap[item.customerCode]) {
            customerMap[item.customerCode] = {
                id: customerInfo.value,
                name: customerInfo.label,
                grade: customerInfo.grade,
                isNew: false,
                products: [],
            };
        }

        customerMap[item.customerCode].products.push({
            id: productInfo.value,
            name: productInfo.label,
            isNew: false,
            sales: {
                june: item.sales.june,
                july: item.sales.july,
                august: item.sales.august,
            },
            septemberTarget: 0,
            quantity: 0,
        });
    });

    // Add customers from salesReportData who might not be in historicalSalesData
    salesReportData.forEach(reportItem => {
        if (!customerMap[reportItem.customerCode]) {
            const customerInfo = allCustomers.find(c => c.value === reportItem.customerCode);
             if (!customerInfo) return;
             customerMap[reportItem.customerCode] = {
                id: customerInfo.value,
                name: customerInfo.label,
                grade: customerInfo.grade,
                isNew: false,
                products: [], // Start with empty products, can be added by user
            };
        }
    });


    // Ensure all customers are included, even if they have no sales
    allCustomers.forEach(customer => {
        if (!customerMap[customer.value]) {
            customerMap[customer.value] = {
                id: customer.value,
                name: customer.label,
                grade: customer.grade,
                isNew: false,
                products: [{
                    id: uuidv4(),
                    name: '',
                    isNew: true,
                    sales: { june: 0, july: 0, august: 0 },
                    septemberTarget: 0,
                    quantity: 0,
                }],
            };
        }
    });


    return Object.values(customerMap);
};


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
    setCustomerData(getInitialData());
  }, []);
  
  const handleProductChange = (customerIndex: number, productIndex: number, newProductId: string) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    const product = customer.products[productIndex];
    
    const selectedProduct = allProducts.find(p => p.value.toLowerCase() === newProductId.toLowerCase());

    if (selectedProduct) {
        product.id = selectedProduct.value;
        product.name = selectedProduct.label;
        
        const basePrice = selectedProduct.basePrice;
        const discount = getDiscount(customer.grade);
        const finalPrice = basePrice * (1 - discount);
        product.septemberTarget = finalPrice * (product.quantity || 0);
    }
    setCustomerData(newCustomerData);
  };

  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    const product = customer.products[productIndex];

    const selectedProduct = allProducts.find(p => p.value === product.id);
    if(selectedProduct) {
        const basePrice = selectedProduct.basePrice;
        const discount = getDiscount(customer.grade);
        const finalPrice = basePrice * (1 - discount);
        
        product.quantity = quantity;
        product.septemberTarget = finalPrice * quantity;
    }

    setCustomerData(newCustomerData);
  };

  const addProduct = (customerIndex: number) => {
    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].products.push({
      id: uuidv4(),
      name: '',
      isNew: true,
      sales: { june: 0, july: 0, august: 0 },
      septemberTarget: 0,
      quantity: 0,
    });
    setCustomerData(newCustomerData);
  };
  
  const removeProduct = (customerIndex: number, productIndex: number) => {
    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].products.splice(productIndex, 1);
    // If all products are removed, add a blank one
    if(newCustomerData[customerIndex].products.length === 0) {
        addProduct(customerIndex);
    }
    setCustomerData(newCustomerData);
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
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
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
  
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

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
          <Card>
            <CardHeader>
              <CardTitle>고객별/제품별 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 실적을 참고하여 9월 매출 목표를 설정합니다. 신규 고객 및 제품을 추가하여 목표를 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품명</TableHead>
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
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="font-medium align-top pt-6">
                              {customer.name}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(newValue) => {
                                        handleProductChange(customerIndex, productIndex, newValue);
                                    }}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품 없음."
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
                                    value={product.quantity || ''}
                                    onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                                    className="h-8 text-right"
                                    placeholder='0'
                                    min="0"
                                />
                           </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.septemberTarget)}</TableCell>
                          <TableCell>
                            {customer.products.length > 1 && (
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeProduct(customerIndex, productIndex)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                          <TableCell colSpan={8} className="py-2 px-4">
                             <Button variant="ghost" size="sm" onClick={() => addProduct(customerIndex)} className='-ml-2'>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                          </TableCell>
                      </TableRow>
                        {customerIndex < customerData.length -1 && (
                          <TableRow>
                            <TableCell colSpan={8} className='p-0'>
                                <div className="border-t"></div>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="default">Save Targets</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    