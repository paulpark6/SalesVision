
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
  TableFooter,
} from '@/components/ui/table';
import {
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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Acme Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 15000, july: 15500, august: 14800, target: 16000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 1200, july: 1300, august: 1250, target: 1400 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 5000, july: 5200, august: 5100, target: 5500 },
        ]
    },
    {
        id: 'cust-003',
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

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
        if (auth === undefined) return;
        if (!auth) {
        router.push('/login');
        }
    }
  }, [auth, router, isMounted]);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: `cust-${Date.now()}`,
      name: '',
      salesperson: 'Unassigned',
      products: [],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const handleCustomerChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prev =>
      prev.map(c => (c.id === customerId ? { ...c, name: newName } : c))
    );
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
    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, products: [...c.products, newProduct] }
          : c
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, products: c.products.filter(p => p.id !== productId) }
          : c
      )
    );
  }, []);
  
  const handleProductChange = useCallback((customerId: string, productId: string, newName: string) => {
     setCustomerData(prev => prev.map(c => {
         if (c.id === customerId) {
             return {
                 ...c,
                 products: c.products.map(p => p.id === productId ? {...p, name: newName} : p)
             }
         }
         return c;
     }))
  }, []);

  const handleInputChange = useCallback((customerId: string, productId: string, month: 'target', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setCustomerData(prev =>
      prev.map(c =>
        c.id === customerId
          ? {
              ...c,
              products: c.products.map(p =>
                p.id === productId ? { ...p, [month]: numValue } : p
              ),
            }
          : c
      )
    );
  }, []);

  const handleSubmitForApproval = () => {
    toast({
      title: 'Approval Request Sent',
      description: 'The sales targets have been submitted for manager approval.',
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

  const grandTotals = useMemo(() => {
    return customerData.reduce((acc, customer) => {
        customer.products.forEach(product => {
            acc.june += product.june;
            acc.july += product.july;
            acc.august += product.august;
            acc.target += product.target;
        });
        return acc;
    }, { june: 0, july: 0, august: 0, target: 0 });
  }, [customerData]);
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted || !role) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Set Sales Target (September)</h1>
            <Button onClick={handleSubmitForApproval}>Submit for Approval</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>고객별 매출 목표 설정</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 참고하여 9월 목표를 설정합니다. 설정된 목표는 관리자에게 보고됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      { (role === 'admin' || role === 'manager') && <TableHead className="w-[150px]">담당자</TableHead> }
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[250px]">제품명</TableHead>
                      <TableHead className="text-right">6월 실적</TableHead>
                      <TableHead className="text-right">7월 실적</TableHead>
                      <TableHead className="text-right">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer, custIndex) => (
                      <React.Fragment key={customer.id}>
                        {customer.products.map((product, prodIndex) => (
                          <TableRow key={product.id}>
                            {prodIndex === 0 && (
                              <>
                                { (role === 'admin' || role === 'manager') && (
                                  <TableCell rowSpan={customer.products.length} className="align-top">
                                    {customer.salesperson}
                                  </TableCell>
                                )}
                                <TableCell rowSpan={customer.products.length} className="align-top">
                                    <div className="flex items-start gap-2">
                                        <Combobox
                                            items={customerOptions}
                                            value={customer.name}
                                            onValueChange={(newName) => handleCustomerChange(customer.id, newName)}
                                            placeholder="Select or add customer..."
                                            searchPlaceholder="Search customers..."
                                            noResultsMessage="No customer found."
                                        />
                                      {customerData.length > 1 && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-9 w-9 shrink-0"
                                          onClick={() => handleRemoveCustomer(customer.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(newName) => handleProductChange(customer.id, product.id, newName)}
                                    placeholder="Select or add product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                />
                            </TableCell>
                            <TableCell className="text-right">{product.june.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{product.july.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{product.august.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                className="h-8 text-right"
                                value={product.target}
                                onChange={(e) => handleInputChange(customer.id, product.id, 'target', e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              {customer.products.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveProduct(customer.id, product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                           <TableCell colSpan={(role === 'admin' || role === 'manager') ? 2 : 1}></TableCell>
                           <TableCell colSpan={5}>
                             <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.id)}>
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Add Product
                             </Button>
                           </TableCell>
                         </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                   <TableFooter>
                     <TableRow>
                       <TableCell colSpan={(role === 'admin' || role === 'manager') ? 3 : 2}>
                          <Button variant="outline" onClick={handleAddCustomer}>
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Add Customer
                           </Button>
                       </TableCell>
                       <TableCell className="text-right font-bold">{grandTotals.june.toLocaleString()}</TableCell>
                       <TableCell className="text-right font-bold">{grandTotals.july.toLocaleString()}</TableCell>
                       <TableCell className="text-right font-bold">{grandTotals.august.toLocaleString()}</TableCell>
                       <TableCell className="text-right font-bold">{grandTotals.target.toLocaleString()}</TableCell>
                       <TableCell></TableCell>
                     </TableRow>
                     {(role === 'admin' || role === 'manager') && Object.entries(employeeTotals).map(([employee, totals]) => (
                         <TableRow key={employee} className="bg-muted/50">
                             <TableCell colSpan={3} className="font-semibold">{employee} Total</TableCell>
                             <TableCell className="text-right font-semibold">{totals.june.toLocaleString()}</TableCell>
                             <TableCell className="text-right font-semibold">{totals.july.toLocaleString()}</TableCell>
                             <TableCell className="text-right font-semibold">{totals.august.toLocaleString()}</TableCell>
                             <TableCell className="text-right font-semibold">{totals.target.toLocaleString()}</TableCell>
                             <TableCell></TableCell>
                         </TableRow>
                     ))}
                   </TableFooter>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
                 <Button onClick={handleSubmitForApproval}>Submit for Approval</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
