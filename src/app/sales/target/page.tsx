
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
import { ChevronDown, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesTargetManagementData, employees } from '@/lib/mock-data';

type Target = typeof salesTargetManagementData[0];
type ProductTarget = Target['products'][0];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>('9');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [targets, setTargets] = useState<Target[]>(salesTargetManagementData);
  const [hasChanges, setHasChanges] = useState(false);

  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  
  const loggedInEmployee = useMemo(() => {
    if (!auth?.userId) return null;
    return employees.find(e => e.value === auth.userId);
  },[auth]);

  // Set default employee filter based on role
  useEffect(() => {
    if (loggedInEmployee) {
      if (role === 'employee') {
        setSelectedEmployee(loggedInEmployee.value);
      } else {
        setSelectedEmployee(''); // Default to 'all' for manager/admin
      }
    }
  }, [loggedInEmployee, role]);

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
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => String(currentYear - i));
  const availableMonths = Array.from({length: 12}, (_, i) => String(i + 1));
  
  const filteredData = useMemo(() => {
    let data = targets.filter(t => t.year === parseInt(selectedYear));
    
    if (role === 'employee' && loggedInEmployee) {
        data = data.filter(t => t.employeeId === loggedInEmployee.value);
    } else if (selectedEmployee) {
        if (role === 'manager' && loggedInEmployee) {
             const teamMemberIds = employees.filter(e => e.manager === loggedInEmployee.value).map(e => e.value);
             const managedIds = [loggedInEmployee.value, ...teamMemberIds];
             if (selectedEmployee === 'my-team') {
                 return data.filter(t => managedIds.includes(t.employeeId));
             }
        }
        data = data.filter(t => t.employeeId === selectedEmployee);
    }

    return data;
  }, [targets, selectedYear, selectedEmployee, role, loggedInEmployee]);

  const canEdit = role === 'admin';

  const handleTargetChange = (customerCode: string, productName: string, newTarget: number) => {
    setTargets(prevTargets =>
      prevTargets.map(customer => {
        if (customer.customerCode === customerCode) {
          const updatedProducts = customer.products.map(product => {
            if (product.productName === productName) {
              return { ...product, monthlyTarget: { ...product.monthlyTarget, [selectedMonth]: newTarget }};
            }
            return product;
          });
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
    setHasChanges(true);
  };
  
  const handleSaveChanges = () => {
    // In a real app, you would send this to your backend API.
    setHasChanges(false);
    toast({
        title: '저장 완료',
        description: '매출 목표 변경사항이 성공적으로 저장되었습니다.'
    });
  };

  const employeeOptions = useMemo(() => {
    if (role === 'manager' && loggedInEmployee) {
      const teamMembers = employees.filter(e => e.manager === loggedInEmployee.value);
      return [
        { label: '내 팀 전체', value: 'my-team' },
        loggedInEmployee,
        ...teamMembers
      ];
    }
    return employees;
  }, [role, loggedInEmployee]);

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
                <h1 className="text-2xl font-semibold">월별 고객/제품 매출 목표</h1>
                 <div className="flex items-center gap-2">
                    {hasChanges && (
                        <Button size="sm" className="h-8 gap-1" onClick={handleSaveChanges}>
                            <Save className="h-3.5 w-3.5" />
                            <span>Save Changes</span>
                        </Button>
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
                월별, 직원별로 고객의 제품 매출 목표를 설정하고 관리합니다. 관리자만 목표를 수정할 수 있습니다.
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
                            <SelectItem key={year} value={year}>{year}</SelectItem>
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
                            <SelectItem key={month} value={month}>{month}월</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                     {(role === 'admin' || role === 'manager') && (
                        <div className="grid gap-2">
                            <Label htmlFor="employee-select">담당 직원</Label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled={role === 'employee'}>
                                <SelectTrigger id="employee-select" className="w-[180px]">
                                    <SelectValue placeholder="전체" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">전체</SelectItem>
                                    {employeeOptions.map(emp => (
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
                    <TableHead>고객사</TableHead>
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right">매출 목표 ({selectedMonth}월)</TableHead>
                    <TableHead className="text-right">매출 실적 ({selectedMonth}월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((customer) => {
                      const isOpen = openCollapsible === customer.customerCode;
                      const customerTotalTarget = customer.products.reduce((sum, p) => sum + (p.monthlyTarget[selectedMonth] || 0), 0);
                      const customerTotalActual = customer.products.reduce((sum, p) => sum + (p.monthlyActual[selectedMonth] || 0), 0);
                      
                      return (
                        <Fragment key={customer.customerCode}>
                          <TableRow onClick={() => setOpenCollapsible(isOpen ? null : customer.customerCode)} className="cursor-pointer bg-muted/25 hover:bg-muted/50">
                            <TableCell className="font-medium">
                               <div className="flex items-center gap-2">
                                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                {customer.customerName}
                                <span className="text-xs text-muted-foreground">({customer.employeeName})</span>
                               </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">전체 {customer.products.length}개 품목</Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(customerTotalTarget)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(customerTotalActual)}</TableCell>
                          </TableRow>
                          {isOpen && customer.products.map(product => (
                            <TableRow key={product.productName}>
                                <TableCell></TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell className="text-right">
                                    {canEdit ? (
                                        <Input
                                            type="number"
                                            value={product.monthlyTarget[selectedMonth] || ''}
                                            onChange={(e) => handleTargetChange(customer.customerCode, product.productName, parseInt(e.target.value) || 0)}
                                            className="h-8 w-32 ml-auto text-right"
                                            placeholder="0"
                                        />
                                    ) : (
                                        formatCurrency(product.monthlyTarget[selectedMonth] || 0)
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(product.monthlyActual[selectedMonth] || 0)}
                                </TableCell>
                            </TableRow>
                          ))}
                        </Fragment>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
