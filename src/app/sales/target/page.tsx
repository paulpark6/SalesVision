
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
  TableFooter,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';

type Target = typeof salesTargetManagementData[0];
type ProductTarget = Target['products'][0];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const [targets, setTargets] = useState(salesTargetManagementData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const employeeOptions = useMemo(() => {
    const options = employees.map(e => ({ value: e.value, label: e.label }));
    if(role === 'admin') {
        const adminUser = employees.find(e => e.value === auth?.userId);
        if(adminUser && !options.some(o => o.value === adminUser.value)) {
            options.unshift({ value: adminUser.value, label: adminUser.label });
        }
    }
    return options;
  }, [role, auth?.userId]);

  const filteredTargets = useMemo(() => {
    return targets.filter(target => {
      const yearMatch = target.year === parseInt(selectedYear);
      const monthMatch = target.month === parseInt(selectedMonth);
      const employeeMatch = selectedEmployee === 'all' || target.employeeId === selectedEmployee;
      return yearMatch && monthMatch && employeeMatch;
    });
  }, [targets, selectedYear, selectedMonth, selectedEmployee]);

  const handleTargetChange = (customerCode: string, productCode: string, newTarget: number) => {
    setTargets(prevTargets => {
      const newTargets = prevTargets.map(target => {
        if (target.customerCode === customerCode && target.year === parseInt(selectedYear) && target.month === parseInt(selectedMonth)) {
          const updatedProducts = target.products.map(p => {
            if (p.productCode === productCode) {
              return { ...p, target: newTarget };
            }
            return p;
          });
          return { ...target, products: updatedProducts };
        }
        return target;
      });
      return newTargets;
    });
    setHasChanges(true);
  };
  
  const handleSaveChanges = () => {
    // Here you would typically send the changes to your backend
    toast({
        title: "저장 완료",
        description: "매출 목표가 성공적으로 저장되었습니다."
    });
    setHasChanges(false);
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const grandTotal = useMemo(() => {
    return filteredTargets.reduce((total, target) => {
      return total + target.products.reduce((productTotal, p) => productTotal + p.target, 0);
    }, 0);
  }, [filteredTargets]);

  const canEdit = role === 'admin';
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

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
                <h1 className="text-2xl font-semibold">월별/직원별 매출 목표 설정</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 관리</CardTitle>
              <CardDescription>
                월별, 직원별로 고객의 제품 매출 목표를 설정합니다. 관리자만 목표를 수정할 수 있습니다.
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
                    {(role === 'manager' || role === 'admin') && (
                        <div className="grid gap-2">
                            <Label htmlFor="employee-select">담당 직원</Label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
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
                    )}
                 </div>
                 {canEdit && hasChanges && (
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                 )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right w-[200px]">매출 목표</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target, targetIndex) => (
                    target.products.map((product, productIndex) => (
                      <TableRow key={`${target.customerCode}-${product.productCode}`}>
                        {productIndex === 0 ? (
                          <TableCell rowSpan={target.products.length} className="font-medium align-top border-b">
                            {target.customerName}
                          </TableCell>
                        ) : null}
                        <TableCell>{product.productName}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={product.target}
                            onChange={(e) => handleTargetChange(target.customerCode, product.productCode, parseInt(e.target.value) || 0)}
                            className="h-8 text-right"
                            disabled={!canEdit}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} className="font-bold text-right">총 합계</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(grandTotal)}</TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

