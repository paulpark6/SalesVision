
'use client';

import React, { useState, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';


const initialData: SalesTargetCustomer[] = [
  {
    id: 'cus-1',
    customerName: 'Cybernetics Inc.',
    customerCode: 'C-101',
    isNew: false,
    products: [
      {
        id: 'prod-1',
        productName: 'Quantum Drive',
        productCode: 'QD-001',
        sales: { june: 15000, july: 18000, august: 17000 },
        septemberTarget: 20000,
        septemberActual: 18500,
        quantity: 10,
        unitPrice: 2000,
      },
      {
        id: 'prod-2',
        productName: 'Nano Bots',
        productCode: 'NB-002',
        sales: { june: 5000, july: 6000, august: 5500 },
        septemberTarget: 7000,
        septemberActual: 6500,
        quantity: 13,
        unitPrice: 538.46,
      },
    ],
  },
  {
    id: 'cus-2',
    customerName: 'Innovate LLC',
    customerCode: 'C-102',
    isNew: false,
    products: [
      {
        id: 'prod-3',
        productName: 'AI Core',
        productCode: 'AI-003',
        sales: { june: 22000, july: 25000, august: 23000 },
        septemberTarget: 28000,
        septemberActual: 26000,
        quantity: 5,
        unitPrice: 5600,
      },
    ],
  },
  {
    id: 'cus-3',
    customerName: 'Tech Solutions',
    customerCode: 'C-103',
    isNew: true,
    products: [
      {
        id: uuidv4(),
        productName: '',
        productCode: '',
        sales: { june: 0, july: 0, august: 0 },
        septemberTarget: 0,
        septemberActual: 0,
        quantity: 0,
        unitPrice: 0,
      },
    ],
  },
];


export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialData);

  const [availableCustomers, setAvailableCustomers] = useState(allCustomers.map(c => ({ value: c.value, label: c.label, grade: c.grade })));
  const [availableProducts, setAvailableProducts] = useState(allProducts.map(p => ({ value: p.value, label: p.label, basePrice: p.basePrice })));

  const handleCustomerChange = (customerIndex: number, newCustomerCode: string) => {
    const selectedCustomer = availableCustomers.find(c => c.value === newCustomerCode);
    if (!selectedCustomer) return;

    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].customerName = selectedCustomer.label;
    newCustomerData[customerIndex].customerCode = selectedCustomer.value;
    setCustomerData(newCustomerData);
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, newProductCode: string) => {
    const selectedProduct = availableProducts.find(p => p.value === newProductCode);
    if (!selectedProduct) return;
  
    const newCustomerData = [...customerData];
    const product = newCustomerData[customerIndex].products[productIndex];
    product.productName = selectedProduct.label;
    product.productCode = newProductCode;
    product.unitPrice = selectedProduct.basePrice;
    product.septemberTarget = product.quantity * selectedProduct.basePrice;
  
    setCustomerData(newCustomerData);
  };
  
  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    const newCustomerData = [...customerData];
    const product = newCustomerData[customerIndex].products[productIndex];
    product.quantity = quantity;
    product.septemberTarget = quantity * product.unitPrice;
    setCustomerData(newCustomerData);
  };
  
  const handleUnitPriceChange = (customerIndex: number, productIndex: number, unitPrice: number) => {
    const newCustomerData = [...customerData];
    const product = newCustomerData[customerIndex].products[productIndex];
    product.unitPrice = unitPrice;
    product.septemberTarget = product.quantity * unitPrice;
    setCustomerData(newCustomerData);
  };

  const addProductToCustomer = (customerIndex: number) => {
    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      productCode: '',
      sales: { june: 0, july: 0, august: 0 },
      septemberTarget: 0,
      septemberActual: 0,
      quantity: 0,
      unitPrice: 0,
    });
    setCustomerData(newCustomerData);
  };

  const removeProductFromCustomer = (customerIndex: number, productIndex: number) => {
    const newCustomerData = [...customerData];
    newCustomerData[customerIndex].products.splice(productIndex, 1);
    // If last product is removed, remove customer
    if (newCustomerData[customerIndex].products.length === 0) {
      newCustomerData.splice(customerIndex, 1);
    }
    setCustomerData(newCustomerData);
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
          sales: { june: 0, july: 0, august: 0 },
          septemberTarget: 0,
          septemberActual: 0,
          quantity: 0,
          unitPrice: 0,
        },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
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
            <div className="flex gap-2">
                 <Link href="/sales/report">
                    <Button variant="outline">실적 보기</Button>
                </Link>
                <Button>목표 저장</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 매출 목표</CardTitle>
              <CardDescription>
                6월-8월 실적을 참고하여 9월 매출 목표를 설정합니다. 제품, 수량을 입력하면 목표 금액이 자동 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객</TableHead>
                    <TableHead className="w-[180px]">제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[100px] text-right">수량</TableHead>
                    <TableHead className="w-[120px] text-right">단가</TableHead>
                    <TableHead className="w-[120px] text-right">9월 목표</TableHead>
                    <TableHead className="w-[120px] text-right">9월 매출</TableHead>
                    <TableHead className="w-[150px]">달성률</TableHead>
                    <TableHead className="w-[50px]">액션</TableHead>
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
                                  items={availableCustomers}
                                  placeholder="고객 선택"
                                  searchPlaceholder="고객 검색..."
                                  noResultsMessage="고객을 찾을 수 없습니다."
                                  value={customer.customerCode}
                                  onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                />
                              ) : (
                                <div className='font-medium'>{customer.customerName}</div>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {customer.isNew || !product.productName ? (
                                <Combobox
                                items={availableProducts}
                                placeholder="제품 선택"
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productCode}
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
                                value={product.quantity} 
                                onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                                className="h-8 text-right"
                              />
                          </TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                value={product.unitPrice} 
                                onChange={(e) => handleUnitPriceChange(customerIndex, productIndex, parseFloat(e.target.value) || 0)}
                                className="h-8 text-right"
                                step="0.01"
                              />
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.septemberTarget)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.septemberActual)}</TableCell>
                          <TableCell>
                            <Progress value={(product.septemberActual / product.septemberTarget) * 100} />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProductFromCustomer(customerIndex, productIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                          <TableCell colSpan={11} className="p-0 pl-[195px]">
                               <Button variant="ghost" size="sm" onClick={() => addProductToCustomer(customerIndex)}>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Product
                                </Button>
                          </TableCell>
                      </TableRow>
                       {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={11} className='p-0'>
                                <div className="border-t my-2"></div>
                            </TableCell>
                          </TableRow>
                       )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
           <div className="flex justify-end mt-4">
              <Button onClick={addNewCustomer}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
