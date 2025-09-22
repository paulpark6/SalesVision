
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-1',
        name: 'Acme Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
        ]
    },
    {
        id: 'cust-2',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 2500, july: 2600, august: 2550, target: 2700 },
        ]
    },
     {
        id: 'cust-3',
        name: 'Wayne Enterprises',
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

  const [isMounted, setIsMounted] = useState(false);
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
  const [newCustomer, setNewCustomer] = useState('');
  const [newProduct, setNewProduct] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!auth && isMounted) {
      router.push('/login');
    }
  }, [auth, isMounted, router]);

  const handleBack = useCallback(() => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  }, [role, router]);

  const handleAddCustomer = useCallback(() => {
    const newCustId = `cust-${Date.now()}`;
    setCustomerData(prev => [
      ...prev,
      {
        id: newCustId,
        name: '',
        salesperson: '',
        products: [{ id: `prod-${Date.now()}`, name: '', june: 0, july: 0, august: 0, target: 0 }]
      }
    ]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
  }, []);
  
  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [
                ...customer.products,
                { id: `prod-${Date.now()}`, name: '', june: 0, july: 0, august: 0, target: 0 }
              ]
            }
          : customer
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.filter(product => product.id !== productId);
          // If all products are removed, remove the customer as well, unless it's the only one
          if (updatedProducts.length === 0 && prevData.length > 1) {
            return null;
          }
          return { ...customer, products: updatedProducts };
        }
        return customer;
      }).filter(Boolean) as SalesTargetCustomer[]
    );
  }, []);

  const handleCustomerChange = useCallback((customerId: string, field: keyof SalesTargetCustomer, value: string) => {
      setCustomerData(prev => prev.map(cust => {
          if (cust.id === customerId) {
              const updatedCust = { ...cust, [field]: value };
              if (field === 'name') {
                  const existingCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
                  if(existingCustomer) {
                    updatedCust.salesperson = existingCustomer.employee;
                  }
              }
              return updatedCust;
          }
          return cust;
      }));
  }, []);

  const handleProductChange = useCallback((customerId: string, productId: string, field: string, value: string | number) => {
    setCustomerData(prev =>
      prev.map(cust => {
        if (cust.id === customerId) {
          return {
            ...cust,
            products: cust.products.map(prod => {
              if (prod.id === productId) {
                const updatedProd = { ...prod, [field]: value };
                 if (field === 'name') {
                    const existingProduct = allProducts.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
                    if (existingProduct) {
                        updatedProd.june = 0;
                        updatedProd.july = 0;
                        updatedProd.august = 0;
                    }
                }
                return updatedProd;
              }
              return prod;
            })
          };
        }
        return cust;
      })
    );
  }, []);
  
  const [editingCell, setEditingCell] = useState<{ customerId: string; productId: string; field: string } | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editingCell) {
        const target = event.target as HTMLElement;
        if (!target.closest('.editable-cell')) {
          setEditingCell(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCell]);


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
  
  const handleSubmit = () => {
    toast({
      title: '목표 제출 완료',
      description: '9월 매출 목표가 관리자에게 제출되었습니다.',
    });
    handleBack();
  };

  if (!isMounted) {
    return null;
  }
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  return (
    <SidebarProvider>
      <AppSidebar role={role || 'employee'} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
                <Button onClick={handleAddCustomer} size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    고객 추가
                </Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 목표 및 실적</CardTitle>
              <CardDescription>
                6-8월 실적을 바탕으로 9월 매출 목표를 설정합니다. 금액을 클릭하여 수정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead className="w-[200px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[100px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <TableCell rowSpan={customer.products.length} className="align-top font-medium">
                                <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerChange(customer.id, 'name', value)}
                                    onAddNew={(newValue) => handleCustomerChange(customer.id, 'name', newValue)}
                                />
                              </TableCell>
                            )}
                             {prodIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="align-top">{customer.salesperson}</TableCell>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, 'name', value)}
                                    onAddNew={(newValue) => handleProductChange(customer.id, product.id, 'name', newValue)}
                                />
                            </TableCell>
                            {[ 'june', 'july', 'august', 'target'].map(month => (
                                <TableCell 
                                  key={month} 
                                  className="text-right editable-cell" 
                                >
                                    <Input
                                        type="number"
                                        value={(product as any)[month]}
                                        onChange={(e) => handleProductChange(customer.id, product.id, month, parseFloat(e.target.value) || 0)}
                                        className="h-8 text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </TableCell>
                            ))}
                            <TableCell className="align-middle text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveProduct(customer.id, product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell colSpan={8} className="py-1 px-2">
                                <Button onClick={() => handleAddProduct(customer.id)} variant="ghost" size="sm" className="w-full justify-start">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
           <Card>
              <CardHeader>
                  <CardTitle>요약</CardTitle>
                  <CardDescription>담당자별 및 전체 합계입니다.</CardDescription>
              </CardHeader>
              <CardContent>
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
                      <TableFooter>
                          <TableRow>
                              <TableCell className="font-bold">총계</TableCell>
                              <TableCell className="text-right font-bold">${grandTotal.june.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-bold">${grandTotal.july.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-bold">${grandTotal.august.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-bold text-lg">${grandTotal.target.toLocaleString()}</TableCell>
                          </TableRow>
                      </TableFooter>
                  </Table>
              </CardContent>
          </Card>

           <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleBack}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              승인 요청
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
