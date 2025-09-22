
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
import { useEffect, useState, useMemo, Fragment } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(salesTargetData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<{ name: string; salesperson: string }>({ name: '', salesperson: '' });

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTargetChange = (customerIndex: number, productIndex: number, newTarget: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products[productIndex].target = newTarget;
    setCustomerData(updatedData);
  };

  const handleAddProduct = (customerIndex: number) => {
    const updatedData = [...customerData];
    const newProduct = {
      id: `new-${Date.now()}`,
      name: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0,
      isNew: true, // flag for product combobox
    };
    updatedData[customerIndex].products.push(newProduct);
    setCustomerData(updatedData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const updatedData = [...customerData];
    updatedData[customerIndex].products.splice(productIndex, 1);
    setCustomerData(updatedData);
  };

  const handleProductSelection = (customerIndex: number, productIndex: number, productName: string) => {
      const updatedData = [...customerData];
      const product = allProducts.find(p => p.label.toLowerCase() === productName.toLowerCase());
      if (product) {
          updatedData[customerIndex].products[productIndex].name = product.label;
          updatedData[customerIndex].products[productIndex].isNew = false;
      }
      setCustomerData(updatedData);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.salesperson) {
        toast({ title: "입력 오류", description: "고객명과 담당자를 모두 선택해야 합니다.", variant: "destructive" });
        return;
    }
    const newCustomerData: SalesTargetCustomer = {
        id: `cust-${Date.now()}`,
        name: newCustomer.name,
        salesperson: employees.find(e => e.value === newCustomer.salesperson)?.name || '',
        products: [],
    };
    setCustomerData([...customerData, newCustomerData]);
    setIsAddingCustomer(false);
    setNewCustomer({ name: '', salesperson: '' });
  };
  
  const handleRemoveCustomer = (customerIndex: number) => {
      const updatedData = [...customerData];
      updatedData.splice(customerIndex, 1);
      setCustomerData(updatedData);
  };
  
  const handleSubmitForApproval = () => {
    toast({
        title: "승인 요청됨",
        description: "매출 목표 설정이 관리자에게 보고되었습니다."
    });
  };

  const filteredData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return customerData;
    }
    return customerData.filter(
      (c) => c.salesperson === employees.find(e => e.value === selectedEmployee)?.name
    );
  }, [customerData, selectedEmployee]);

  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
        if (!totals[customer.salesperson]) {
            totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
        }
        customer.products.forEach(p => {
            totals[customer.salesperson].june += p.june;
            totals[customer.salesperson].july += p.july;
            totals[customer.salesperson].august += p.august;
            totals[customer.salesperson].target += p.target;
        });
    });
    return totals;
  }, [customerData]);

  if (!role) {
    return null;
  }
  
  const customerOptions = allCustomers.map(c => ({ value: c.label, label: c.label }));
  const productOptions = allProducts.map(p => ({ value: p.label, label: p.label }));

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className='flex items-center gap-2'>
                <Button variant="default" onClick={handleSubmitForApproval}>
                  승인 요청
                </Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 실적을 바탕으로 9월 매출 목표를 설정합니다.
              </CardDescription>
              {(role === 'admin' || role === 'manager') && (
                <div className="flex items-end pt-4">
                  <div className="grid gap-2">
                    <label htmlFor="employee-filter" className="text-sm font-medium">
                      담당자 필터
                    </label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger id="employee-filter" className="w-[180px]">
                        <SelectValue placeholder="담당자 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {employees
                          .filter((e) => e.role === 'employee' || e.role === 'manager')
                          .map((emp) => (
                            <SelectItem key={emp.value} value={emp.value}>
                              {emp.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' && (role === 'admin' || role === 'manager') ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>담당자</TableHead>
                            <TableHead className="text-right">6월 실적</TableHead>
                            <TableHead className="text-right">7월 실적</TableHead>
                            <TableHead className="text-right">8월 실적</TableHead>
                            <TableHead className="text-right">9월 목표</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(employeeTotals).map(([salesperson, totals]) => (
                        <TableRow key={salesperson}>
                            <TableCell className="font-medium">{salesperson}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>
              ) : (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        {(role === 'admin' || role === 'manager') && <TableHead className="w-[120px]">담당자</TableHead>}
                        <TableHead className="min-w-[200px]">고객명 / 제품명</TableHead>
                        <TableHead className="text-right min-w-[100px]">6월 실적</TableHead>
                        <TableHead className="text-right min-w-[100px]">7월 실적</TableHead>
                        <TableHead className="text-right min-w-[100px]">8월 실적</TableHead>
                        <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                        <TableHead className="w-[50px] text-center">삭제</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredData.map((customer, customerIndex) => (
                        <Fragment key={customer.id}>
                        <TableRow className="bg-muted/50 font-semibold">
                            {(role === 'admin' || role === 'manager') && <TableCell>{customer.salesperson}</TableCell>}
                            <TableCell className={(role !== 'admin' && role !== 'manager') ? "" : "col-span-1"}>
                                {customer.name}
                            </TableCell>
                            <TableCell colSpan={3}></TableCell>
                            <TableCell className="text-right font-bold">
                                {formatCurrency(customer.products.reduce((acc, p) => acc + p.target, 0))}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(customerIndex)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        {customer.products.map((product, productIndex) => (
                            <TableRow key={product.id}>
                            {(role === 'admin' || role === 'manager') && <TableCell></TableCell>}
                            <TableCell className="pl-8">
                                {product.isNew ? (
                                    <Combobox
                                        items={productOptions}
                                        placeholder="제품 선택 또는 입력"
                                        searchPlaceholder="제품 검색..."
                                        noResultsMessage="제품을 찾을 수 없습니다."
                                        value={product.name}
                                        onValueChange={(value) => handleProductSelection(customerIndex, productIndex, value)}
                                    />
                                ) : (
                                    product.name
                                )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                            <TableCell className="text-right">
                                <Input
                                type="number"
                                value={product.target}
                                onChange={(e) => handleTargetChange(customerIndex, productIndex, parseInt(e.target.value, 10) || 0)}
                                className="h-8 text-right"
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                           {(role === 'admin' || role === 'manager') && <TableCell></TableCell>}
                           <TableCell colSpan={6}>
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customerIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                           </TableCell>
                        </TableRow>
                        </Fragment>
                    ))}
                     {isAddingCustomer && (
                        <TableRow>
                           {(role === 'admin' || role === 'manager') && (
                             <TableCell>
                                <Select
                                    value={newCustomer.salesperson}
                                    onValueChange={(value) => setNewCustomer(prev => ({...prev, salesperson: value}))}
                                >
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="담당자" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.filter(e => e.role === 'employee' || e.role === 'manager').map(e => (
                                            <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                             </TableCell>
                           )}
                            <TableCell>
                                <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택 또는 입력"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={newCustomer.name}
                                    onValueChange={(value) => setNewCustomer(prev => ({...prev, name: value}))}
                                    onAddNew={(newValue) => setNewCustomer(prev => ({...prev, name: newValue}))}
                                />
                            </TableCell>
                            <TableCell colSpan={5}>
                                <div className="flex gap-2">
                                <Button size="sm" onClick={handleAddCustomer}>추가</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAddingCustomer(false)}>취소</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                     )}
                    </TableBody>
                </Table>
                 {!isAddingCustomer && (
                    <Button variant="outline" className="mt-4" onClick={() => setIsAddingCustomer(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        고객 추가
                    </Button>
                 )}
              </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
