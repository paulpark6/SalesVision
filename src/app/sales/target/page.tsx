
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
import type { SalesTargetCustomer, SalesTargetProduct } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';

// Initial data reflecting a state where targets have been set based on past performance
const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        customerName: 'Global Tech Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 480, target: 600 },
        ]
    },
    {
        id: 'cust-2',
        customerName: 'Innovate Solutions',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: '27-inch 4K Monitor', june: 4500, july: 4800, august: 5000, target: 5200 },
        ]
    },
    {
        id: 'cust-3',
        customerName: 'Synergy Corp',
        salesperson: 'Jane Smith',
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

  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleSubmitForApproval = () => {
    toast({
        title: '목표 제출 완료',
        description: '설정된 매출 목표가 관리자에게 보고되었습니다.'
    });
    handleCancel();
  }

  const handleAddCustomer = () => {
    setCustomerData(prev => [
      ...prev,
      {
        id: `cust-${Date.now()}`,
        customerName: '',
        salesperson: '',
        products: []
      }
    ]);
  };

  const handleRemoveCustomer = (customerId: string) => {
    setCustomerData(prev => prev.filter(c => c.id !== customerId));
  };
  
  const handleCustomerChange = (customerId: string, field: keyof SalesTargetCustomer, value: string) => {
      setCustomerData(prev => prev.map(c => c.id === customerId ? { ...c, [field]: value } : c));
  };

  const handleAddProduct = (customerId: string) => {
    const newProduct: SalesTargetProduct = {
      id: `prod-${Date.now()}`,
      name: '',
      june: 0,
      july: 0,
      august: 0,
      target: 0
    };
    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId ? { ...c, products: [...c.products, newProduct] } : c
      )
    );
  };

  const handleRemoveProduct = (customerId: string, productId: string) => {
    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, products: c.products.filter(p => p.id !== productId) }
          : c
      )
    );
  };

  const handleProductChange = (customerId: string, productId: string, field: keyof SalesTargetProduct, value: string | number) => {
      setCustomerData(prev =>
          prev.map(c => {
              if (c.id === customerId) {
                  const updatedProducts = c.products.map(p => {
                      if (p.id === productId) {
                          const updatedProduct = { ...p, [field]: value };
                           if (field === 'name') {
                              const existingProduct = allProducts.find(ap => ap.label.toLowerCase() === (value as string).toLowerCase());
                              if (existingProduct) {
                                  // In a real app, you might fetch this data.
                                  updatedProduct.june = Math.floor(Math.random() * 2000);
                                  updatedProduct.july = Math.floor(Math.random() * 2000);
                                  updatedProduct.august = Math.floor(Math.random() * 2000);
                              }
                          }
                          return updatedProduct;
                      }
                      return p;
                  });
                  return { ...c, products: updatedProducts };
              }
              return c;
          })
      );
  };


  const employeeTotals = useMemo(() => {
    const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
    customerData.forEach(customer => {
        if (customer.salesperson) {
            if (!totals[customer.salesperson]) {
                totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
            }
            customer.products.forEach(product => {
                totals[customer.salesperson].june += product.june;
                totals[customer.salesperson].july += product.july;
                totals[customer.salesperson].august += product.august;
                totals[customer.salesperson].target += product.target;
            });
        }
    });
    return totals;
  }, [customerData]);
  
  const grandTotals = useMemo(() => {
     return Object.values(employeeTotals).reduce((acc, curr) => {
        acc.june += curr.june;
        acc.july += curr.july;
        acc.august += curr.august;
        acc.target += curr.target;
        return acc;
     }, { june: 0, july: 0, august: 0, target: 0 });
  }, [employeeTotals]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCustomerData = useMemo(() => {
    if (activeFilter === 'All') {
        return customerData;
    }
    return customerData.filter(c => c.salesperson === activeFilter);
  }, [customerData, activeFilter]);
  
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
                <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
                 <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button type="button" onClick={handleSubmitForApproval}>
                      승인 요청
                    </Button>
                </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 참고하여 9월 매출 목표를 설정합니다.
              </CardDescription>
              {(role === 'manager' || role === 'admin') && (
                 <div className="flex items-center gap-2 pt-4">
                    <Button variant={activeFilter === 'All' ? 'default' : 'outline'} onClick={() => setActiveFilter('All')}>전체</Button>
                    {employees.map(e => (
                        <Button key={e.value} variant={activeFilter === e.name ? 'default' : 'outline'} onClick={() => setActiveFilter(e.name)}>{e.name}</Button>
                    ))}
                 </div>
              )}
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    { (role === 'manager' || role === 'admin') && <TableHead className="w-[150px]">담당자</TableHead>}
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품명</TableHead>
                    <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                    <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                    <TableHead className="text-right w-32">8월 실적</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomerData.map((customer, custIndex) => (
                    customer.products.map((product, prodIndex) => (
                      <TableRow key={product.id}>
                        {prodIndex === 0 && (
                          <TableCell rowSpan={customer.products.length}>
                             {(role === 'manager' || role === 'admin') && (
                                <Select
                                    value={customer.salesperson}
                                    onValueChange={(value) => handleCustomerChange(customer.id, 'salesperson', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="담당자 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                          </TableCell>
                        )}
                        {prodIndex === 0 && (
                          <TableCell rowSpan={customer.products.length}>
                              <div className="flex items-center gap-2">
                                <Combobox
                                    items={customerOptions}
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                    placeholder="고객 선택 또는 입력"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(customer.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Combobox
                                items={productOptions}
                                value={product.name}
                                onValueChange={(value) => handleProductChange(customer.id, product.id, 'name', value)}
                                placeholder="제품 선택 또는 입력"
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={product.target}
                            onChange={(e) => handleProductChange(customer.id, product.id, 'target', parseInt(e.target.value) || 0)}
                            className="h-8 text-right"
                            placeholder="0"
                          />
                        </TableCell>
                        {prodIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="text-center align-top pt-6">
                                <Button size="sm" variant="outline" onClick={() => handleAddProduct(customer.id)}>제품 추가</Button>
                            </TableCell>
                        )}
                      </TableRow>
                    ))
                  ))}
                </TableBody>
                {activeFilter !== 'All' && (
                    <TableFooter>
                        <TableRow className="font-bold bg-muted/50">
                            <TableCell colSpan={3}>'{activeFilter}' 합계</TableCell>
                            <TableCell className="text-right">{formatCurrency(employeeTotals[activeFilter]?.june || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(employeeTotals[activeFilter]?.july || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(employeeTotals[activeFilter]?.august || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(employeeTotals[activeFilter]?.target || 0)}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                )}
              </Table>
              <div className="flex justify-start mt-4">
                <Button variant="outline" onClick={handleAddCustomer}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  고객 추가
                </Button>
              </div>
            </CardContent>
             {(role === 'manager' || role === 'admin') && activeFilter === 'All' && (
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">담당자별 요약</h3>
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
                            {Object.entries(employeeTotals).map(([name, totals]) => (
                                <TableRow key={name}>
                                    <TableCell className="font-medium">{name}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.target)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                         <TableFooter>
                            <TableRow className="font-bold text-base">
                                <TableCell>총계</TableCell>
                                <TableCell className="text-right">{formatCurrency(grandTotals.june)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(grandTotals.july)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(grandTotals.august)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(grandTotals.target)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
             )}
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
