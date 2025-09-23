
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
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// In a real application, this would come from an API call
const salesHistory = [
    { customerCode: 'C-101', productCode: 'p-001', sales: { june: 1500, july: 1600, august: 1700 } },
    { customerCode: 'C-101', productCode: 'p-002', sales: { june: 800, july: 900, august: 850 } },
    { customerCode: 'C-102', productCode: 'p-003', sales: { june: 2200, july: 2100, august: 2300 } },
    { customerCode: 'C-103', productCode: 'p-004', sales: { june: 0, july: 1200, august: 1300 } },
];


const getInitialData = (): SalesTargetCustomer[] => {
    const customerMap: { [key: string]: SalesTargetCustomer } = {};

    salesHistory.forEach(historyItem => {
        const customerInfo = allCustomers.find(c => c.value === historyItem.customerCode);
        if (!customerInfo) return;

        if (!customerMap[customerInfo.value]) {
            customerMap[customerInfo.value] = {
                id: customerInfo.value,
                customerName: customerInfo.label,
                customerCode: customerInfo.value,
                customerGrade: customerInfo.grade,
                isNew: false,
                products: [],
            };
        }
        
        const productInfo = allProducts.find(p => p.value === historyItem.productCode);
        if (!productInfo) return;

        const productTarget = {
            id: productInfo.value,
            productName: productInfo.label,
            productCode: productInfo.value,
            quantity: 0,
            target: 0,
            isNew: false,
            sales: {
                june: historyItem.sales.june,
                july: historyItem.sales.july,
                august: historyItem.sales.august,
            }
        };

        customerMap[customerInfo.value].products.push(productTarget);
    });
    
    // Add customers who are in allCustomers but not in salesHistory
    allCustomers.forEach(customer => {
        if (!customerMap[customer.value]) {
            customerMap[customer.value] = {
                id: customer.value,
                customerName: customer.label,
                customerCode: customer.value,
                customerGrade: customer.grade,
                isNew: false,
                products: [], // Start with no products, can be added by user
            };
        }
    });


    return Object.values(customerMap).sort((a,b) => a.customerName.localeCompare(b.customerName));
};


export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const { toast } = useToast();

  const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
  };

  useEffect(() => {
    const initialData = getInitialData();
    setCustomerData(initialData);
  }, []);

  const handleProductChange = (customerIndex: number, productIndex: number, field: string, value: any) => {
    const newData = [...customerData];
    const customer = newData[customerIndex];
    const product = customer.products[productIndex];
    
    if (field === 'product') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
        if(selectedProduct) {
            product.productName = selectedProduct.label;
            product.productCode = selectedProduct.value;
        } else {
            product.productName = value;
            product.productCode = '';
        }
    } else if (field === 'quantity') {
        product.quantity = Number(value);
    }
    
    // Recalculate target
    const productInfo = allProducts.find(p => p.value === product.productCode);
    if (productInfo) {
      const discount = getDiscount(customer.customerGrade);
      const unitPrice = productInfo.basePrice * (1 - discount);
      product.target = product.quantity * unitPrice;
    } else {
      product.target = 0;
    }

    setCustomerData(newData);
  };
  
  const handleAddNewProduct = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      productCode: '',
      quantity: 0,
      target: 0,
      isNew: true,
      sales: { june: 0, july: 0, august: 0 }
    });
    setCustomerData(newData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.splice(productIndex, 1);
    setCustomerData(newData);
  };
  
  const handleSaveTargets = () => {
    // Logic to save the data would go here
    console.log('Saving data:', JSON.stringify(customerData, null, 2));
    toast({
        title: "Targets Saved",
        description: "The new sales targets have been successfully saved.",
    });
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

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 목표 수립</CardTitle>
              <CardDescription>
                과거 3개월 매출 실적을 참고하여 9월 목표를 설정합니다. 신규 고객 및 제품을 추가하여 목표를 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[15%]">고객명</TableHead>
                      <TableHead className="w-[20%]">제품명</TableHead>
                      <TableHead className="text-right">6월 매출</TableHead>
                      <TableHead className="text-right">7월 매출</TableHead>
                      <TableHead className="text-right">8월 매출</TableHead>
                      <TableHead className="w-[100px]">수량</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, customerIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, productIndex) => (
                          <TableRow key={product.id}>
                            {productIndex === 0 && (
                              <TableCell rowSpan={customer.products.length + 1} className="font-medium align-top pt-6">
                                {customer.customerName}
                              </TableCell>
                            )}
                            <TableCell>
                              {product.isNew ? (
                                <Combobox
                                  items={allProducts}
                                  placeholder="제품 선택"
                                  searchPlaceholder="제품 검색..."
                                  noResultsMessage="제품을 찾을 수 없습니다."
                                  value={product.productName}
                                  onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'product', value)}
                                />
                              ) : (
                                product.productName
                              )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                            <TableCell>
                               <Input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) => handleProductChange(customerIndex, productIndex, 'quantity', e.target.value)}
                                  className="h-8 text-right"
                                  min="0"
                                />
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(product.target)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={7} className="py-2 pl-2">
                                <Button variant="outline" size="sm" onClick={() => handleAddNewProduct(customerIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            </TableCell>
                        </TableRow>
                        {customerIndex < customerData.length -1 && (
                             <TableRow>
                                <TableCell colSpan={8} className='p-0'>
                                    <div className="border-t my-2"></div>
                                </TableCell>
                            </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-4">
               <Button type="button" variant="outline" onClick={handleBack}>
                취소
              </Button>
              <Button onClick={handleSaveTargets}>
                목표 저장
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
