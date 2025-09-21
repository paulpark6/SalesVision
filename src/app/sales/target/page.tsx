
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

type Target = (typeof salesTargetManagementData)[0];
type ProductTarget = Target['products'][0];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targets, setTargets] = useState<Target[]>(salesTargetManagementData);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTargets, setOriginalTargets] = useState<Target[]>([]);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>('9');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const employeeOptions = useMemo(() => {
    if (role === 'admin') {
      return employees;
    } else if (role === 'manager') {
      const manager = employees.find(e => e.role === 'manager');
      const team = employees.filter(e => e.manager === manager?.value || e.value === manager?.value);
      return team;
    } else {
        const employee = employees.find(e => e.role === 'employee');
        return employee ? [employee] : [];
    }
  }, [role]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
        if (role === 'employee') {
            const employee = employees.find(e => e.role === 'employee');
            if (employee) setSelectedEmployee(employee.value);
        } else {
            setSelectedEmployee('all');
        }
    }
  }, [auth, router, role]);

  useEffect(() => {
    setOriginalTargets(JSON.parse(JSON.stringify(salesTargetManagementData)));
  }, []);

  const handleTargetChange = (customerCode: string, productCode: string, newTarget: number) => {
    const updatedTargets = targets.map(target => {
      if (target.customerCode === customerCode) {
        return {
          ...target,
          products: target.products.map(product => {
            if (product.productCode === productCode) {
              const updatedMonthlyTarget = { ...product.monthlyTarget, [selectedMonth]: newTarget };
              return { ...product, monthlyTarget: updatedMonthlyTarget };
            }
            return product;
          }),
        };
      }
      return target;
    });
    setTargets(updatedTargets);
    setHasChanges(true);
  };
  
  const handleSaveChanges = () => {
    setOriginalTargets(JSON.parse(JSON.stringify(targets)));
    setHasChanges(false);
    toast({
        title: "Changes Saved",
        description: "Your sales target changes have been saved.",
    });
  };

  const handleCancelChanges = () => {
      setTargets(originalTargets);
      setHasChanges(false);
  }

  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      if (role === 'admin') return targets;
      const managerId = employees.find(e => e.role === 'manager')?.value;
      const teamIds = employees.filter(e => e.manager === managerId).map(e => e.value);
      const visibleIds = [managerId, ...teamIds].filter(Boolean);
      return targets.filter(t => visibleIds.includes(t.employeeId));
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [targets, selectedEmployee, role]);

  const employeeSummary = useMemo(() => {
    const summary: Record<string, { name: string; target: number; actual: number }> = {};
    employees.forEach(emp => {
      summary[emp.value] = { name: emp.label, target: 0, actual: 0 };
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
    
    return Object.values(summary).filter(s => s.target > 0 || s.actual > 0);
  }, [selectedMonth]);


  const canEdit = role === 'admin';

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
                <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
                {hasChanges && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelChanges}>Cancel</Button>
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                )}
            </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 관리</CardTitle>
              <CardDescription>
                월별, 직원별, 고객별, 제품별 매출 목표를 설정하고 관리합니다. 관리자만 목표를 수정할 수 있습니다.
              </CardDescription>
              <div className="flex items-end justify-between pt-2">
                <div className="flex items-end gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="year-select">Year</Label>
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
                        <Label htmlFor="month-select">Month</Label>
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
                            <SelectTrigger id="employee-select" className="w-[150px]">
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
              {selectedEmployee === 'all' && (role === 'admin' || role === 'manager') && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>팀원별 {selectedMonth}월 목표 달성 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                                const achievement = emp.target > 0 ? (emp.actual / emp.target) * 100 : 0;
                                return (
                                    <TableRow key={emp.name}>
                                        <TableCell className="font-medium">{emp.name}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(emp.target)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(emp.actual)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={achievement} className="h-2" />
                                                <span className="text-xs font-semibold w-12 text-right">
                                                    {achievement.toFixed(1)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedEmployee === 'all' && <TableHead>담당</TableHead>}
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">매출 목표 ({selectedMonth}월)</TableHead>
                    <TableHead className="text-right">실제 매출 ({selectedMonth}월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <Fragment key={target.customerCode}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}`}>
                          {pIndex === 0 && (
                            <>
                              {selectedEmployee === 'all' && 
                                <TableCell rowSpan={target.products.length} className="align-top">
                                  {target.employeeName}
                                </TableCell>
                              }
                              <TableCell rowSpan={target.products.length} className="font-medium align-top">
                                {target.customerName}
                                <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            {product.productName}
                            <div className="text-sm text-muted-foreground">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">
                             {canEdit ? (
                                <Input
                                    type="number"
                                    value={product.monthlyTarget?.[selectedMonth] || 0}
                                    onChange={(e) => handleTargetChange(target.customerCode, product.productCode, parseInt(e.target.value, 10))}
                                    className="h-8 w-32 text-right ml-auto"
                                    placeholder="0"
                                />
                             ) : (
                                formatCurrency(product.monthlyTarget?.[selectedMonth] || 0)
                             )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(product.monthlyActual?.[selectedMonth] || 0)}
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

    