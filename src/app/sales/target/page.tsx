
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';


// This function simulates fetching and processing initial data
const getInitialData = (): SalesTargetCustomer[] => {
  const customerDataMap = new Map<string, SalesTargetCustomer>();

  salesReportData.forEach(reportItem => {
    // This product has June, July, August sales data
    const product: SalesTargetProduct = {
      id: uuidv4(),
      productId: reportItem.productCode,
      productName: reportItem.productName,
      isNew: false,
      sales: {
        june: reportItem.sales.june,
        july: reportItem.sales.july,
        august: reportItem.sales.august,
      },
      quantity: reportItem.quantity,
      unitPrice: reportItem.unitPrice,
      targetAmount: reportItem.actual,
    };

    if (customerDataMap.has(reportItem.customerCode)) {
      // Add product to existing customer
      const customer = customerDataMap.get(reportItem.customerCode)!;
      customer.products.push(product);
    } else {
      // Create a new customer entry
      customerDataMap.set(reportItem.customerCode, {
        id: reportItem.customerCode,
        customerName: reportItem.customerName,
        customerGrade: 'A', // Assuming grade, should be in mock data
        isNew: false,
        products: [product],
      });
    }
  });

  // Add customers from `allCustomers` who are not in `salesReportData`
  allCustomers.forEach(customer => {
      if (!customerDataMap.has(customer.value)) {
          const defaultProduct = allProducts[0];
          customerDataMap.set(customer.value, {
              id: customer.value,
              customerName: customer.label,
              customerGrade: customer.grade,
              isNew: false, // This is existing customer but no sales in Jun-Aug
              products: [
                  {
                      id: uuidv4(),
                      productId: '',
                      productName: '',
                      isNew: true,
                      sales: { june: 0, july: 0, august: 0 },
                      quantity: 0,
                      unitPrice: 0,
                      targetAmount: 0,
                  }
              ]
          });
      }
  });


  return Array.from(customerDataMap.values());
};


export default function SalesTargetPage() {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    const initialData = getInitialData();
    setCustomerData(initialData);
  }, []);

  const getDiscount = useCallback((grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
  }, []);

  const handleProductChange = (customerIndex: number, productIndex: number, newProductId: string) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    const product = customer.products[productIndex];
    
    const selectedProduct = allProducts.find(p => p.value.toLowerCase() === newProductId.toLowerCase());

    if (selectedProduct) {
      product.productId = selectedProduct.value;
      product.productName = selectedProduct.label;
      const discount = getDiscount(customer.customerGrade);
      const finalPrice = selectedProduct.basePrice * (1 - discount);
      product.unitPrice = finalPrice;
      // Recalculate target amount
      product.targetAmount = product.quantity * finalPrice;
    } else {
        product.productId = '';
        product.productName = newProductId; // Keep the user's typed value if not found
        product.unitPrice = 0;
        product.targetAmount = 0;
    }

    setCustomerData(newCustomerData);
  };
  
  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    const product = customer.products[productIndex];

    const newQuantity = Math.max(0, quantity);
    product.quantity = newQuantity;
    product.targetAmount = newQuantity * product.unitPrice;
    
    setCustomerData(newCustomerData);
  };


  const handleCustomerChange = (customerIndex: number, newCustomerId: string) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    
    const selectedCustomer = allCustomers.find(c => c.value.toLowerCase() === newCustomerId.toLowerCase());
    if (selectedCustomer) {
      customer.id = selectedCustomer.value;
      customer.customerName = selectedCustomer.label;
      customer.customerGrade = selectedCustomer.grade;
      // When customer changes, we might need to re-evaluate product prices
      customer.products.forEach(p => {
        const prodInfo = allProducts.find(ap => ap.value === p.productId);
        if (prodInfo) {
          const discount = getDiscount(selectedCustomer.grade);
          const finalPrice = prodInfo.basePrice * (1 - discount);
          p.unitPrice = finalPrice;
          p.targetAmount = p.quantity * finalPrice;
        }
      });
    } else {
        customer.id = '';
        customer.customerName = newCustomerId;
        customer.customerGrade = '';
    }

    setCustomerData(newCustomerData);
  };

  const addProductToCustomer = (customerIndex: number) => {
    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].products.push({
      id: uuidv4(),
      productId: '',
      productName: '',
      isNew: true,
      sales: { june: 0, july: 0, august: 0 },
      quantity: 0,
      unitPrice: 0,
      targetAmount: 0,
    });
    setCustomerData(newCustomerData);
  };

  const removeProductFromCustomer = (customerIndex: number, productIndex: number) => {
    const newCustomerData = [...customerData];
    const customer = newCustomerData[customerIndex];
    if (customer.products.length > 1) {
      customer.products.splice(productIndex, 1);
    } else {
      // If it's the last product, just clear it instead of removing the row
      customer.products[productIndex] = {
        id: uuidv4(),
        productId: '',
        productName: '',
        isNew: true,
        sales: { june: 0, july: 0, august: 0 },
        quantity: 0,
        unitPrice: 0,
        targetAmount: 0,
      };
    }
    setCustomerData(newCustomerData);
  };
  
  const removeCustomer = (customerIndex: number) => {
    if (customerData.length > 1) {
        const newCustomerData = customerData.filter((_, index) => index !== customerIndex);
        setCustomerData(newCustomerData);
    } else {
        toast({
            title: "Cannot Remove",
            description: "You cannot remove the last customer.",
            variant: "destructive"
        })
    }
  };

  const handleSave = () => {
    console.log('Saved Data: ', customerData);
    toast({
      title: 'Success',
      description: '매출 목표가 성공적으로 저장되었습니다.',
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

  if (!role) {
    return null; // Or a loading spinner
  }
  
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">월별 매출 목표</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Dashboard로 돌아가기
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표 설정</CardTitle>
              <CardDescription>
                6, 7, 8월 실적을 참고하여 9월 매출 목표를 설정합니다. 제품과 수량을 선택하면 9월 목표가 자동으로 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">고객명</TableHead>
                      <TableHead className="w-[180px]">제품명</TableHead>
                      <TableHead className="w-[100px] text-right">6월 매출</TableHead>
                      <TableHead className="w-[100px] text-right">7월 매출</TableHead>
                      <TableHead className="w-[100px] text-right">8월 매출</TableHead>
                      <TableHead className="w-[100px] text-right">수량</TableHead>
                      <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                      <TableHead className="w-[50px]">액션</TableHead>
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
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                  />
                                ) : (
                                  customer.customerName
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
                                  value={product.productName}
                                  onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                                />
                              ) : (
                                product.productName
                              )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                            <TableCell className="text-right">
                               <Input
                                  type="number"
                                  className="h-8 w-20 text-right"
                                  value={product.quantity || ''}
                                  onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value))}
                                  placeholder="0"
                                />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatCurrency(product.targetAmount)}
                            </TableCell>
                            <TableCell>
                              {customer.products.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeProductFromCustomer(customerIndex, productIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={8} className="py-2 px-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => addProductToCustomer(customerIndex)}
                                >
                                    <PlusCircle className="h-4 w-4" />
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
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
