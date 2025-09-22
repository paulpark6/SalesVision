
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
  TableFooter
} from '@/components/ui/table';
import {
  employees,
  customers as allCustomers,
  products as allProducts,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Global Tech Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 15000, july: 16000, august: 15500, target: 17000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 800, july: 850, august: 820, target: 900 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Innovate Solutions',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 2500, july: 2600, august: 2550, target: 2800 },
        ]
    },
    {
        id: 'cust-003',
        name: 'Synergy Corp',
        salesperson: 'John Doe',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
];

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [editingCustomerName, setEditingCustomerName] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: `cust-${Date.now()}`,
      name: `New Customer ${customerData.length + 1}`,
      salesperson: role === 'employee' ? employees.find(e => e.role === auth?.role)?.name || '' : '',
      products: [],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, [customerData.length, role, auth]);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const handleCustomerChange = useCallback((customerId: string, field: keyof SalesTargetCustomer, value: any) => {
    setCustomerData(prev => prev.map(c => c.id === customerId ? { ...c, [field]: value } : c));
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0,
    };
    setCustomerData(prev => prev.map(c => c.id === customerId ? { ...c, products: [...c.products, newProduct] } : c));
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prev => prev.map(c =>
      c.id === customerId ? { ...c, products: c.products.filter(p => p.id !== productId) } : c
    ));
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: string, value: any) => {
    setCustomerData(prev => prev.map(c =>
      c.id === customerId ? {
        ...c,
        products: c.products.map(p =>
          p.id === productId ? { ...p, [field]: value } : p
        )
      } : c
    ));
  }, []);

  const handleSubmitForApproval = () => {
    toast({
      title: '목표 제출 완료',
      description: '설정된 매출 목표가 관리자에게 보고되었습니다.',
    });
  };

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

  const grandTotal = useMemo(() => {
    return Object.values(employeeTotals).reduce((acc, totals) => {
        acc.june += totals.june;
        acc.july += totals.july;
        acc.august += totals.august;
        acc.target += totals.target;
        return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [employeeTotals]);

  const filteredCustomers = useMemo(() => {
    if (selectedEmployee === 'all') return customerData;
    return customerData.filter(c => c.salesperson === selectedEmployee);
  }, [customerData, selectedEmployee]);

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted || !role) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Skeleton className="w-full h-full" />
        </div>
    );
  }

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
                <Button onClick={handleSubmitForApproval}>관리자에게 보고</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객 및 제품별 목표 설정</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 기반으로 9월 매출 목표를 설정합니다.
              </CardDescription>
              <div className="flex items-center space-x-4 pt-4">
                 {(role === 'manager' || role === 'admin') && (
                     <div className="flex items-center space-x-2">
                        <label htmlFor="employee-filter">담당자:</label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger id="employee-filter" className="w-[180px]">
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                {employees.filter(e => e.role !== 'admin').map(e => (
                                    <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 )}
                 <Button onClick={handleAddCustomer} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    고객 추가
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">고객사 / 제품</TableHead>
                      {(role === 'manager' || role === 'admin') && <TableHead className="w-[150px]">담당자</TableHead>}
                      <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <>
                        <TableRow key={customer.id} className="bg-muted/30">
                          <TableCell className="font-semibold">
                             <Combobox
                                items={customerOptions}
                                value={editingCustomerName || customer.name}
                                onValueChange={(newValue) => {
                                  handleCustomerChange(customer.id, 'name', newValue);
                                  setEditingCustomerName('');
                                }}
                                placeholder="고객 선택 또는 입력..."
                                searchPlaceholder="고객 검색..."
                                noResultsMessage="고객을 찾을 수 없습니다."
                                onAddNew={(newItem) => {
                                   handleCustomerChange(customer.id, 'name', newItem);
                                }}
                            />
                          </TableCell>
                          {(role === 'manager' || role === 'admin') && 
                            <TableCell>
                                <Select 
                                    value={customer.salesperson} 
                                    onValueChange={(val) => handleCustomerChange(customer.id, 'salesperson', val)}
                                    disabled={role === 'employee'}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="담당자 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.filter(e => e.role !== 'admin').map(emp => (
                                          <SelectItem key={emp.value} value={emp.name}>
                                            {emp.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                          }
                          <TableCell colSpan={role === 'employee' ? 4 : 3}></TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomer(customer.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                             </Button>
                          </TableCell>
                        </TableRow>
                        {customer.products.map(product => (
                          <TableRow key={product.id}>
                            <TableCell className="pl-12">
                               <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(newValue) => handleProductChange(customer.id, product.id, 'name', newValue)}
                                    placeholder="제품 선택 또는 입력..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    onAddNew={(newItem) => handleProductChange(customer.id, product.id, 'name', newItem)}
                                />
                            </TableCell>
                            {(role === 'manager' || role === 'admin') && <TableCell></TableCell>}
                            <TableCell className="text-right">${product.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${product.august.toLocaleString()}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="text-right"
                                value={product.target}
                                onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={role === 'employee' ? 1 : 2} className="pl-12">
                                 <Button variant="link" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="h-4 w-4 mr-2"/>
                                    제품 추가
                                 </Button>
                            </TableCell>
                             <TableCell colSpan={5}></TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                   {selectedEmployee === 'all' && (
                       <TableFooter>
                           <TableRow className="font-bold bg-muted/50">
                               <TableCell colSpan={2}>총계</TableCell>
                               <TableCell className="text-right">${grandTotal.june.toLocaleString()}</TableCell>
                               <TableCell className="text-right">${grandTotal.july.toLocaleString()}</TableCell>
                               <TableCell className="text-right">${grandTotal.august.toLocaleString()}</TableCell>
                               <TableCell className="text-right">${grandTotal.target.toLocaleString()}</TableCell>
                               <TableCell></TableCell>
                           </TableRow>
                       </TableFooter>
                   )}
                </Table>
              </div>

             {selectedEmployee === 'all' && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">담당자별 요약</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead className="text-right">6월 합계</TableHead>
                                <TableHead className="text-right">7월 합계</TableHead>
                                <TableHead className="text-right">8월 합계</TableHead>
                                <TableHead className="text-right">9월 목표 합계</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(employeeTotals).map(([employeeName, totals]) => (
                                <TableRow key={employeeName}>
                                    <TableCell className="font-medium">{employeeName}</TableCell>
                                    <TableCell className="text-right">${totals.june.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.july.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${totals.august.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-semibold">${totals.target.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    