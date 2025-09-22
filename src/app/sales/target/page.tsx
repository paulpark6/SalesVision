
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  salesTargetData,
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targetData, setTargetData] = useState<SalesTargetCustomer[]>(salesTargetData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleCustomerChange = (
    customerIndex: number,
    field: keyof SalesTargetCustomer,
    value: any
  ) => {
    const newData = [...targetData];
    (newData[customerIndex] as any)[field] = value;
    setTargetData(newData);
  };

  const handleProductChange = (
    customerIndex: number,
    productIndex: number,
    field: string,
    value: string | number
  ) => {
    const newData = [...targetData];
    (newData[customerIndex].products[productIndex] as any)[field] = value;
    setTargetData(newData);
  };

  const addProductToCustomer = (customerIndex: number) => {
    const newData = [...targetData];
    newData[customerIndex].products.push({
      productCode: '',
      productName: '',
      sales: { june: 0, july: 0, august: 0 },
      target: 0,
    });
    setTargetData(newData);
  };

  const removeProductFromCustomer = (
    customerIndex: number,
    productIndex: number
  ) => {
    const newData = [...targetData];
    newData[customerIndex].products.splice(productIndex, 1);
    setTargetData(newData);
  };

  const addCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      customerCode: `C-${Math.floor(Math.random() * 1000)}`,
      customerName: '',
      salesperson: '',
      isNew: true,
      products: [
        {
          productCode: '',
          productName: '',
          sales: { june: 0, july: 0, august: 0 },
          target: 0,
        },
      ],
    };
    setTargetData([...targetData, newCustomer]);
  };

  const removeCustomer = (customerIndex: number) => {
    const newData = [...targetData];
    newData.splice(customerIndex, 1);
    setTargetData(newData);
  };

  const handleSubmitForApproval = () => {
    toast({
      title: '목표 제출 완료',
      description: '설정된 매출 목표가 관리자에게 보고되었습니다.',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targetData;
    }
    return targetData.filter(
      (d) => d.salesperson === selectedEmployee
    );
  }, [selectedEmployee, targetData]);
  
  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    targetData.forEach(customer => {
        if (!totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(product => {
            totals[customer.salesperson].june += product.sales.june;
            totals[customer.salesperson].july += product.sales.july;
            totals[customer.salesperson].august += product.sales.august;
            totals[customer.salesperson].target += product.target;
        });
    });
    return Object.entries(totals).map(([name, data]) => ({ name, ...data }));
  }, [targetData]);


  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <Button onClick={handleSubmitForApproval}>관리자에게 보고</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 확인하고 9월 목표를
                설정합니다.
              </CardDescription>
              <div className="flex items-center pt-4">
                <Select
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="담당자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.value} value={emp.name}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>담당자</TableHead>
                            <TableHead className="text-right">6월 매출</TableHead>
                            <TableHead className="text-right">7월 매출</TableHead>
                            <TableHead className="text-right">8월 매출</TableHead>
                            <TableHead className="text-right">9월 목표</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeTotals.map(emp => (
                            <TableRow key={emp.name}>
                                <TableCell className="font-medium">{emp.name}</TableCell>
                                <TableCell className="text-right">{formatCurrency(emp.june)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(emp.july)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(emp.august)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(emp.target)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      {role !== 'employee' && <TableHead className="w-[150px]">담당자</TableHead>}
                      <TableHead className="w-[250px]">고객명</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right w-[100px]">6월</TableHead>
                      <TableHead className="text-right w-[100px]">7월</TableHead>
                      <TableHead className="text-right w-[100px]">8월</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((customer, customerIndex) => (
                      <>
                        {customer.products.map((product, productIndex) => (
                          <TableRow key={`${customer.customerCode}-${product.productCode}-${productIndex}`} className={cn(productIndex > 0 && "border-t-0")}>
                            {productIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className={cn("align-top", customer.products.length > 1 && "border-b")}>
                                {role !== 'employee' && (
                                  <Select
                                    value={customer.salesperson}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, 'salesperson', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="담당자" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {employees.map((emp) => (
                                        <SelectItem key={emp.value} value={emp.name}>
                                          {emp.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </TableCell>
                            )}
                            {productIndex === 0 && (
                               <TableCell rowSpan={customer.products.length} className={cn("align-top", customer.products.length > 1 && "border-b")}>
                                {customer.isNew ? (
                                    <Input 
                                        placeholder="고객명 입력" 
                                        value={customer.customerName}
                                        onChange={(e) => handleCustomerChange(customerIndex, 'customerName', e.target.value)}
                                    />
                                ) : (
                                    <Combobox
                                        items={allCustomers.map(c => ({ value: c.label, label: c.label }))}
                                        value={customer.customerName}
                                        onValueChange={(value) => {
                                            const selected = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
                                            handleCustomerChange(customerIndex, 'customerName', selected?.label || value);
                                            handleCustomerChange(customerIndex, 'customerCode', selected?.value || '');
                                        }}
                                        placeholder="고객 선택"
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                    />
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                               <Combobox
                                    items={allProducts.map(p => ({ value: p.label, label: p.label }))}
                                    value={product.productName}
                                    onValueChange={(value) => {
                                        const selected = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
                                        handleProductChange(customerIndex, productIndex, 'productName', selected?.label || value);
                                        handleProductChange(customerIndex, productIndex, 'productCode', selected?.value || '');
                                    }}
                                    placeholder="제품 선택"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.sales.june)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.sales.july)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(product.sales.august)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.target}
                                onChange={(e) =>
                                  handleProductChange(
                                    customerIndex,
                                    productIndex,
                                    'target',
                                    Number(e.target.value)
                                  )
                                }
                                className="h-8 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-center align-middle">
                                <div className="flex items-center justify-center h-full">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeProductFromCustomer(customerIndex, productIndex)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell colSpan={role !== 'employee' ? 3 : 2} className="py-1">
                                <Button variant="ghost" size="sm" onClick={() => addProductToCustomer(customerIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                            <TableCell colSpan={4}></TableCell>
                            <TableCell className="text-center py-1">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => removeCustomer(customerIndex)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
             {selectedEmployee !== 'all' && (
                <CardFooter className="pt-6">
                    <Button variant="outline" onClick={addCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                    </Button>
                </CardFooter>
            )}
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
