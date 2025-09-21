
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

type Target = typeof salesTargetManagementData[0];
type ProductTarget = Target['products'][0];

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [targets, setTargets] = useState(salesTargetManagementData);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const employeeOptions = useMemo(() => {
    if (role === 'admin') {
      return employees;
    }
    if (role === 'manager') {
      const manager = employees.find(e => e.value === auth?.userId);
      if (manager) {
        const teamMemberIds = employees.filter(e => e.manager === manager.value).map(e => e.value);
        const managedIds = [manager.value, ...teamMemberIds];
        return [
          { value: 'all', label: '전체', role: 'all', name: 'All' },
          ...employees.filter(e => managedIds.includes(e.value))
        ];
      }
    }
    return employees.filter(e => e.value === auth?.userId);
  }, [role, auth?.userId]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  useEffect(() => {
    // If user is employee, default to their view
    if (role === 'employee' && auth?.userId) {
      setSelectedEmployee(auth.userId);
    }
  }, [role, auth?.userId])

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleSave = () => {
    toast({
      title: '목표 저장됨',
      description: '설정된 매출 목표가 성공적으로 저장되었습니다.',
    });
  };

  const handleProductTargetChange = (customerCode: string, productCode: string, field: 'quantity' | 'target', value: number) => {
      setTargets(prevTargets => {
          return prevTargets.map(target => {
              if (target.customerCode === customerCode) {
                  const updatedProducts = target.products.map(product => {
                      if (product.productCode === productCode) {
                          if (field === 'quantity') {
                            product.quantity[selectedMonth as keyof typeof product.quantity] = value;
                          } else { // target
                            product.monthlyTarget[selectedMonth as keyof typeof product.monthlyTarget] = value;
                          }
                          return product;
                      }
                      return product;
                  });
                  return { ...target, products: updatedProducts };
              }
              return target;
          });
      });
  };
  
  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      if (role === 'manager') {
        const managerId = auth?.userId;
        const teamMemberIds = employees.filter(e => e.manager === managerId).map(e => e.value);
        const managedIds = [managerId, ...teamMemberIds];
        return targets.filter(t => managedIds.includes(t.employeeId));
      }
      return targets;
    }
    return targets.filter(t => t.employeeId === selectedEmployee);
  }, [targets, selectedEmployee, role, auth?.userId]);

  const employeeSummary = useMemo(() => {
    if (selectedEmployee !== 'all') return [];

    const summary: { [key: string]: { name: string, target: number, actual: number } } = {};
    
    employees.forEach(emp => {
      if (emp.value !== 'all') {
        summary[emp.value] = { name: emp.label, target: 0, actual: 0 };
      }
    });

    filteredTargets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          if (p.monthlyTarget) {
            summary[item.employeeId].target += p.monthlyTarget[selectedMonth as keyof typeof p.monthlyTarget] || 0;
          }
          if (p.monthlyActual) {
            summary[item.employeeId].actual += p.monthlyActual[selectedMonth as keyof typeof p.monthlyActual] || 0;
          }
        });
      }
    });

    let dataToReturn = Object.values(summary).filter(s => s.target > 0 || s.actual > 0);

    if (role === 'manager') {
        const managerId = auth?.userId;
        const teamMemberIds = employees.filter(e => e.manager === managerId).map(e => e.value);
        const managedIds = [managerId, ...teamMemberIds];
        
        const employeeIdToValueMap: {[key:string]: string} = employees.reduce((acc, curr) => {
            acc[curr.name] = curr.value;
            return acc;
        }, {} as {[key:string]: string})

        dataToReturn = dataToReturn.filter(s => {
            const employeeValue = employees.find(e => e.label === s.name)?.value;
            return employeeValue && managedIds.includes(employeeValue);
        });
    }

    return dataToReturn;
  }, [filteredTargets, selectedEmployee, selectedMonth, role, auth?.userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
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
                <h1 className="text-2xl font-semibold">월별/고객별/제품별 매출 목표 관리</h1>
                 <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleBack}>
                        Back to Dashboard
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        Save All Changes
                    </Button>
                </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                월, 담당 직원, 고객을 선택하여 제품별 매출 목표 수량과 금액을 설정합니다.
              </CardDescription>
               <div className="flex items-end gap-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="month-select">월 선택</Label>
                        <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
                            <SelectTrigger id="month-select" className="w-[120px]">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                    <SelectItem key={month} value={String(month)}>{month}월</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="employee-select">담당 직원</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={role==='employee'}>
                            <SelectTrigger id="employee-select" className="w-[180px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeOptions.map(emp => (
                                    <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedEmployee === 'all' && (
                  <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-2">팀원별 {selectedMonth}월 목표 요약</h3>
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
                                          <TableCell>{emp.name}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(emp.target)}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(emp.actual)}</TableCell>
                                          <TableCell>
                                              <div className="flex items-center gap-2">
                                                  <Progress value={achievementRate} className="h-2" />
                                                  <span className="text-xs font-semibold w-12 text-right">{achievementRate.toFixed(1)}%</span>
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
                    <TableHead className="w-[150px]">고객</TableHead>
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="text-right w-[150px]">{selectedMonth}월 목표 수량</TableHead>
                    <TableHead className="text-right w-[150px]">{selectedMonth}월 목표 매출</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <Fragment key={`${target.customerCode}-${target.products[0]?.categoryCode}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={`${target.customerCode}-${product.productCode}`}>
                          {pIndex === 0 && (
                            <TableCell rowSpan={target.products.length} className="font-medium align-top">
                                {target.customerName}
                                <div className="text-sm text-muted-foreground">{target.customerCode}</div>
                            </TableCell>
                          )}
                          <TableCell>
                            {product.productName}
                            <div className="text-sm text-muted-foreground">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[6] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[7] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[8] || 0)}</TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                className="h-8 text-right"
                                value={product.quantity[selectedMonth as keyof typeof product.quantity] || ''}
                                onChange={(e) => handleProductTargetChange(target.customerCode, product.productCode, 'quantity', parseInt(e.target.value) || 0)}
                              />
                          </TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                className="h-8 text-right"
                                value={product.monthlyTarget[selectedMonth as keyof typeof product.monthlyTarget] || ''}
                                onChange={(e) => handleProductTargetChange(target.customerCode, product.productCode, 'target', parseInt(e.target.value) || 0)}
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
