
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employees, salesTargetManagementData as initialData, customers, products as productList } from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, XIcon } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targets, setTargets] = useState<SalesTarget[]>(initialData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('9'); // Default to September

  const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleAddCustomer = () => {
    const newCustomerTarget: SalesTarget = {
      employee: 'Unassigned',
      employeeId: '',
      customerName: '',
      customerCode: `NEW-${Date.now()}`,
      isNewCustomer: true,
      products: [
        {
          categoryCode: 'CAT-01',
          productCode: '',
          productName: '',
          quantity: 0,
          monthlyTarget: {},
          monthlyActual: {},
          pastSales: {},
          isNewProduct: true
        },
      ],
    };
    setTargets(prev => [...prev, newCustomerTarget]);
    toast({
      title: 'New Customer Added',
      description: 'A new row has been added to the table. Please fill in the details.',
    });
  };

  const handleAddProduct = (customerCode: string) => {
    setTargets(prev =>
      prev.map(t => {
        if (t.customerCode === customerCode) {
          return {
            ...t,
            products: [
              ...t.products,
              {
                categoryCode: 'CAT-01',
                productCode: '',
                productName: '',
                quantity: 0,
                monthlyTarget: {},
                monthlyActual: {},
                pastSales: {},
                isNewProduct: true
              },
            ],
          };
        }
        return t;
      })
    );
  };
  
  const handleDeleteCustomer = (customerCode: string) => {
    setTargets(prev => prev.filter(t => t.customerCode !== customerCode));
    toast({
        title: 'Customer Deleted',
        description: 'The customer and their targets have been removed.',
        variant: 'destructive'
    });
  };

  const handleDeleteProduct = (customerCode: string, productIndex: number) => {
     setTargets(prev =>
      prev.map(t => {
        if (t.customerCode === customerCode) {
          const newProducts = t.products.filter((_, idx) => idx !== productIndex);
          // If all products are deleted, remove the customer as well
          if(newProducts.length === 0) {
            return null;
          }
          return { ...t, products: newProducts };
        }
        return t;
      }).filter(Boolean) as SalesTarget[]
    );
  };

  const handleTargetChange = <K extends keyof SalesTarget>(customerCode: string, field: K, value: SalesTarget[K]) => {
      setTargets(prev => prev.map(t => t.customerCode === customerCode ? {...t, [field]: value} : t));
  };
  
  const handleProductChange = (customerCode: string, productIndex: number, field: string, value: string | number) => {
      setTargets(prev =>
          prev.map(t => {
              if (t.customerCode === customerCode) {
                  const newProducts = [...t.products];
                  const product = newProducts[productIndex];
                  if (field.startsWith('monthlyTarget')) {
                      const month = field.split('.')[1];
                      product.monthlyTarget[month] = Number(value);
                  } else if (field === 'productName') {
                      const selectedProduct = productList.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
                      product.productName = value as string;
                      if(selectedProduct) {
                          product.productCode = selectedProduct.value;
                      }
                  } 
                  else {
                      (product as any)[field] = value;
                  }
                  return { ...t, products: newProducts };
              }
              return t;
          })
      );
  };

  const employeeSummary = useMemo(() => {
    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    employees.forEach(emp => {
      if (emp.role !== 'admin') {
        summary[emp.value] = { name: emp.label, target: 0, actual: 0 };
      }
    });

    targets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          if (p.monthlyTarget) {
            summary[item.employeeId].target += p.monthlyTarget[selectedMonth] || 0;
          }
          if (p.monthlyActual) {
            summary[item.employeeId].actual += p.monthlyActual[selectedMonth] || 0;
          }
        });
      }
    });

    return Object.values(summary);
  }, [targets, selectedMonth]);


  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [targets, selectedEmployee]);

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
            <h1 className="text-2xl font-semibold">Sales Target Management</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 목표 설정</CardTitle>
              <CardDescription>
                직원 및 고객별 월별 매출 목표를 설정하고 관리합니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-4">
                <div className="grid gap-2">
                  <label htmlFor='employee-filter'>직원</label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger id="employee-filter" className="w-[180px]">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {employees.filter(e => e.role !== 'admin').map(e => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                    <label htmlFor='month-select'>월</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger id="month-select" className="w-[120px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(month => (
                                <SelectItem key={month} value={month}>{month}월</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">직원별 {selectedMonth}월 목표 요약</h3>
                   <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead className="text-right">Total Target</TableHead>
                              <TableHead className="text-right">Total Actual</TableHead>
                              <TableHead className="w-[200px]">Achievement Rate</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {employeeSummary.map(emp => {
                              const achievementRate = emp.target > 0 ? (emp.actual / emp.target) * 100 : 0;
                              return (
                                  <TableRow key={emp.name}>
                                      <TableCell className="font-medium">{emp.name}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(emp.target)}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(emp.actual)}</TableCell>
                                      <TableCell>
                                          <div className="flex items-center gap-2">
                                              <Progress value={achievementRate} className="h-2" />
                                              <span className="text-xs font-semibold w-12 text-right">
                                                  {achievementRate.toFixed(1)}%
                                              </span>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      {(role === 'admin' || role === 'manager') && <TableHead className="w-[150px]">담당자</TableHead>}
                      <TableHead className="w-[200px]">고객명</TableHead>
                      <TableHead className="w-[250px]">제품명</TableHead>
                      <TableHead className="text-right">6월</TableHead>
                      <TableHead className="text-right">7월</TableHead>
                      <TableHead className="text-right">8월</TableHead>
                      <TableHead className="w-[120px] text-right">수량</TableHead>
                      <TableHead className="w-[150px] text-right">매출 목표 ({selectedMonth}월)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTargets.map((target) => (
                      <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode}`}>
                        {target.products.map((product, pIndex) => (
                          <TableRow key={`${target.customerCode}-${product.productCode}-${pIndex}`}>
                            {pIndex === 0 && (
                              <>
                                {(role === 'admin' || role === 'manager') && (
                                  <TableCell rowSpan={target.products.length + 1}>
                                    <Select 
                                      value={target.employeeId} 
                                      onValueChange={(val) => handleTargetChange(target.customerCode, 'employeeId', val)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="담당자 선택" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {employees.filter(e => e.role !== 'admin').map(e => (
                                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                )}
                                <TableCell rowSpan={target.products.length + 1}>
                                   {target.isNewCustomer ? (
                                        <Combobox
                                            items={customers}
                                            placeholder="고객 선택 또는 입력..."
                                            searchPlaceholder="고객 검색..."
                                            noResultsMessage="고객을 찾을 수 없습니다."
                                            value={target.customerName}
                                            onValueChange={(value) => {
                                                const existingCustomer = customers.find(c => c.label.toLowerCase() === value.toLowerCase());
                                                handleTargetChange(target.customerCode, 'customerName', value);
                                                if (existingCustomer) {
                                                    handleTargetChange(target.customerCode, 'customerCode', existingCustomer.value);
                                                }
                                            }}
                                        />
                                   ) : (
                                       <div className="font-medium">{target.customerName}</div>
                                   )}
                                    <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              {product.isNewProduct ? (
                                <Combobox
                                    items={productList}
                                    placeholder="제품 선택 또는 입력..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(target.customerCode, pIndex, 'productName', value)}
                                />
                               ) : (
                                 <div className="font-medium">{product.productName}</div>
                               )}
                              <div className="text-sm text-muted-foreground">{product.productCode}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[6] || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[7] || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[8] || 0)}</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                className="h-8 text-right" 
                                value={product.quantity}
                                onChange={(e) => handleProductChange(target.customerCode, pIndex, 'quantity', Number(e.target.value))}
                              />
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    className="h-8 text-right" 
                                    value={product.monthlyTarget[selectedMonth] || ''}
                                    onChange={(e) => handleProductChange(target.customerCode, pIndex, `monthlyTarget.${selectedMonth}`, Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteProduct(target.customerCode, pIndex)}>
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={pIndex === 0 && (role === 'admin' || role === 'manager') ? 1 : 2} className="py-1">
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(target.customerCode)}>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    제품 추가
                                </Button>
                          </TableCell>
                          <TableCell colSpan={6} className="py-1 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteCustomer(target.customerCode)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                  <Button onClick={handleAddCustomer}>
                      <PlusCircle className="h-4 w-4 mr-2" />
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

