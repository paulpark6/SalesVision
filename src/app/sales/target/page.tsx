
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Helper to generate a unique ID
const generateId = () => uuidv4();

const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

export default function SalesTargetPage() {
  const { toast } = useToast();
  const { auth } = useAuth();
  const role = auth?.role;
  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());


  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  // This should run only once on mount to set initial data
  useEffect(() => {
    const initialData: SalesTargetCustomer[] = salesReportData.map(c => {
        // Simple logic to assign 1 to 3 products to each customer
        const productCount = (c.actual % 3) + 1;
        const products: SalesTargetProduct[] = [];
        
        for (let i = 0; i < productCount; i++) {
             const product = allProducts[i % allProducts.length];
             const baseSale = c.actual / productCount;
             products.push({
                id: generateId(),
                name: product.label,
                code: product.value,
                // Distribute sales across months
                juneSales: baseSale * 0.3,
                julySales: baseSale * 0.4,
                augustSales: baseSale * 0.3,
                septemberTarget: Math.round((baseSale * 1.1) / 100) * 100, // Target is 110% of avg monthly, rounded
                isNew: false,
             });
        }

        return {
            id: c.customerCode,
            name: c.customerName,
            isNew: false,
            products: products,
        };
    });

    setCustomerData(initialData);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleCustomerChange = useCallback((customerIndex: number, customerName: string) => {
    setCustomerData(prev => {
      const newData = [...prev];
      const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === customerName.toLowerCase());
      if(selectedCustomer) {
        newData[customerIndex] = {
          ...newData[customerIndex],
          name: selectedCustomer.label,
          id: selectedCustomer.value
        };
      } else {
        newData[customerIndex] = {
          ...newData[customerIndex],
          name: customerName,
          id: 'custom'
        };
      }
      return newData;
    });
  }, []);


  const handleProductChange = useCallback((customerIndex: number, productIndex: number, productName: string) => {
    setCustomerData(prev => {
      const newData = [...prev];
      const customer = newData[customerIndex];
      const selectedProduct = allProducts.find(p => p.label.toLowerCase() === productName.toLowerCase());
      
      if (selectedProduct) {
        customer.products[productIndex] = {
            ...customer.products[productIndex],
            name: selectedProduct.label,
            code: selectedProduct.value,
        };
      } else {
        customer.products[productIndex] = {
            ...customer.products[productIndex],
            name: productName,
            code: 'custom',
        };
      }
      return newData;
    });
  }, []);
  
  const handleTargetChange = useCallback((customerIndex: number, productIndex: number, value: string) => {
    setCustomerData(prev => {
      const newData = [...prev];
      newData[customerIndex].products[productIndex].septemberTarget = parseFloat(value) || 0;
      return newData;
    });
  }, []);

  const addCustomer = useCallback(() => {
    setCustomerData(prev => [
      ...prev,
      {
        id: generateId(),
        name: '',
        isNew: true,
        products: [
          {
            id: generateId(),
            name: '',
            code: '',
            juneSales: 0,
            julySales: 0,
            augustSales: 0,
            septemberTarget: 0,
            isNew: true,
          }
        ],
      }
    ]);
  }, []);
  
  const removeCustomer = useCallback((customerIndex: number) => {
    setCustomerData(prev => prev.filter((_, i) => i !== customerIndex));
  }, []);

  const addProduct = useCallback((customerIndex: number) => {
    setCustomerData(prev => {
      const newData = [...prev];
      newData[customerIndex].products.push({
        id: generateId(),
        name: '',
        code: '',
        juneSales: 0,
        julySales: 0,
        augustSales: 0,
        septemberTarget: 0,
        isNew: true,
      });
      return newData;
    });
  }, []);

  const removeProduct = useCallback((customerIndex: number, productIndex: number) => {
    setCustomerData(prev => {
      const newData = [...prev];
      if (newData[customerIndex].products.length > 1) {
        newData[customerIndex].products = newData[customerIndex].products.filter((_, i) => i !== productIndex);
      } else {
        // If it's the last product, remove the customer as well
        return prev.filter((_, i) => i !== customerIndex);
      }
      return newData;
    });
  }, []);

  const handleSave = useCallback(() => {
    // Logic to save the data
    toast({
      title: 'Success',
      description: 'Sales targets have been saved successfully.',
    });
  }, [toast]);
  
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  };
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);
  
  const totals = useMemo(() => {
    return customerData.reduce((acc, customer) => {
        customer.products.forEach(p => {
            acc.june += p.juneSales;
            acc.july += p.julySales;
            acc.august += p.augustSales;
            acc.september += p.septemberTarget;
        });
        return acc;
    }, { june: 0, july: 0, august: 0, september: 0 });
  }, [customerData]);

  if (!isMounted || !auth) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
      <AppSidebar role={auth.role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
            </div>

            {role === 'admin' && (
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
            )}

            <Card>
                <CardHeader>
                <CardTitle>9월 매출 목표</CardTitle>
                <CardDescription>
                    6~8월 실적을 바탕으로 9월 매출 목표를 설정합니다.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table className='min-w-max'>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[200px]">고객명</TableHead>
                        <TableHead className="w-[200px]">제품명</TableHead>
                        <TableHead className="text-right w-[100px]">6월 매출</TableHead>
                        <TableHead className="text-right w-[100px]">7월 매출</TableHead>
                        <TableHead className="text-right w-[100px]">8월 매출</TableHead>
                        <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerData.map((customer, customerIndex) => (
                        <React.Fragment key={customer.id}>
                          {customer.products.map((product, productIndex) => (
                            <TableRow key={product.id}>
                              {productIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="align-top border-b">
                                   <Combobox
                                        items={customerOptions}
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                        placeholder="Select customer"
                                        searchPlaceholder="Search customer..."
                                        noResultsMessage="Customer not found."
                                        onAddNew={(newValue) => handleCustomerChange(customerIndex, newValue)}
                                    />
                                </TableCell>
                              )}
                              <TableCell className="border-b">
                                <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                                    placeholder="Select product"
                                    searchPlaceholder="Search product..."
                                    noResultsMessage="Product not found."
                                    onAddNew={(newValue) => handleProductChange(customerIndex, productIndex, newValue)}
                                />
                              </TableCell>
                              <TableCell className="text-right border-b">{formatCurrency(product.juneSales)}</TableCell>
                              <TableCell className="text-right border-b">{formatCurrency(product.julySales)}</TableCell>
                              <TableCell className="text-right border-b">{formatCurrency(product.augustSales)}</TableCell>
                              <TableCell className="text-right border-b">
                                <Input
                                    type="number"
                                    value={product.septemberTarget}
                                    onChange={(e) => handleTargetChange(customerIndex, productIndex, e.target.value)}
                                    className="h-8 text-right"
                                />
                              </TableCell>
                              <TableCell className="border-b">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => removeProduct(customerIndex, productIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {productIndex === customer.products.length - 1 && (
                                     <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => addProduct(customerIndex)}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                    <TableRow className="font-bold bg-muted/50">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(totals.september)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </Table>
                </div>
                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={addCustomer}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Customer Row
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                            // Reset logic can be implemented here
                            toast({ title: 'Notice', description: 'Reset functionality not implemented.'})
                        }}>Reset</Button>
                        <Button onClick={handleSave}>Save Targets</Button>
                    </div>
                </div>
                </CardContent>
            </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
