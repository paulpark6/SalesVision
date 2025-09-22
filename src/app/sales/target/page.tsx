
'use client';

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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Tech Solutions Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 15000, july: 16000, august: 15500, target: 17000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Global Imports',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'USB-C Hub', june: 800, july: 850, august: 820, target: 900 },
        ]
    },
    {
        id: 'cust-003',
        name: 'Innovate LLC',
        salesperson: 'John Doe',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleProductTargetChange = useCallback((customerIndex: number, productIndex: number, newTarget: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products[productIndex].target = newTarget;
    setCustomerData(updatedData);
  }, [customerData]);

  const handleAddProduct = useCallback((customerIndex: number) => {
    setCustomerData(prevData => {
        const newData = [...prevData];
        newData[customerIndex].products.push({
            id: `new-prod-${Date.now()}`,
            name: '',
            june: 0,
            july: 0,
            august: 0,
            target: 0
        });
        return newData;
    });
  }, []);

  const handleRemoveProduct = useCallback((customerIndex: number, productIndex: number) => {
    setCustomerData(prevData => {
        const newData = [...prevData];
        newData[customerIndex].products.splice(productIndex, 1);
        return newData;
    });
  }, []);

  const handleAddCustomer = useCallback(() => {
    const defaultSalesperson = role === 'employee' ? (employees.find(e => e.role === 'employee')?.name || '') : '';
    setCustomerData(prevData => [
        ...prevData,
        {
            id: `new-cust-${Date.now()}`,
            name: '',
            salesperson: defaultSalesperson,
            products: []
        }
    ]);
  }, [role]);

  const handleRemoveCustomer = useCallback((customerIndex: number) => {
    setCustomerData(prevData => prevData.filter((_, i) => i !== customerIndex));
  }, []);

    const handleCustomerNameChange = useCallback((customerIndex: number, name: string) => {
        setCustomerData(prevData => {
            const newData = [...prevData];
            newData[customerIndex].name = name;
            return newData;
        });
    }, []);

    const handleProductNameChange = useCallback((customerIndex: number, productIndex: number, name: string) => {
        setCustomerData(prevData => {
            const newData = [...prevData];
            const product = allProducts.find(p => p.label === name);
            newData[customerIndex].products[productIndex].name = name;
            // You might want to pre-fill past sales data if available
            // For now, we just update the name
            return newData;
        });
    }, []);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
      setIsMounted(true);
  }, []);

  useEffect(() => {
    if (role === 'employee') {
      setSelectedEmployee('Jane Smith');
    }
  }, [role]);

  const filteredData = useMemo(() => {
      if (selectedEmployee === 'all') return customerData;
      return customerData.filter(c => c.salesperson === selectedEmployee);
  }, [customerData, selectedEmployee]);

  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
        if (!totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(product => {
            totals[customer.salesperson].june += product.june;
            totals[customer.salesperson].july += product.july;
            totals[customer.salesperson].august += product.august;
            totals[customer.salesperson].target += product.target;
        });
    });
    return totals;
  }, [customerData]);


  const handleSubmit = () => {
    toast({
        title: "Approval Request Sent",
        description: "The sales targets have been submitted for manager approval.",
    });
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (!isMounted || !role) {
    return null; 
  }

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">매출 목표 설정</h1>
                    <CardDescription>
                        3개월간 고객별 제품 매출을 확인하고 9월(당월) 매출을 설정합니다.
                    </CardDescription>
                </div>
                 {(role === 'manager' || role === 'admin') && (
                    <div className="grid gap-2 w-48">
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {selectedEmployee === 'all' && (role === 'manager' || role === 'admin') && (
                 <Card>
                    <CardHeader>
                        <CardTitle>직원별 매출 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>직원</TableHead>
                                    <TableHead className="text-right">6월 실적</TableHead>
                                    <TableHead className="text-right">7월 실적</TableHead>
                                    <TableHead className="text-right">8월 실적</TableHead>
                                    <TableHead className="text-right">9월 목표</TableHead>
                                    <TableHead className="w-[200px]">8월 대비 목표 증감률</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(employeeTotals).map(([employeeName, totals]) => {
                                    const growthRate = totals.august > 0 ? ((totals.target - totals.august) / totals.august) * 100 : (totals.target > 0 ? 100 : 0);
                                    return (
                                        <TableRow key={employeeName}>
                                            <TableCell className="font-medium">{employeeName}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(totals.target)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={Math.max(0, 100 + growthRate)} className="h-2 flex-1" />
                                                    <span className="text-xs font-semibold w-12 text-right">{growthRate.toFixed(1)}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {filteredData.map((customer, customerIndex) => {
                const customerTotalJune = customer.products.reduce((sum, p) => sum + p.june, 0);
                const customerTotalJuly = customer.products.reduce((sum, p) => sum + p.july, 0);
                const customerTotalAugust = customer.products.reduce((sum, p) => sum + p.august, 0);
                const customerTotalTarget = customer.products.reduce((sum, p) => sum + p.target, 0);

                return (
                <Card key={customer.id}>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                             <div className="flex items-center gap-4">
                                <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택 또는 입력..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerNameChange(customerIndex, value)}
                                />
                                { (role === 'manager' || role === 'admin') && <p className="text-sm text-muted-foreground pt-2">{customer.salesperson}</p>}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomer(customerIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">제품</TableHead>
                                    <TableHead className="text-right">6월 실적</TableHead>
                                    <TableHead className="text-right">7월 실적</TableHead>
                                    <TableHead className="text-right">8월 실적</TableHead>
                                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.products.map((product, productIndex) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Combobox
                                            items={productOptions}
                                            placeholder="제품 선택 또는 입력..."
                                            searchPlaceholder="제품 검색..."
                                            noResultsMessage="제품을 찾을 수 없습니다."
                                            value={product.name}
                                            onValueChange={(value) => handleProductNameChange(customerIndex, productIndex, value)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                                    <TableCell className="text-right">
                                        <Input
                                            type="number"
                                            value={product.target}
                                            onChange={(e) => handleProductTargetChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                                            className="text-right h-8"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                                 <TableRow>
                                    <TableCell colSpan={6}>
                                        <Button variant="outline" size="sm" onClick={() => handleAddProduct(customerIndex)}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                             <tfoot className="border-t">
                                <TableRow className="font-semibold">
                                    <TableCell>합계</TableCell>
                                    <TableCell className="text-right">{formatCurrency(customerTotalJune)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(customerTotalJuly)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(customerTotalAugust)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(customerTotalTarget)}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </tfoot>
                        </Table>
                    </CardContent>
                </Card>
            )})}
            
            <div className="flex justify-between items-center gap-4 mt-4">
                <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 고객 추가
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit for Approval</Button>
                </div>
            </div>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
