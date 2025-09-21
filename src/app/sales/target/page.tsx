
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
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';

type Target = typeof salesTargetManagementData[0];
type ProductTarget = Target['products'][0];

export default function SalesTargetManagementPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targets, setTargets] = useState(salesTargetManagementData);
  const [originalTargets, setOriginalTargets] = useState(salesTargetManagementData);
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const hasChanges = useMemo(() => JSON.stringify(targets) !== JSON.stringify(originalTargets), [targets, originalTargets]);

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
  
  const handleTargetChange = (customerCode: string, productName: string, newTarget: string) => {
    const numericTarget = parseInt(newTarget, 10) || 0;
    setTargets(prevTargets => 
      prevTargets.map(customer => {
        if (customer.customerCode === customerCode) {
          return {
            ...customer,
            products: customer.products.map(product => {
              if (product.productName === productName) {
                return { ...product, target: numericTarget };
              }
              return product;
            })
          };
        }
        return customer;
      })
    );
  };

  const handleSaveChanges = () => {
    setOriginalTargets(targets);
    toast({
      title: 'Targets Saved',
      description: 'The sales targets have been successfully updated.',
    });
  };

  const filteredTargets = useMemo(() => {
    return targets.filter(target => 
        (selectedEmployee === 'all' || target.employeeId === selectedEmployee) &&
        target.year === parseInt(selectedYear) &&
        target.month === parseInt(selectedMonth)
    );
  }, [targets, selectedYear, selectedMonth, selectedEmployee]);

  const availableYears = useMemo(() => Array.from(new Set(salesTargetManagementData.map(t => t.year))), []);
  const availableMonths = useMemo(() => Array.from({length: 12}, (_, i) => i + 1), []);

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
                <h1 className="text-2xl font-semibold">월별 매출 목표 관리</h1>
                <div className="flex items-center gap-2">
                    {hasChanges && canEdit && (
                       <Button size="sm" onClick={handleSaveChanges}>Save Changes</Button>
                    )}
                    <Button type="button" variant="outline" onClick={handleBack}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>고객/제품별 매출 목표</CardTitle>
              <CardDescription>
                관리자는 고객 및 제품별 월간 매출 목표를 설정할 수 있습니다.
              </CardDescription>
              <div className="flex items-end justify-between pt-4">
                <div className="flex items-end gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="year-select">Year</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger id="year-select" className="w-[120px]">
                                <SelectValue />
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
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => (
                                    <SelectItem key={month} value={String(month)}>{month}월</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(role === 'admin' || role === 'manager') && (
                        <div className="grid gap-2">
                            <Label htmlFor="employee-select">Employee</Label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                <SelectTrigger id="employee-select" className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Employees</SelectItem>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>담당 직원</TableHead>
                    <TableHead className="text-right w-[200px]">매출 목표</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.length > 0 ? filteredTargets.map((customer) => (
                    customer.products.map((product, pIndex) => (
                        <TableRow key={`${customer.customerCode}-${product.productName}`}>
                            {pIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="font-medium align-top">
                                    {customer.customerName}
                                </TableCell>
                            )}
                            <TableCell>{product.productName}</TableCell>
                            {pIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="align-top">
                                    {customer.employeeName}
                                </TableCell>
                            )}
                            <TableCell className="text-right">
                                <Input 
                                    type="number" 
                                    value={product.target}
                                    onChange={(e) => handleTargetChange(customer.customerCode, product.productName, e.target.value)}
                                    disabled={!canEdit}
                                    className="h-8 text-right"
                                />
                            </TableCell>
                        </TableRow>
                    ))
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        선택한 기간에 해당하는 목표 데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
