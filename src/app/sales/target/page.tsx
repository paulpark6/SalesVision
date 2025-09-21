
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
import {
  salesTargetManagementData,
  employees as employeeOptions,
  customers as customerOptions,
  products as productOptions,
} from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';


type EditableSalesTarget = SalesTarget & {
    products: (SalesTarget['products'][0] & {
        isNew?: boolean;
    })[]
};


const getInitialTargets = (): EditableSalesTarget[] => {
    return JSON.parse(JSON.stringify(salesTargetManagementData));
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useAuth();
  const role = auth?.role;

  const [targets, setTargets] = useState<EditableSalesTarget[]>(getInitialTargets());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else if (role === 'employee') {
        const loggedInEmployee = employeeOptions.find(e => e.value === auth.userId);
        if (loggedInEmployee) {
            setSelectedEmployee(loggedInEmployee.value);
        }
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [targets, selectedEmployee]);

  const handleTargetChange = (customerCode: string, productCode: string, field: 'targetQuantity' | 'targetSales', value: number) => {
    setTargets(prev => prev.map(customer => {
      if (customer.customerCode === customerCode) {
        return {
          ...customer,
          products: customer.products.map(p => {
            if (p.productCode === productCode) {
              return { ...p, [field]: value };
            }
            return p;
          })
        };
      }
      return customer;
    }));
  };
  
  const employeeSummary = useMemo(() => {
    if (selectedEmployee !== 'all') return [];

    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};

    employeeOptions.forEach(emp => {
      summary[emp.value] = { name: emp.label, target: 0, actual: 0 };
    });

    targets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
            if (p.monthlyTarget) {
                summary[item.employeeId].target += p.monthlyTarget[selectedMonth as any] || 0;
            }
            if (p.monthlyActual) {
                summary[item.employeeId].actual += p.monthlyActual[selectedMonth as any] || 0;
            }
        });
      }
    });

    return Object.values(summary);
  }, [targets, selectedEmployee, selectedMonth]);


  const handleAddCustomer = () => {
      const newCustomerTarget: EditableSalesTarget = {
          employeeId: selectedEmployee !== 'all' ? selectedEmployee : '',
          customerName: '',
          customerCode: '',
          products: [{
              productName: '',
              productCode: '',
              categoryCode: '',
              isNew: true,
              targetQuantity: 0,
              targetSales: 0,
              monthlyTarget: {},
              monthlyActual: {},
              pastSales: {},
          }]
      };
      setTargets(prev => [...prev, newCustomerTarget]);
  };

  const handleAddProduct = (customerCode: string) => {
    setTargets(prev => prev.map(t => {
        if (t.customerCode === customerCode) {
            return {
                ...t,
                products: [...t.products, {
                    productName: '',
                    productCode: '',
                    categoryCode: '',
                    isNew: true,
                    targetQuantity: 0,
                    targetSales: 0,
                    monthlyTarget: {},
                    monthlyActual: {},
                    pastSales: {}
                }]
            }
        }
        return t;
    }));
  };

  const handleCustomerChange = (index: number, customerCode: string) => {
    const customer = customerOptions.find(c => c.value === customerCode);
    if(customer) {
        setTargets(prev => {
            const newTargets = [...prev];
            newTargets[index] = {
                ...newTargets[index],
                customerCode: customer.value,
                customerName: customer.label,
                employeeId: customer.employeeId || newTargets[index].employeeId
            };
            return newTargets;
        })
    }
  };

  const handleProductChange = (customerIndex: number, productIndex: number, productCode: string) => {
      const product = productOptions.find(p => p.value === productCode);
      if (product) {
          setTargets(prev => {
              const newTargets = [...prev];
              const customer = newTargets[customerIndex];
              const newProducts = [...customer.products];
              newProducts[productIndex] = {
                  ...newProducts[productIndex],
                  productCode: product.value,
                  productName: product.label,
              };
              customer.products = newProducts;
              return newTargets;
          })
      }
  }
  
  const handleSaveChanges = () => {
      // In a real app, this would send the state to the backend.
      // For this demo, we'll just show a success toast.
      toast({
          title: "목표 저장됨",
          description: "매출 목표가 성공적으로 저장되었습니다."
      });
  }

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">월별 매출 목표 관리</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                직원 및 월별로 고객-제품 단위의 매출 목표를 설정합니다. 과거 3개월 매출을 참고하여 목표를 입력하세요.
              </CardDescription>
              <div className="flex items-end justify-between pt-2">
                <div className="flex items-end gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="employee-select">담당 직원</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={role==='employee'}>
                            <SelectTrigger id="employee-select" className="w-[180px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                {employeeOptions.map(emp => (
                                    <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="month-select">대상 월</Label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger id="month-select" className="w-[120px]">
                            <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                            {availableMonths.map(month => (
                                <SelectItem key={month} value={String(month)}>{month}월</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <Button onClick={handleSaveChanges}>목표 저장</Button>
              </div>
            </CardHeader>
            <CardContent>
             {selectedEmployee === 'all' && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">{selectedMonth}월 팀원별 목표 요약</h3>
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
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객사</TableHead>
                    <TableHead className="w-[250px]">제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[120px] text-right">목표 수량</TableHead>
                    <TableHead className="w-[150px] text-right">목표 매출액</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target, cIndex) => (
                    <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode || cIndex}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}-${pIndex}`}>
                          {pIndex === 0 && (
                            <TableCell rowSpan={target.products.length + 1} className="font-medium align-top pt-5">
                                {target.customerCode ? (
                                    <>
                                        <div>{target.customerName}</div>
                                        <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                                    </>
                                ) : (
                                    <Combobox
                                        items={customerOptions}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                        value={target.customerName}
                                        onValueChange={(value) => {
                                            const selectedCustomer = customerOptions.find(c => c.label.toLowerCase() === value.toLowerCase())
                                            if (selectedCustomer) handleCustomerChange(cIndex, selectedCustomer.value)
                                        }}
                                    />
                                )}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                 <Combobox
                                    items={productOptions}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
                                    value={product.productName}
                                    onValueChange={(value) => {
                                        const selectedProduct = productOptions.find(p => p.label.toLowerCase() === value.toLowerCase())
                                        if (selectedProduct) handleProductChange(cIndex, pIndex, selectedProduct.value)
                                    }}
                                />
                            ) : (
                                <>
                                    <div>{product.productName}</div>
                                    <div className="text-sm text-muted-foreground">{product.productCode}</div>
                                </>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[6] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[7] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales && product.pastSales[8] || 0)}</TableCell>
                          <TableCell className="text-right">
                            <Input 
                                type="number" 
                                value={product.targetQuantity}
                                onChange={(e) => handleTargetChange(target.customerCode, product.productCode, 'targetQuantity', parseInt(e.target.value))}
                                className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                value={product.targetSales}
                                onChange={(e) => handleTargetChange(target.customerCode, product.productCode, 'targetSales', parseInt(e.target.value))}
                                className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                       <TableRow>
                            <TableCell colSpan={7}>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddProduct(target.customerCode)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                        </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6">
                <Button variant="secondary" className="w-full" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
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
