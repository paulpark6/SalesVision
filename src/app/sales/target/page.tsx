
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { salesTargetManagementData, employees } from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targets, setTargets] = useState<SalesTarget[]>(salesTargetManagementData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(9);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleTargetChange = (customerCode: string, productCode: string, field: 'target' | 'actual', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTargets(prevTargets =>
      prevTargets.map(c => {
        if (c.customerCode === customerCode) {
          return {
            ...c,
            products: c.products.map(p => {
              if (p.productCode === productCode) {
                const updatedProduct = { ...p };
                if (field === 'target') {
                  updatedProduct.monthlyTarget = { ...p.monthlyTarget, [selectedMonth]: numericValue };
                } else {
                  updatedProduct.monthlyActual = { ...p.monthlyActual, [selectedMonth]: numericValue };
                }
                return updatedProduct;
              }
              return p;
            }),
          };
        }
        return c;
      })
    );
  };

  const addCustomer = () => {
    const newCustomerCode = `NEW-CUST-${Date.now()}`;
    const newCustomer: SalesTarget = {
      employeeId: 'unassigned',
      employeeName: 'Unassigned',
      customerCode: newCustomerCode,
      customerName: '',
      isNew: true,
      products: [],
    };
    setTargets(prev => [...prev, newCustomer]);
  };

  const deleteCustomer = (customerCode: string) => {
    setTargets(prev => prev.filter(t => t.customerCode !== customerCode));
    toast({
      title: '고객 삭제',
      description: '고객 및 관련 제품 목표가 삭제되었습니다.',
    });
  };

  const addProductToCustomer = (customerCode: string) => {
    const newProductCode = `NEW-PROD-${Date.now()}`;
    setTargets(prev =>
      prev.map(t => {
        if (t.customerCode === customerCode) {
          return {
            ...t,
            products: [
              ...t.products,
              {
                productCode: newProductCode,
                productName: '',
                categoryCode: 'CAT-01',
                isNew: true,
                pastSales: {},
                monthlyTarget: {},
                monthlyActual: {},
              },
            ],
          };
        }
        return t;
      })
    );
  };
  
  const deleteProductFromCustomer = (customerCode: string, productCode: string) => {
    setTargets(prev =>
      prev.map(t => {
        if (t.customerCode === customerCode) {
          return { ...t, products: t.products.filter(p => p.productCode !== productCode) };
        }
        return t;
      })
    );
    toast({
        title: '제품 삭제',
        description: '제품 목표가 삭제되었습니다.',
        variant: 'destructive'
    })
  };

  const handleCustomerChange = (customerCode: string, field: 'customerName' | 'employeeId', value: string) => {
    setTargets(prevTargets =>
      prevTargets.map(c => {
        if (c.customerCode === customerCode) {
            if(field === 'employeeId') {
                const employee = employees.find(e => e.value === value);
                return { ...c, [field]: value, employeeName: employee?.name || 'Unassigned' };
            }
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

 const handleProductInfoChange = (customerCode: string, productCode: string, field: 'productName' | 'productCode', value: string) => {
    setTargets(prev =>
      prev.map(t => {
        if (t.customerCode === customerCode) {
          return {
            ...t,
            products: t.products.map(p => {
              if (p.productCode === productCode) {
                return { ...p, [field]: value };
              }
              return p;
            }),
          };
        }
        return t;
      })
    );
  };
  
  const employeeSummary = useMemo(() => {
    if (selectedEmployee !== 'all') return [];

    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    employees.forEach(e => {
        if (e.role !== 'admin') {
           summary[e.value] = { name: e.name, target: 0, actual: 0 };
        }
    });
    
    targets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          summary[item.employeeId].target += p.monthlyTarget?.[selectedMonth] || 0;
          summary[item.employeeId].actual += p.monthlyActual?.[selectedMonth] || 0;
        });
      }
    });

    return Object.values(summary).filter(s => s.target > 0 || s.actual > 0);
  }, [targets, selectedEmployee, selectedMonth]);

  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [targets, selectedEmployee]);

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
            <h1 className="text-2xl font-semibold">월별 매출 목표 관리</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                직원 및 월을 선택하여 매출 목표를 설정, 수정, 삭제합니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-2">
                <div className="grid gap-2">
                  <label htmlFor="employee-filter">담당자</label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger id="employee-filter" className="w-[180px]">
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
                <div className="grid gap-2">
                  <label htmlFor="month-filter">월</label>
                  <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                    <SelectTrigger id="month-filter" className="w-[120px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>담당자</TableHead>
                            <TableHead className="text-right">매출 목표 ({selectedMonth}월)</TableHead>
                            <TableHead className="text-right">매출 실적 ({selectedMonth}월)</TableHead>
                            <TableHead>달성률</TableHead>
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
                                            <Progress value={achievementRate} className="h-2 w-32" />
                                            <span>{achievementRate.toFixed(1)}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                 </Table>
              ) : (
              <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    {(role === 'manager' || role === 'admin') && <TableHead className="w-[150px]">담당자</TableHead>}
                    <TableHead className="w-[250px]">고객명</TableHead>
                    <TableHead className="w-[250px]">제품명</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="text-right">9월 실적</TableHead>
                    <TableHead className="w-12 p-0"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}`}>
                          {pIndex === 0 && (
                            <>
                             {(role === 'manager' || role === 'admin') && (
                                <TableCell rowSpan={target.products.length + 1}>
                                    <Select
                                        value={target.employeeId}
                                        onValueChange={(value) => handleCustomerChange(target.customerCode, 'employeeId', value)}
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
                                </TableCell>
                             )}
                              <TableCell rowSpan={target.products.length + 1}>
                                {target.isNew ? (
                                    <Input 
                                        placeholder="고객명 입력" 
                                        value={target.customerName}
                                        onChange={(e) => handleCustomerChange(target.customerCode, 'customerName', e.target.value)}
                                    />
                                ) : (
                                  target.customerName
                                )}
                                <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                <Input 
                                    placeholder="제품명 입력" 
                                    value={product.productName}
                                    onChange={(e) => handleProductInfoChange(target.customerCode, product.productCode, 'productName', e.target.value)}
                                />
                            ): (
                                product.productName
                            )}
                            <div className="text-sm text-muted-foreground">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[6] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[7] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[8] || 0)}</TableCell>
                          <TableCell className="w-24 p-1">
                            <Input type="number" className="h-8 text-right" value={product.monthlyTarget[selectedMonth] || ''} onChange={(e) => handleTargetChange(target.customerCode, product.productCode, 'target', e.target.value)} />
                          </TableCell>
                          <TableCell className="w-24 p-1">
                            <Input type="number" className="h-8 text-right" value={product.monthlyActual[selectedMonth] || ''} onChange={(e) => handleTargetChange(target.customerCode, product.productCode, 'actual', e.target.value)} />
                          </TableCell>
                          <TableCell className="p-1 text-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProductFromCustomer(target.customerCode, product.productCode)}>
                                <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* --- Action Row --- */}
                      <TableRow>
                         {(role === 'employee' && target.products.length > 0) && <TableCell></TableCell>}
                        <TableCell colSpan={role === 'employee' ? 2 : 1} className={cn(target.products.length === 0 && 'border-r')}>
                            <Button variant="ghost" size="sm" onClick={() => addProductToCustomer(target.customerCode)}>
                                제품 추가
                            </Button>
                        </TableCell>
                        <TableCell colSpan={6} className="text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCustomer(target.customerCode)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
              </div>
              )}
               {selectedEmployee !== 'all' && (
                <div className="mt-4">
                    <Button onClick={addCustomer}>고객 추가</Button>
                </div>
               )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

