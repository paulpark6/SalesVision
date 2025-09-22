
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
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Global Tech Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 15000, july: 16000, august: 15500, target: 17000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
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
        name: 'Quantum Industries',
        salesperson: 'Jane Smith',
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
    } else if (auth.role === 'employee') {
      setSelectedEmployee(auth.name);
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
  
  const handleAddCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: `cust-${Date.now()}`,
      name: '', // Will be set via Combobox
      salesperson: role === 'employee' ? (auth?.name || '') : '',
      products: []
    };
    setCustomerData(prev => [...prev, newCustomer]);
  };
  
  const handleCustomerNameChange = (customerId: string, newName: string) => {
    setCustomerData(prev => prev.map(c => c.id === customerId ? { ...c, name: newName } : c));
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    setCustomerData(prev => prev.filter(c => c.id !== customerId));
  };
  
  const handleAddProduct = (customerId: string) => {
    const newProduct = { id: `prod-${Date.now()}`, name: '', june: 0, july: 0, august: 0, target: 0 };
    setCustomerData(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, products: [...c.products, newProduct] };
      }
      return c;
    }));
  };
  
  const handleProductChange = (customerId: string, productId: string, newProductValue: string) => {
      const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newProductValue.toLowerCase());
      setCustomerData(prev => prev.map(c => {
          if (c.id === customerId) {
              const updatedProducts = c.products.map(p => {
                  if (p.id === productId) {
                      return { 
                          ...p, 
                          id: selectedProduct ? selectedProduct.value : p.id,
                          name: selectedProduct ? selectedProduct.label : newProductValue
                      };
                  }
                  return p;
              });
              return { ...c, products: updatedProducts };
          }
          return c;
      }));
  };

  const handleTargetChange = (customerId: string, productId: string, newTarget: number) => {
    setCustomerData(prev => prev.map(c => {
        if (c.id === customerId) {
            const updatedProducts = c.products.map(p => p.id === productId ? { ...p, target: newTarget } : p);
            return { ...c, products: updatedProducts };
        }
        return c;
    }));
  };

  const handleDeleteProduct = (customerId: string, productId: string) => {
    setCustomerData(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, products: c.products.filter(p => p.id !== productId) };
      }
      return c;
    }));
  };
  
  const handleSubmitForApproval = () => {
    toast({
        title: "Approval Request Sent",
        description: "Your sales targets have been submitted for approval.",
    });
  }

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


  const filteredData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return customerData;
    }
    return customerData.filter(d => d.salesperson === selectedEmployee);
  }, [customerData, selectedEmployee]);

  if (!role) {
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
                <Button onClick={handleSubmitForApproval}>
                  Submit for Approval
                </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 제품 매출을 바탕으로 9월 매출 목표를 설정합니다.
              </CardDescription>
              {(role === 'manager' || role === 'admin') && (
                <div className="flex items-center gap-4 pt-4">
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            {employees.filter(e => e.role === 'employee' || e.role === 'manager').map(e => (
                                <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              )}
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
                            {Object.entries(employeeTotals).map(([name, totals]) => (
                                <TableRow key={name}>
                                    <TableCell className="font-medium">{name}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                  <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {(role === 'manager' || role === 'admin') && <TableHead className="w-[150px]">담당자</TableHead>}
                        <TableHead>고객명</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead className="text-right">6월</TableHead>
                        <TableHead className="text-right">7월</TableHead>
                        <TableHead className="text-right">8월</TableHead>
                        <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((customer, custIndex) => (
                        <>
                          {customer.products.map((product, prodIndex) => (
                            <TableRow key={product.id}>
                              {prodIndex === 0 && (
                                <td rowSpan={customer.products.length + 1} className="align-top pt-5">
                                  <div className="flex items-center">
                                    {(role === 'manager' || role === 'admin') && (
                                        <div className="font-medium w-[150px]">{customer.salesperson}</div>
                                    )}
                                    <Combobox
                                        items={customerOptions}
                                        value={customer.name}
                                        onValueChange={(value) => handleCustomerNameChange(customer.id, value)}
                                        placeholder="고객 선택 또는 입력"
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                    />
                                    <Button variant="ghost" size="icon" className="ml-1 h-8 w-8" onClick={() => handleDeleteCustomer(customer.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </td>
                              )}
                              <TableCell>
                                <Combobox
                                    items={productOptions}
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                    placeholder="제품 선택"
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                />
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                              <TableCell className="text-right">
                                  <Input 
                                      type="number" 
                                      value={product.target}
                                      onChange={(e) => handleTargetChange(customer.id, product.id, parseInt(e.target.value) || 0)}
                                      className="h-8 text-right"
                                  />
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteProduct(customer.id, product.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={role === 'employee' ? 6 : 7}>
                                <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="pt-4">
                      <Button variant="secondary" onClick={handleAddCustomer}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          고객 추가
                      </Button>
                  </div>
                  </>
                )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


    