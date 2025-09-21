
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

type Target = typeof salesTargetManagementData[0];
type ProductTarget = Target['products'][0];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const [targets, setTargets] = useState<Target[]>(salesTargetManagementData);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.userId) return null;
    return employees.find(e => e.value === auth.userId);
  }, [auth]);

  // Set initial filter based on role
  useEffect(() => {
    if (role === 'employee' && loggedInEmployee) {
      setSelectedEmployee(loggedInEmployee.value);
    } else {
      setSelectedEmployee('all');
    }
  }, [role, loggedInEmployee]);

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

  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  const employeeOptions = useMemo(() => {
      if (role === 'admin') return employees;
      if (role === 'manager' && loggedInEmployee) {
          const team = employees.filter(e => e.manager === loggedInEmployee.value || e.value === loggedInEmployee.value);
          return team;
      }
      if (role === 'employee' && loggedInEmployee) {
          return [loggedInEmployee];
      }
      return [];
  }, [role, loggedInEmployee]);

  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [selectedEmployee, targets]);

  const handleTargetChange = (customerCode: string, productCode: string, month: number, value: number) => {
      setTargets(prevTargets => {
          return prevTargets.map(target => {
              if (target.customerCode === customerCode) {
                  const updatedProducts = target.products.map(product => {
                      if (product.productCode === productCode) {
                          const newMonthlyTarget = { ...product.monthlyTarget, [month]: value };
                          return { ...product, monthlyTarget: newMonthlyTarget };
                      }
                      return product;
                  });
                  return { ...target, products: updatedProducts };
              }
              return target;
          });
      });
  };

  const handleSave = () => {
    // In a real app, this would send the updated `targets` state to an API
    toast({
        title: '목표 저장됨',
        description: '설정된 매출 목표가 성공적으로 저장되었습니다.'
    });
  }

  const employeeSummary = useMemo(() => {
    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    
    employeeOptions.forEach(emp => {
      summary[emp.value] = { name: emp.name, target: 0, actual: 0 };
    });

    salesTargetManagementData.forEach(item => {
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
  }, [selectedMonth, employeeOptions]);

  const adminOptions = employees.filter(e => e.role === 'admin');

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별/고객별/제품별 매출 목표</h1>
            <div className='flex gap-2'>
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
              { (role === 'admin' || role === 'manager') && <Button onClick={handleSave}>목표 저장</Button>}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                월, 담당 직원, 고객 및 제품별로 매출 목표를 설정합니다. 관리자와 매니저만 목표를 수정할 수 있습니다.
              </CardDescription>
              <div className="flex items-end justify-between pt-4">
                <div className="flex items-end gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="month-select">월</Label>
                    <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="employee-select">담당 직원</Label>
                     <Select 
                        value={selectedEmployee} 
                        onValueChange={setSelectedEmployee}
                        disabled={role === 'employee'}
                     >
                        <SelectTrigger id="employee-select" className="w-[180px]">
                            <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            {role !== 'employee' && <SelectItem value="all">전체</SelectItem>}
                            
                            {role === 'admin' && adminOptions.map(emp => (
                                <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                            ))}
                            
                            {employeeOptions.filter(e => e.role !== 'admin').map(emp => (
                                <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' && (
                  <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">팀원별 {selectedMonth}월 목표 요약</h3>
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
                    <TableHead className="w-[150px]">고객명</TableHead>
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right w-[150px]">6월</TableHead>
                    <TableHead className="text-right w-[150px]">7월</TableHead>
                    <TableHead className="text-right w-[150px]">8월</TableHead>
                    <TableHead className="text-right w-[180px]">목표 ({selectedMonth}월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}`}>
                          {pIndex === 0 && (
                            <TableCell rowSpan={target.products.length} className="font-medium align-top border-r">
                              {target.customerName}
                              <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                            </TableCell>
                          )}
                          <TableCell>
                            {product.productName}
                            <div className="text-sm text-muted-foreground">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales[6] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales[7] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales[8] || 0)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="h-8 text-right"
                              placeholder="목표 입력"
                              value={product.monthlyTarget[selectedMonth] || ''}
                              onChange={(e) => handleTargetChange(target.customerCode, product.productCode, selectedMonth, Number(e.target.value))}
                              disabled={role === 'employee'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
