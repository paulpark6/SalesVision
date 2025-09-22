
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
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const formatCurrency = (amount: number) => {
  if (amount === 0) return '-';
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

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    // Transform salesReportData into SalesTargetCustomer format
    const customerMap: { [key: string]: SalesTargetCustomer } = {};

    salesReportData.forEach(reportItem => {
        if (!customerMap[reportItem.customerCode]) {
            customerMap[reportItem.customerCode] = {
                id: reportItem.customerCode,
                customerName: reportItem.customerName,
                isNew: false,
                products: []
            };
        }

        const existingCustomer = customerMap[reportItem.customerCode];
        
        // Find product from allProducts, fallback to creating a placeholder
        let productInfo = allProducts.find(p => p.label.toLowerCase() === reportItem.product.toLowerCase());
        
        existingCustomer.products.push({
            id: uuidv4(),
            productName: reportItem.product,
            isNew: false,
            juneSales: reportItem.juneSales,
            julySales: reportItem.julySales,
            augustSales: reportItem.augustSales,
            septemberTarget: reportItem.target,
            septemberActual: reportItem.actual,
        });
    });

    const initialData = Object.values(customerMap);
    setCustomerData(initialData);
  }, []);

  const handleCustomerChange = (customerIndex: number, productIndex: number, newValues: Partial<SalesTargetCustomer>) => {
    const newData = [...customerData];
    
    // Find the selected customer from allCustomers
    const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newValues.customerName?.toLowerCase());

    if(selectedCustomer) {
      // Check if this customer already exists in the target list
      const customerExists = newData.some((c, idx) => c.customerName === selectedCustomer.label && idx !== customerIndex);
      if (customerExists) {
        // This part needs a UI to inform user. For now, just reset.
        console.warn("Customer already exists in the list.");
        return; 
      }
      
      newData[customerIndex] = {
        ...newData[customerIndex],
        id: selectedCustomer.value,
        customerName: selectedCustomer.label,
        products: [
          {
            id: uuidv4(),
            productName: '',
            isNew: true,
            juneSales: 0,
            julySales: 0,
            augustSales: 0,
            septemberTarget: 0,
            septemberActual: 0,
          },
        ]
      };

    } else {
      // Handle case where it's a new customer not in the master list yet.
      // For now, we just update the name.
       newData[customerIndex].customerName = newValues.customerName || '';
    }

    setCustomerData(newData);
  };

  const handleProductChange = (customerIndex: number, productIndex: number, newValues: Partial<SalesTargetCustomer['products'][0]>) => {
    const newData = [...customerData];
    
    const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newValues.productName?.toLowerCase());

    if (selectedProduct) {
      const productExists = newData[customerIndex].products.some((p, idx) => p.productName === selectedProduct.label && idx !== productIndex);
      if (productExists) {
         console.warn("Product already exists for this customer.");
         return;
      }
      newData[customerIndex].products[productIndex] = {
        ...newData[customerIndex].products[productIndex],
        productName: selectedProduct.label,
        juneSales: 0,
        julySales: 0,
        augustSales: 0,
        septemberTarget: 0,
        septemberActual: 0,
      };
    } else {
       newData[customerIndex].products[productIndex].productName = newValues.productName || '';
    }
    
    setCustomerData(newData);
  };
  
  const handleTargetChange = (customerIndex: number, productIndex: number, newTarget: number) => {
    const newData = [...customerData];
    newData[customerIndex].products[productIndex].septemberTarget = newTarget;
    setCustomerData(newData);
  };

  const handleAddProduct = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      isNew: true,
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
      septemberActual: 0,
    });
    setCustomerData(newData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    const customer = newData[customerIndex];
    
    if (customer.products.length > 1) {
        customer.products.splice(productIndex, 1);
    } else {
        // If it's the last product, remove the entire customer row
        newData.splice(customerIndex, 1);
    }
    setCustomerData(newData);
  };

  const handleAddCustomer = () => {
    const newData = [...customerData];
    newData.push({
      id: uuidv4(),
      customerName: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          productName: '',
          isNew: true,
          juneSales: 0,
          julySales: 0,
          augustSales: 0,
          septemberTarget: 0,
          septemberActual: 0,
        },
      ],
    });
    setCustomerData(newData);
  };

  const handleSave = () => {
    // Logic to save the data
    console.log('Saving data:', customerData);
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  if (!role) {
    return null;
  }

  const renderableCustomers = customerData.filter(c => c.customerName);
  
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
              <Button onClick={handleSave}>Save Targets</Button>
            </div>
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
              <CardTitle>고객별/제품별 목표</CardTitle>
              <CardDescription>
                6-8월 실적을 기반으로 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="text-right">9월 실적</TableHead>
                    <TableHead className="text-right">달성률</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => {
                        const achievementRate = product.septemberTarget > 0 ? (product.septemberActual / product.septemberTarget) * 100 : (product.septemberActual > 0 ? 100 : 0);
                        return (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length + 1} className="align-top font-medium border-b-0">
                              {!customer.isNew ? (
                                customer.customerName
                              ) : (
                                <Combobox
                                  items={allCustomers.map(c => ({ value: c.value, label: c.label }))}
                                  placeholder="Select customer"
                                  searchPlaceholder="Search customers..."
                                  noResultsMessage="No customer found."
                                  value={customer.customerName}
                                  onValueChange={(value) => handleCustomerChange(customerIndex, productIndex, { customerName: value })}
                                />
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {!product.isNew ? (
                              product.productName
                            ) : (
                              <Combobox
                                items={allProducts.map(p => ({ value: p.value, label: p.label }))}
                                placeholder="Select product"
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, { productName: value })}
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={product.septemberTarget}
                              onChange={(e) => handleTargetChange(customerIndex, productIndex, parseInt(e.target.value))}
                              className="h-8 text-right"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.septemberActual)}</TableCell>
                          <TableCell className="text-right">
                            {achievementRate > 0 && `${achievementRate.toFixed(1)}%`}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        )
                      })}
                      <TableRow>
                            <TableCell className="py-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddProduct(customerIndex)}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            </TableCell>
                            <TableCell colSpan={7}></TableCell>
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
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
