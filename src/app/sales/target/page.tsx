
'use client';

import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductRow = {
  id: string;
  productName: string;
  productCode: string;
  avgSales: number;
  quantity: number;
  unitPrice: number;
  target: number;
  isFixed: boolean;
};

type CustomerData = {
  customerName: string;
  customerCode: string;
  products: ProductRow[];
  isFixed: boolean;
};

const getInitialData = (): CustomerData[] => {
  const customerMap: { [key: string]: CustomerData } = {};

  // Get unique customers from sales report data
  const customersWithSales = salesReportData.reduce((acc, sale) => {
    if (!acc.find(c => c.customerCode === sale.customerCode)) {
      const customerInfo = allCustomers.find(c => c.value === sale.customerCode);
      if (customerInfo) {
        acc.push({
          customerName: customerInfo.label,
          customerCode: customerInfo.value
        });
      }
    }
    return acc;
  }, [] as { customerName: string; customerCode: string }[]);

  customersWithSales.forEach(customer => {
    customerMap[customer.customerCode] = {
      customerName: customer.customerName,
      customerCode: customer.customerCode,
      products: [],
      isFixed: true // Mark as fixed since they have sales
    };
    
    // For simplicity, let's add one representative product row for each customer with sales
    // In a real app, you'd iterate through actual product sales for that customer
    const representativeProduct = allProducts[0];
    customerMap[customer.customerCode].products.push({
      id: uuidv4(),
      productName: representativeProduct.label,
      productCode: representativeProduct.value,
      avgSales: 550, // mock data
      quantity: 1, // mock data
      unitPrice: 1200, // mock data
      target: 1200, // mock data
      isFixed: true,
    });
  });

  return Object.values(customerMap);
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [data, setData] = useState<CustomerData[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
       setData(getInitialData());
    }
  }, [auth, router]);
  
  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleProductChange = (customerIndex: number, productIndex: number, field: keyof ProductRow, value: string | number) => {
    const newData = [...data];
    const product = newData[customerIndex].products[productIndex];
    
    if (field === 'productName') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
        if (selectedProduct) {
            product.productName = selectedProduct.label;
            product.productCode = selectedProduct.value;
            product.unitPrice = selectedProduct.basePrice; // Set default price
        } else {
            product.productName = value as string;
            product.productCode = '';
            product.unitPrice = 0;
        }
    } else if (field === 'quantity' || field === 'unitPrice') {
        (product[field] as number) = typeof value === 'string' ? parseFloat(value) : value;
    }

    product.target = product.quantity * product.unitPrice;
    
    setData(newData);
  };
  
  const handleCustomerChange = (customerIndex: number, value: string) => {
    const newData = [...data];
    const customer = newData[customerIndex];
    const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
    
    if (selectedCustomer) {
        customer.customerName = selectedCustomer.label;
        customer.customerCode = selectedCustomer.value;
    } else {
        customer.customerName = value;
        customer.customerCode = 'NEW';
    }
    setData(newData);
  };
  
  const handleAddNewCustomerRow = () => {
    const newCustomerRow: CustomerData = {
        customerName: '',
        customerCode: '',
        isFixed: false,
        products: [
            {
                id: uuidv4(),
                productName: '',
                productCode: '',
                avgSales: 0,
                quantity: 1,
                unitPrice: 0,
                target: 0,
                isFixed: false,
            }
        ],
    };
    setData([...data, newCustomerRow]);
  }
  
  const handleAddProductRow = (customerIndex: number) => {
      const newData = [...data];
      newData[customerIndex].products.push({
          id: uuidv4(),
          productName: '',
          productCode: '',
          avgSales: 0,
          quantity: 1,
          unitPrice: 0,
          target: 0,
          isFixed: false,
      });
      setData(newData);
  };
  
  const handleRemoveProductRow = (customerIndex: number, productIndex: number) => {
      const newData = [...data];
      const customer = newData[customerIndex];
      if (customer.products.length > 1) {
          customer.products.splice(productIndex, 1);
      } else {
          // If it's the last product for this customer, remove the customer
          newData.splice(customerIndex, 1);
      }
      setData(newData);
  };

  const availableCustomers = useMemo(() => {
    const usedCustomerCodes = data.map(d => d.customerCode);
    return allCustomers.filter(c => !usedCustomerCodes.includes(c.value));
  }, [data]);
  
  const handleSubmit = () => {
    toast({
        title: '목표 저장됨',
        description: '매출 목표가 성공적으로 저장되었습니다.'
    });
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  }

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
            <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
            <div className='flex gap-2'>
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
               <Button type="button" onClick={handleSubmit}>
                Save Targets
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 고객/제품 매출 목표</CardTitle>
              <CardDescription>
                고객별, 제품별 월간 매출 목표를 설정합니다. 기존 실적이 있는 항목은 고정됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>고객명</TableHead>
                    <TableHead className='w-[200px]'>제품명</TableHead>
                    <TableHead className='w-[150px]'>6월-8월 평균</TableHead>
                    <TableHead className='w-[120px]'>수량</TableHead>
                    <TableHead className='w-[150px]'>단가</TableHead>
                    <TableHead className='w-[150px]'>9월 목표</TableHead>
                    <TableHead className='w-[100px]'>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <React.Fragment key={item.customerCode}>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length} className="align-top font-medium">
                               <Combobox
                                    items={availableCustomers}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={item.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    disabled={item.isFixed}
                                />
                            </TableCell>
                          )}
                          <TableCell>
                             <Combobox
                                items={allProducts}
                                placeholder="제품 선택..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'productName', value)}
                                disabled={product.isFixed}
                            />
                          </TableCell>
                           <TableCell>
                                <Input
                                    type="text"
                                    value={formatCurrency(product.avgSales)}
                                    readOnly
                                    className="bg-muted border-none text-right"
                                />
                           </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(customerIndex, productIndex, 'quantity', e.target.value)}
                              className="w-full text-right"
                            />
                          </TableCell>
                           <TableCell>
                                <Input
                                    type="number"
                                    value={product.unitPrice}
                                    onChange={(e) => handleProductChange(customerIndex, productIndex, 'unitPrice', e.target.value)}
                                    className="w-full text-right"
                                />
                           </TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              value={formatCurrency(product.target)}
                              readOnly
                              className="bg-muted border-none text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                                {productIndex === item.products.length - 1 && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAddProductRow(customerIndex)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleRemoveProductRow(customerIndex, productIndex)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
               <Button variant="outline" className="mt-4" onClick={handleAddNewCustomerRow}>
                <PlusCircle className="mr-2 h-4 w-4" />
                고객 추가
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
