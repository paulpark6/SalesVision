
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
  salesTargetPageData,
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

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targetData, setTargetData] = useState<SalesTargetCustomer[]>(salesTargetPageData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [isModified, setIsModified] = useState(false);

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
    return amount.toLocaleString('en-US');
  };

  const handleInputChange = (
    customerIndex: number,
    productIndex: number,
    field: 'target' | 'june' | 'july' | 'august',
    value: string
  ) => {
    const newData = [...targetData];
    const numericValue = parseInt(value, 10) || 0;
    newData[customerIndex].products[productIndex][field] = numericValue;
    setTargetData(newData);
    setIsModified(true);
  };

  const addProduct = (customerIndex: number) => {
    const newData = [...targetData];
    newData[customerIndex].products.push({
      productName: '',
      productCode: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0,
    });
    setTargetData(newData);
    setIsModified(true);
  };
  
  const handleProductSelect = (
    customerIndex: number,
    productIndex: number,
    productLabel: string,
  ) => {
    const newData = [...targetData];
    const selectedProduct = allProducts.find(p => p.label.toLowerCase() === productLabel.toLowerCase());
    
    const product = newData[customerIndex].products[productIndex];
    product.productName = selectedProduct ? selectedProduct.label : productLabel;
    product.productCode = selectedProduct ? selectedProduct.value : '';
    
    setTargetData(newData);
    setIsModified(true);
  };


  const removeProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...targetData];
    newData[customerIndex].products.splice(productIndex, 1);
    setTargetData(newData);
    setIsModified(true);
  };

  const addCustomer = () => {
    setTargetData([
      ...targetData,
      {
        employeeName: '',
        customerName: '',
        customerCode: `NEW-${Date.now()}`,
        products: [
          {
            productName: '',
            productCode: '',
            june: 0,
            july: 0,
            august: 0,
            target: 0,
          },
        ],
      },
    ]);
    setIsModified(true);
  };
  
  const handleCustomerSelect = (customerIndex: number, customerLabel: string) => {
    const newData = [...targetData];
    const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === customerLabel.toLowerCase());

    const customer = newData[customerIndex];
    customer.customerName = selectedCustomer ? selectedCustomer.label : customerLabel;
    
    if (selectedCustomer && (role === 'manager' || role === 'admin')) {
      const assignedEmployee = employees.find(e => e.name === customer.employeeName);
      if(assignedEmployee) {
        customer.employeeName = assignedEmployee.name;
      }
    }

    setTargetData(newData);
    setIsModified(true);
  };


  const removeCustomer = (customerIndex: number) => {
    const newData = [...targetData];
    newData.splice(customerIndex, 1);
    setTargetData(newData);
    setIsModified(true);
  };

  const handleEmployeeChange = (customerIndex: number, employeeValue: string) => {
      const newData = [...targetData];
      const employee = employees.find(e => e.value === employeeValue);
      if (employee) {
          newData[customerIndex].employeeName = employee.name;
          setTargetData(newData);
          setIsModified(true);
      }
  };
  
  const handleSubmit = () => {
    toast({
        title: 'Approval Request Sent',
        description: 'The sales targets for September have been submitted for approval.',
    });
    setIsModified(false);
  }

  const filteredData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targetData;
    }
    return targetData.filter(d => d.employeeName === employees.find(e => e.value === selectedEmployee)?.name);
  }, [targetData, selectedEmployee]);

  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    targetData.forEach(customer => {
        if (!totals[customer.employeeName]) {
            totals[customer.employeeName] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(product => {
            totals[customer.employeeName].june += product.june;
            totals[customer.employeeName].july += product.july;
            totals[customer.employeeName].august += product.august;
            totals[customer.employeeName].target += product.target;
        });
    });
    return totals;
  }, [targetData]);

  if (!role) {
    return null;
  }

  const employeeSelectOptions = employees.map(e => ({ value: e.value, label: e.name }));

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
              {isModified && (
                  <Button onClick={handleSubmit}>Submit for Approval</Button>
              )}
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 기반으로 9월(당월) 매출 목표를 설정합니다.
              </CardDescription>
               <div className="flex items-end gap-4 pt-4">
                 {(role === 'manager' || role === 'admin') && (
                    <div className="grid gap-2 w-[200px]">
                      <label htmlFor="employee-filter">담당자 필터</label>
                      <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger id="employee-filter">
                              <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">전체</SelectItem>
                              {employees.map(e => (
                                  <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    </div>
                 )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' && (role === 'admin' || role === 'manager') ? (
                  <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">담당자별 합계</h3>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>담당자</TableHead>
                                  <TableHead className="text-right">6월</TableHead>
                                  <TableHead className="text-right">7월</TableHead>
                                  <TableHead className="text-right">8월</TableHead>
                                  <TableHead className="text-right">9월 목표</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {Object.entries(employeeTotals).map(([employeeName, totals]) => (
                                  <TableRow key={employeeName}>
                                      <TableCell className="font-medium">{employeeName}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                      <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
              ) : null}
              <div className="overflow-x-auto">
                <Table className="min-w-max whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      {(role === 'manager' || role === 'admin') && <TableHead className="w-[180px]">담당자</TableHead>}
                      <TableHead className="w-[250px]">고객명</TableHead>
                      <TableHead className="w-[250px]">제품명</TableHead>
                      <TableHead className="text-right">6월</TableHead>
                      <TableHead className="text-right">7월</TableHead>
                      <TableHead className="text-right">8월</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((customer, customerIndex) => (
                      <>
                        {customer.products.map((product, productIndex) => (
                          <TableRow key={`${customer.customerCode}-${product.productCode || productIndex}`}>
                            {productIndex === 0 && (
                              <TableCell rowSpan={customer.products.length + 1} className="align-top pt-5">
                                {(role === 'manager' || role === 'admin') && (
                                    <Select
                                        value={employees.find(e => e.name === customer.employeeName)?.value}
                                        onValueChange={(value) => handleEmployeeChange(customerIndex, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="담당자 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map(e => (
                                                <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                              </TableCell>
                            )}
                            {productIndex === 0 && (
                              <TableCell rowSpan={customer.products.length + 1} className="align-top pt-5">
                                 <Combobox
                                    items={allCustomers.map(c => ({value: c.value, label: c.label}))}
                                    placeholder="고객 선택 또는 입력"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerSelect(customerIndex, value)}
                                    onAddNew={(newItem) => handleCustomerSelect(customerIndex, newItem)}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={allProducts}
                                    placeholder="제품 선택 또는 입력"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.productName}
                                    onValueChange={(value) => handleProductSelect(customerIndex, productIndex, value)}
                                    onAddNew={(newItem) => handleProductSelect(customerIndex, productIndex, newItem)}
                                />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="text"
                                value={product.target}
                                onChange={(e) => handleInputChange(customerIndex, productIndex, 'target', e.target.value)}
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeProduct(customerIndex, productIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={role === 'admin' || role === 'manager' ? 2 : 1}>
                              <Button variant="outline" size="sm" onClick={() => addProduct(customerIndex)}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  제품 추가
                              </Button>
                          </TableCell>
                          <TableCell colSpan={4}></TableCell>
                          <TableCell className="text-center">
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCustomer(customerIndex)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={addCustomer}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  고객 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    