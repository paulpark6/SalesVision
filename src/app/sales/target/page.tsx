
'use client';

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
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { employeeTargets } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

type SalesTargetProduct = SalesTargetCustomer['products'][0];

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const initialData: SalesTargetCustomer[] = salesReportData.map((c, index) => ({
      id: c.customerCode,
      name: c.customerName,
      isNew: false,
      products: [
        {
          id: uuidv4(),
          name: allProducts[index % allProducts.length].label,
          lastYearSales: c.actual * 0.8, // Mock data
          avgSales: c.actual / 3, // Mock data
          target: 0,
        }
      ]
    }));
    setCustomerData(initialData);
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      name: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          name: '',
          lastYearSales: 0,
          avgSales: 0,
          target: 0,
        },
      ],
    };
    setCustomerData(prevData => [...prevData, newCustomer]);
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newCustomerName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? { ...customer, name: newCustomerName }
          : customer
      )
    );
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.filter(customer => customer.id !== customerId)
    );
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct: SalesTargetProduct = {
      id: uuidv4(),
      name: '',
      lastYearSales: 0,
      avgSales: 0,
      target: 0,
    };
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? { ...customer, products: [...customer.products, newProduct] }
          : customer
      )
    );
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: keyof SalesTargetProduct, value: string | number) => {
      setCustomerData(prevData =>
        prevData.map(customer => {
          if (customer.id === customerId) {
            const updatedProducts = customer.products.map(product => {
              if (product.id === productId) {
                return { ...product, [field]: value };
              }
              return product;
            });
            return { ...customer, products: updatedProducts };
          }
          return customer;
        })
      );
    }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.filter(
            product => product.id !== productId
          );
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  }, []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleSave = () => {
    // Logic to save the data
    console.log("Saving data:", customerData);
  };

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted) {
    return null; 
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };


  return (
    <SidebarProvider>
      <AppSidebar role={role || 'employee'} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
            </div>

            {role === 'admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle>담당자 요약</CardTitle>
                        <CardDescription>
                        팀원별 9월 목표 달성 현황입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
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
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>9월 매출 목표</CardTitle>
                    <CardDescription>
                        6월-8월 실적을 바탕으로 9월 매출 목표를 설정합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[250px]'>고객명</TableHead>
                                <TableHead className='w-[250px]'>제품명</TableHead>
                                <TableHead className="text-right">전년도 매출</TableHead>
                                <TableHead className="text-right">3개월 평균</TableHead>
                                <TableHead className='w-[150px] text-right'>9월 목표</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerData.map((customer, customerIndex) => (
                                <Fragment key={customer.id}>
                                    {customer.products.map((product, productIndex) => (
                                        <TableRow key={product.id}>
                                            {productIndex === 0 && (
                                                <TableCell rowSpan={customer.products.length} className="align-top">
                                                     {customer.isNew ? (
                                                        <Combobox
                                                            items={customerOptions}
                                                            placeholder="Select customer..."
                                                            searchPlaceholder="Search customers..."
                                                            noResultsMessage="No customer found."
                                                            value={customer.name}
                                                            onValueChange={(newValue) => handleCustomerChange(customer.id, newValue)}
                                                        />
                                                     ) : (
                                                        <div className="font-medium">{customer.name}</div>
                                                     )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Combobox
                                                    items={productOptions}
                                                    placeholder="Select product..."
                                                    searchPlaceholder="Search products..."
                                                    noResultsMessage="No product found."
                                                    value={product.name}
                                                    onValueChange={(newValue) => handleProductChange(customer.id, product.id, 'name', newValue)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(product.lastYearSales)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(product.avgSales)}</TableCell>
                                            <TableCell className="text-right">
                                                <Input
                                                    type="number"
                                                    value={product.target}
                                                    onChange={(e) => handleProductChange(customer.id, product.id, 'target', Number(e.target.value))}
                                                    className="text-right"
                                                    placeholder="0"
                                                />
                                            </TableCell>
                                             <TableCell className="align-top">
                                                {productIndex === 0 ? (
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomer(customer.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-1 px-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Add Product
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4">
                        <Button variant="outline" onClick={handleAddCustomer}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-end gap-2 pt-6">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Targets</Button>
                </CardFooter>
            </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    