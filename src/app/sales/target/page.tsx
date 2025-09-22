
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
  salesReportData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Helper to get a realistic sales figure for a month
const getSalesForMonth = (base: number, month: number) => {
  if (base === 0) return 0;
  // Simple variation based on month
  const variation = [0.9, 1.1, 1.0, 1.2, 0.8, 0.95, 1.05, 1.15, 1.2, 1.0, 0.9, 0.85];
  return Math.round(base * (variation[month] || 1) * (Math.random() * 0.2 + 0.9));
};

const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];


export default function SalesTargetPage() {
  const { toast } = useToast();
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
                name: reportItem.customerName,
                isNew: false,
                products: [],
            };
        }
        
        // This is an assumption: we link products based on some logic.
        // Here, we'll just pick a related product for demonstration.
        const product = allProducts.find(p => p.basePrice > 1000) || allProducts[0];
        
        customerMap[reportItem.customerCode].products.push({
            id: product.value,
            name: product.label,
            isNew: false,
            juneSales: getSalesForMonth(reportItem.actual, 5),
            julySales: getSalesForMonth(reportItem.actual, 6),
            augustSales: getSalesForMonth(reportItem.actual, 7),
            septemberTarget: reportItem.target,
        });
    });

    const initialData = Object.values(customerMap);
    setCustomerData(initialData);

  }, []);

  const handleCustomerChange = (customerIndex: number, field: keyof SalesTargetCustomer, value: any) => {
    const updatedData = [...customerData];
    (updatedData[customerIndex] as any)[field] = value;
    
    // If we select a customer, auto-populate details
    if (field === 'name') {
        const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
        if(selectedCustomer) {
            updatedData[customerIndex].id = selectedCustomer.value;
        }
    }
    
    setCustomerData(updatedData);
  };

  const handleProductChange = (customerIndex: number, productIndex: number, field: keyof SalesTargetCustomer['products'][0], value: any) => {
    const updatedData = [...customerData];
    (updatedData[customerIndex].products[productIndex] as any)[field] = value;
    
     if (field === 'name') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
        if(selectedProduct) {
            updatedData[customerIndex].products[productIndex].id = selectedProduct.value;
        }
    }
    setCustomerData(updatedData);
  };

  const addCustomerRow = () => {
    setCustomerData([
      ...customerData,
      {
        id: uuidv4(),
        name: '',
        isNew: true,
        products: [
          {
            id: uuidv4(),
            name: '',
            isNew: true,
            juneSales: 0,
            julySales: 0,
            augustSales: 0,
            septemberTarget: 0,
          },
        ],
      },
    ]);
  };
  
  const removeCustomerRow = (customerIndex: number) => {
    const updatedData = customerData.filter((_, index) => index !== customerIndex);
    setCustomerData(updatedData);
  };

  const addProductRow = (customerIndex: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products.push({
      id: uuidv4(),
      name: '',
      isNew: true,
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      septemberTarget: 0,
    });
    setCustomerData(updatedData);
  };

  const removeProductRow = (customerIndex: number, productIndex: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products = updatedData[customerIndex].products.filter(
      (_, index) => index !== productIndex
    );
    // If all products are removed, remove the customer as well
    if (updatedData[customerIndex].products.length === 0) {
        removeCustomerRow(customerIndex);
    } else {
        setCustomerData(updatedData);
    }
  };
  
  const handleSaveTargets = () => {
    toast({
        title: "Targets Saved",
        description: "The new sales targets have been successfully saved.",
    });
  }

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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
                <Button onClick={handleSaveTargets}>Save Targets</Button>
            </div>

             { (role === 'admin' || role === 'manager') &&
                <Card>
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
            }
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                고객 및 제품별 9월 매출 목표를 설정합니다. 6월-8월 실적을 참고하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/5">고객명</TableHead>
                    <TableHead className="w-1/5">제품명</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top border-r w-1/5">
                              {customer.isNew ? (
                                <Combobox
                                  items={allCustomers.map(c => ({ value: c.value, label: c.label }))}
                                  placeholder="Select customer..."
                                  searchPlaceholder="Search customers..."
                                  noResultsMessage="No customer found."
                                  value={customer.name}
                                  onValueChange={(value) => handleCustomerChange(customerIndex, 'name', value)}
                                />
                              ) : (
                                <div className="font-medium">{customer.name}</div>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="w-1/5">
                            {product.isNew ? (
                              <Combobox
                                items={allProducts.map(p => ({ value: p.value, label: p.label }))}
                                placeholder="Select product..."
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                value={product.name}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'name', value)}
                              />
                            ) : (
                              <div>{product.name}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={product.septemberTarget}
                              onChange={(e) =>
                                handleProductChange(customerIndex, productIndex, 'septemberTarget', parseInt(e.target.value) || 0)
                              }
                              className="h-8 w-24 text-right"
                            />
                          </TableCell>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="align-top border-l">
                              <div className="flex flex-col items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addProductRow(customerIndex)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                                {customer.isNew && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeCustomerRow(customerIndex)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                          {!customer.isNew && (
                            <TableCell className="p-0 m-0 w-0 h-0">
                                {productIndex !== 0 && (
                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeProductRow(customerIndex, productIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
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
            </CardContent>
          </Card>
          <div className="flex justify-start">
             <Button variant="outline" onClick={addCustomerRow}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer Target
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
