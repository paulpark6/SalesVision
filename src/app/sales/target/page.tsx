
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
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const initialData: SalesTargetCustomer[] = [
    {
        id: 'cust_1',
        name: 'Cybernetics Inc.',
        code: 'C-101',
        grade: 'A',
        isNew: false,
        products: [
            {
                id: 'prod_1',
                name: 'Quantum Drive',
                code: 'QD-001',
                sales: { june: 12000, july: 15000, august: 13500 },
                target: { quantity: 0, price: 0, total: 0 },
                isNew: false,
            },
            {
                id: 'prod_2',
                name: 'Nano Bots',
                code: 'NB-002',
                sales: { june: 8000, july: 9500, august: 8700 },
                target: { quantity: 0, price: 0, total: 0 },
                isNew: false,
            }
        ]
    },
    {
        id: 'cust_2',
        name: 'Stellar Solutions',
        code: 'C-102',
        grade: 'B',
        isNew: false,
        products: [
            {
                id: 'prod_3',
                name: 'Hyper-Router',
                code: 'HR-003',
                sales: { june: 22000, july: 25000, august: 23000 },
                target: { quantity: 0, price: 0, total: 0 },
                isNew: false,
            }
        ]
    },
     {
        id: 'cust_3',
        name: 'Bio-Synth Corp.',
        code: 'C-103',
        grade: 'C',
        isNew: false,
        products: [
            {
                id: 'prod_4',
                name: 'Genetic Sequencer',
                code: 'GS-004',
                sales: { june: 3000, july: 4000, august: 3500 },
                target: { quantity: 0, price: 0, total: 0 },
                isNew: false,
            }
        ]
    },
];

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
}


export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialData);
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);


  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleCustomerChange = (customerId: string, newCode: string) => {
    const selectedCustomer = allCustomers.find(c => c.value.toLowerCase() === newCode.toLowerCase());
    if (!selectedCustomer) return;

    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              name: selectedCustomer.label,
              code: selectedCustomer.value,
              grade: selectedCustomer.grade,
            }
          : customer
      )
    );
  };
  
  const handleProductChange = (customerId: string, productId: string, newCode: string) => {
      const selectedProduct = allProducts.find(p => p.value.toLowerCase() === newCode.toLowerCase());
      if (!selectedProduct) return;

      setCustomerData(prevData => prevData.map(customer => {
          if(customer.id === customerId) {
              const newProducts = customer.products.map(product => {
                  if(product.id === productId) {
                      const discount = getDiscount(customer.grade);
                      const unitPrice = selectedProduct.basePrice * (1 - discount);
                      return {
                          ...product,
                          name: selectedProduct.label,
                          code: selectedProduct.value,
                          target: {
                              ...product.target,
                              price: unitPrice,
                              total: product.target.quantity * unitPrice,
                          }
                      }
                  }
                  return product;
              })
              return {...customer, products: newProducts}
          }
          return customer;
      }))
  };
  
  const handleQuantityChange = (customerId: string, productId: string, quantity: number) => {
      setCustomerData(prevData => prevData.map(customer => {
          if (customer.id === customerId) {
              const newProducts = customer.products.map(product => {
                  if (product.id === productId) {
                       const newTotal = quantity * product.target.price;
                       return {
                           ...product,
                           target: { ...product.target, quantity, total: newTotal }
                       }
                  }
                  return product;
              })
              return { ...customer, products: newProducts };
          }
          return customer;
      }))
  };

  const addProductToCustomer = (customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [
                ...customer.products,
                {
                  id: uuidv4(),
                  name: '',
                  code: '',
                  sales: { june: 0, july: 0, august: 0 },
                  target: { quantity: 0, price: 0, total: 0 },
                  isNew: true,
                },
              ],
            }
          : customer
      )
    );
  };

  const removeProductFromCustomer = (customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.filter(p => p.id !== productId),
            }
          : customer
      ).filter(c => c.products.length > 0) // Remove customer if they have no products left
    );
  };
  
  const totalSeptemberTarget = useMemo(() => {
      return customerData.reduce((total, customer) => {
          return total + customer.products.reduce((subTotal, product) => subTotal + product.target.total, 0);
      }, 0);
  }, [customerData]);


  if (!role) {
    return null; // or a loading component
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별 매출 목표</CardTitle>
              <CardDescription>
                과거 3개월 실적을 참고하여 9월 매출 목표를 설정합니다. 신규 고객 및 제품을 추가할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[100px]">수량</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="w-[50px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length + 1} className="font-medium align-top w-[250px]">
                                {customer.isNew ? (
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="Select customer..."
                                        searchPlaceholder="Search customers..."
                                        noResultsMessage="No customer found."
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                    />
                                ) : (
                                  <div>
                                    <span className='font-bold'>{customer.name}</span> <Badge variant='outline'>{customer.grade}</Badge>
                                    <div className='text-sm text-muted-foreground'>{customer.code}</div>
                                  </div>
                                )}
                            </TableCell>
                          )}
                          <TableCell className="w-[250px]">
                             {product.isNew ? (
                                <Combobox
                                    items={productOptions}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                />
                            ) : (
                                <div>
                                    <span className='font-semibold'>{product.name}</span>
                                    <div className='text-sm text-muted-foreground'>{product.code}</div>
                                </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.sales.june.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.sales.july.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.sales.august.toLocaleString()}
                          </TableCell>
                           <TableCell>
                            <Input 
                                type="number" 
                                className="h-8 text-right" 
                                placeholder="0"
                                min="0"
                                onChange={(e) => handleQuantityChange(customer.id, product.id, parseInt(e.target.value) || 0)}
                            />
                           </TableCell>
                          <TableCell className="text-right font-medium">
                            {product.target.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </TableCell>
                          <TableCell>
                            {product.isNew && (
                               <Button variant="ghost" size="icon" onClick={() => removeProductFromCustomer(customer.id, product.id)} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                          <TableCell colSpan={7} className="py-2 pl-[calc(250px+1rem)]">
                              <Button variant="ghost" size="sm" onClick={() => addProductToCustomer(customer.id)}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Product
                              </Button>
                          </TableCell>
                      </TableRow>
                      {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={8} className='p-0'>
                                <div className="border-t my-2"></div>
                            </TableCell>
                          </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2 items-center mt-4">
              <span className="text-lg font-bold">
                  총 9월 목표: {totalSeptemberTarget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span>
              <Button>Save Targets</Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
