
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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

  const [targets, setTargets] = useState(salesTargetManagementData);
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>('9');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleTargetChange = (customerCode: string, productName: string, month: string, value: string) => {
    const newTargets = targets.map(target => {
      if (target.customer.code === customerCode) {
        const newProducts = target.products.map(p => {
          if (p.name === productName) {
            const newMonthlyTargets = { ...p.monthlyTarget, [month]: parseInt(value, 10) || 0 };
            return { ...p, monthlyTarget: newMonthlyTargets };
          }
          return p;
        });
        return { ...target, products: newProducts };
      }
      return target;
    });
    setTargets(newTargets);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Here you would typically send the updated `targets` state to your backend
    toast({
      title: 'Changes Saved',
      description: 'The sales targets have been successfully updated.',
    });
    setHasChanges(false);
  };
  
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2018 }, (_, i) => currentYear - i);
  const availableMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const employeeOptions = useMemo(() => {
      if (role === 'admin') {
          return employees;
      }
      if (role === 'manager') {
          const managerId = auth?.userId;
          return employees.filter(e => e.value === managerId || e.manager === managerId);
      }
      if (role === 'employee') {
          return employees.filter(e => e.value === auth?.userId);
      }
      return [];
  }, [role, auth]);

  useEffect(() => {
      if (role === 'employee' && auth?.userId) {
          setSelectedEmployee(auth.userId);
      } else {
          setSelectedEmployee('all');
      }
  }, [role, auth?.userId])

  const filteredTargets = useMemo(() => {
    return targets.filter(target => {
      if (selectedEmployee === 'all') return true;
      return target.employeeId === selectedEmployee;
    });
  }, [targets, selectedEmployee]);

  const canEdit = role === 'admin';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const employeeSummary = useMemo(() => {
    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    employees.forEach(emp => {
      summary[emp.value] = { name: emp.label, target: 0, actual: 0 };
    });

    salesTargetManagementData.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          summary[item.employeeId].target += p.monthlyTarget[selectedMonth] || 0;
          summary[item.employeeId].actual += p.monthlyActual[selectedMonth] || 0;
        });
      }
    });

    return Object.values(summary).filter(s => s.target > 0 || s.actual > 0);
  }, [selectedMonth]);


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
            <h1 className="text-2xl font-semibold">고객별/제품별 월간 매출 목표</h1>
            <div className="flex items-center gap-2">
              {canEdit && hasChanges && (
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              )}
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Dashboard
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 관리</CardTitle>
              <CardDescription>
                고객 및 제품별로 월간 매출 목표를 설정하고 관리합니다. 관리자만 목표를 수정할 수 있습니다.
              </CardDescription>
              <div className="flex items-end justify-between pt-4">
                <div className="flex items-end gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year-select">연도</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger id="year-select" className="w-[120px]">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="month-select">월</Label>
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
                   <div className="grid gap-2">
                    <Label htmlFor="employee-select">담당 직원</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={role === 'employee'}>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
             {selectedEmployee === 'all' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">팀원별 9월 목표 달성 현황</h3>
                   <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>직원</TableHead>
                            <TableHead className="text-right">매출 목표</TableHead>
                            <TableHead className="text-right">매출 실적</TableHead>
                            <TableHead className="w-[200px]">달성률</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeSummary.map(employee => {
                            const achievementRate = employee.target > 0 ? (employee.actual / employee.target) * 100 : 0;
                            return (
                                <TableRow key={employee.name}>
                                    <TableCell className="font-medium">{employee.name}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(employee.target)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(employee.actual)}</TableCell>
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
                     <TableFooter>
                          <TableRow>
                              <TableCell className="font-bold">총계</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(employeeSummary.reduce((a,b) => a + b.target, 0))}</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(employeeSummary.reduce((a,b) => a + b.actual, 0))}</TableCell>
                              <TableCell></TableCell>
                          </TableRow>
                      </TableFooter>
                </Table>
                <hr className="my-8" />
                </div>
              )}

              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] sticky left-0 bg-card z-10">고객사</TableHead>
                      <TableHead className="w-[200px] sticky left-[200px] bg-card z-10">제품명</TableHead>
                      <TableHead className="text-right">목표</TableHead>
                      <TableHead className="text-right">실적</TableHead>
                      <TableHead className="w-[150px]">달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTargets.map((target) => (
                      target.products.map((p, pIndex) => {
                        const monthlyTarget = p.monthlyTarget[selectedMonth] || 0;
                        const monthlyActual = p.monthlyActual[selectedMonth] || 0;
                        const achievement = monthlyTarget > 0 ? (monthlyActual / monthlyTarget) * 100 : 0;
                        return (
                          <TableRow key={`${target.customer.code}-${p.name}`}>
                            {pIndex === 0 && (
                              <TableCell rowSpan={target.products.length} className="font-medium sticky left-0 bg-card z-10 border-b border-r">
                                {target.customer.name}
                              </TableCell>
                            )}
                            <TableCell className="font-medium sticky left-[200px] bg-card z-10 border-b">{p.name}</TableCell>
                            <TableCell className="text-right">
                              {canEdit ? (
                                <Input
                                  type="number"
                                  value={monthlyTarget}
                                  onChange={(e) => handleTargetChange(target.customer.code, p.name, selectedMonth, e.target.value)}
                                  className="h-8 text-right"
                                />
                              ) : (
                                formatCurrency(monthlyTarget)
                              )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(monthlyActual)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={achievement} className="h-2" />
                                <span className="text-xs font-semibold w-12 text-right">
                                  {achievement.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
