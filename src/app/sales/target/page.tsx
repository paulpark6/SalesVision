
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        name: 'Acme Inc.',
        salesperson: 'Jane Smith',
        salespersonId: 'jane-smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
        ]
    },
    {
        id: 'cust-2',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        salespersonId: 'alex-ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 1500, july: 1600, august: 1550, target: 1700 },
        ]
    },
    {
        id: 'cust-3',
        name: 'Wayne Enterprises',
        salesperson: 'Jane Smith',
        salespersonId: 'jane-smith',
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
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleProductTargetChange = (customerIndex: number, productIndex: number, newTarget: number) => {
    const updatedCustomerData = [...customerData];
    updatedCustomerData[customerIndex].products[productIndex].target = newTarget;
    setCustomerData(updatedCustomerData);
  };

  const handleAddProduct = (customerIndex: number) => {
    const updatedCustomerData = [...customerData];
    updatedCustomerData[customerIndex].products.push({
      id: `prod-${new Date().getTime()}`,
      name: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0
    });
    setCustomerData(updatedCustomerData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const updatedCustomerData = [...customerData];
    updatedCustomerData[customerIndex].products.splice(productIndex, 1);
    setCustomerData(updatedCustomerData);
  };

  const handleAddCustomer = () => {
    const defaultSalesperson = employees.find(e => e.value === selectedEmployee) || employees[0];
    const newCustomer = {
      id: `cust-${new Date().getTime()}`,
      name: '',
      salesperson: defaultSalesperson.name,
      salespersonId: defaultSalesperson.value,
      products: [],
    };
    setCustomerData([...customerData, newCustomer]);
  };
  
  const handleRemoveCustomer = (customerIndex: number) => {
    const updatedCustomerData = customerData.filter((_, index) => index !== customerIndex);
    setCustomerData(updatedCustomerData);
  };

  const handleCustomerChange = (customerIndex: number, field: 'name' | 'salespersonId', value: string) => {
      const updatedCustomerData = [...customerData];
      const customer = updatedCustomerData[customerIndex];
      
      if (field === 'name') {
          customer.name = value;
      } else if (field === 'salespersonId') {
          const salesperson = employees.find(e => e.value === value);
          if (salesperson) {
              customer.salesperson = salesperson.name;
              customer.salespersonId = salesperson.value;
          }
      }
      setCustomerData(updatedCustomerData);
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, value: string) => {
      const updatedCustomerData = [...customerData];
      updatedCustomerData[customerIndex].products[productIndex].name = value;
      setCustomerData(updatedCustomerData);
  }

  const handleSubmitForApproval = () => {
    toast({
      title: "Approval Request Sent",
      description: "Your sales targets have been submitted for manager approval.",
    });
  };

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
        if (auth.role === 'employee') {
            setSelectedEmployee(auth.userId);
        }
    }
  }, [auth, router]);
  
  const filteredCustomerData = useMemo(() => {
    if (role === 'employee' && selectedEmployee) {
      return customerData.filter(c => c.salespersonId === selectedEmployee);
    }
    if (role === 'manager' && selectedEmployee) {
      return customerData.filter(c => c.salespersonId === selectedEmployee);
    }
    return customerData;
  }, [customerData, role, selectedEmployee]);

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

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  useEffect(() => {
    if (auth?.role && auth.role === 'employee') {
        setSelectedEmployee(auth.userId);
    }
  }, [auth]);

  if (!isMounted) {
    return null; 
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
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex gap-2 items-center">
              {(role === 'admin' || role === 'manager') && (
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="전체 직원" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">전체 직원</SelectItem>
                    {employees.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
              <Button type="button" onClick={handleSubmitForApproval}>
                Submit for Approval
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 실적을 바탕으로 9월 매출 목표를 설정합니다. 고객 또는 제품을 추가/삭제할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      { (role === 'admin' || role === 'manager') && <TableHead className="w-[150px]">담당자</TableHead>}
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                      <TableHead className="w-[50px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                                <>
                                 { (role === 'admin' || role === 'manager') && (
                                    <TableCell rowSpan={customer.products.length + 1}>
                                      <Select 
                                        value={customer.salespersonId}
                                        onValueChange={(value) => handleCustomerChange(custIndex, 'salespersonId', value)}
                                        disabled={role === 'employee'}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Employee"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {employees.map(e => <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                  )}
                                  <TableCell rowSpan={customer.products.length + 1}>
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="Select or add customer"
                                        searchPlaceholder="Search customers..."
                                        noResultsMessage="No customer found."
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(custIndex, 'name', value)}
                                    />
                                  </TableCell>
                                </>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="Select or add product"
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(custIndex, prodIndex, value)}
                                />
                            </TableCell>
                            <TableCell className="text-right">${product.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleProductTargetChange(custIndex, prodIndex, parseInt(e.target.value) || 0)}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(custIndex, prodIndex)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                             <TableCell colSpan={role === 'employee' ? 1 : 2}></TableCell>
                             <TableCell>
                                <Button variant="outline" size="sm" className="h-8" onClick={() => handleAddProduct(custIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                </Button>
                            </TableCell>
                            <TableCell colSpan={4}></TableCell>
                             <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(custIndex)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" className="mt-4" onClick={handleAddCustomer}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 고객 추가
                </Button>
              </div>
            </CardContent>
          </Card>

           {role !== 'employee' && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>직원별 목표 합계</CardTitle>
                        <CardDescription>설정된 9월 매출 목표의 직원별 합계입니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>직원</TableHead>
                                    <TableHead className="text-right">6월 실적 합계</TableHead>
                                    <TableHead className="text-right">7월 실적 합계</TableHead>
                                    <TableHead className="text-right">8월 실적 합계</TableHead>
                                    <TableHead className="text-right">9월 목표 합계</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                                    <TableRow key={salesperson}>
                                        <TableCell className="font-medium">{salesperson}</TableCell>
                                        <TableCell className="text-right">${totals.june.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${totals.july.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${totals.august.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">${totals.target.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
