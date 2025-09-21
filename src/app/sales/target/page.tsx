
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, Fragment } from 'react';
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
  TableFooter
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { salesTargetManagementData, employees, customers, products } from '@/lib/mock-data';
import type { CustomerTarget, ProductTarget } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';


const employeeOptions = employees.map(e => ({ value: e.value, label: e.name }));
const productOptions = products.map(p => ({ value: p.value, label: p.label }));


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targets, setTargets] = useState<CustomerTarget[]>(salesTargetManagementData);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const handleTargetChange = (customerIndex: number, productIndex: number, newTarget: number) => {
    const updatedTargets = [...targets];
    updatedTargets[customerIndex].products[productIndex].monthlyTarget[selectedMonth] = newTarget;
    setTargets(updatedTargets);
  };

  const handleAddCustomer = () => {
    const newCustomer: CustomerTarget = {
        customerCode: `NEW-${Date.now()}`,
        customerName: '',
        employeeId: selectedEmployee !== 'all' ? selectedEmployee : '',
        products: []
    };
    setTargets([...targets, newCustomer]);
  };

  const handleRemoveCustomer = (customerIndex: number) => {
    const updatedTargets = targets.filter((_, index) => index !== customerIndex);
    setTargets(updatedTargets);
    toast({ title: 'Customer Removed', description: 'The customer and their targets have been removed.' });
  };
  
  const handleCustomerChange = (customerIndex: number, field: 'customerName' | 'employeeId', value: string) => {
      const updatedTargets = [...targets];
      const customer = updatedTargets[customerIndex];
      
      if (field === 'customerName') {
          const existingCustomer = customers.find(c => c.label.toLowerCase() === value.toLowerCase());
          customer.customerName = existingCustomer?.label || value;
          customer.customerCode = existingCustomer?.value || `NEW-${Date.now()}`;
      } else {
          customer.employeeId = value;
      }
      setTargets(updatedTargets);
  };

  const handleAddProduct = (customerIndex: number) => {
    const newProduct: ProductTarget = {
        categoryCode: '',
        categoryName: '',
        productCode: '',
        productName: '',
        pastSales: {},
        monthlyTarget: {},
        monthlyActual: {}
    };
    const updatedTargets = [...targets];
    updatedTargets[customerIndex].products.push(newProduct);
    setTargets(updatedTargets);
  };
  
  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
      const updatedTargets = [...targets];
      updatedTargets[customerIndex].products.splice(productIndex, 1);
      setTargets(updatedTargets);
      toast({ title: 'Product Removed', description: 'The product has been removed from this customer\'s target list.'});
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, value: string) => {
      const updatedTargets = [...targets];
      const product = updatedTargets[customerIndex].products[productIndex];
      const selectedProduct = products.find(p => p.label.toLowerCase() === value.toLowerCase());

      if(selectedProduct) {
        product.productName = selectedProduct.label;
        product.productCode = selectedProduct.value;
        product.categoryCode = 'electronics'; // Placeholder
        product.categoryName = 'Electronics'; // Placeholder
      } else {
        product.productName = value;
        product.productCode = '';
      }
      setTargets(updatedTargets);
  };


  const employeeSummary = useMemo(() => {
    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    employees.forEach(emp => {
      summary[emp.value] = { name: emp.name, target: 0, actual: 0 };
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

    return Object.values(summary).filter(s => s.target > 0 || s.actual > 0);
  }, [targets, selectedMonth]);

  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(target => target.employeeId === selectedEmployee);
  }, [targets, selectedEmployee]);

  const grandTotalTarget = useMemo(() => {
    return filteredTargets.reduce((total, customer) => {
        return total + customer.products.reduce((subTotal, product) => {
            return subTotal + (product.monthlyTarget[selectedMonth] || 0);
        }, 0);
    }, 0);
  }, [filteredTargets, selectedMonth]);


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
            <h1 className="text-2xl font-semibold">월별 매출 목표 관리</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                월별, 직원별, 고객별, 제품별 매출 목표를 설정하고 관리합니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="month-select">월 선택</Label>
                  <Select value={String(selectedMonth)} onValueChange={(value) => setSelectedMonth(Number(value))}>
                    <SelectTrigger id="month-select" className="w-[120px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}월</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(role === 'admin' || role === 'manager') && (
                  <div className="grid gap-2">
                    <Label htmlFor="employee-select">직원 선택</Label>
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
            </CardHeader>
            <CardContent>
             {selectedEmployee === 'all' && (role === 'admin' || role === 'manager') && (
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
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
             )}

              <h3 className="text-lg font-semibold mb-2">고객별 제품 목표</h3>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">고객명</TableHead>
                      <TableHead className="w-[180px]">담당자</TableHead>
                      <TableHead className="w-[200px]">제품</TableHead>
                      <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                      <TableHead className="text-right w-[120px]">8월 실적</TableHead>
                      <TableHead className="text-right w-[150px]">{selectedMonth}월 목표</TableHead>
                      <TableHead className="text-right w-[150px]">{selectedMonth}월 실적</TableHead>
                      <TableHead className="w-[50px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTargets.map((target, cIndex) => (
                      <Fragment key={`${target.customerCode}-${cIndex}`}>
                        {target.products.map((product, pIndex) => (
                          <TableRow key={`${target.customerCode}-${product.productCode}-${pIndex}`}>
                            {pIndex === 0 && (
                              <TableCell rowSpan={target.products.length + 1} className="align-top pt-5">
                                 <Combobox
                                    items={customers.map(c => ({value: c.value, label: c.label}))}
                                    placeholder="Select or type customer"
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="Customer not found"
                                    value={target.customerName}
                                    onValueChange={(value) => handleCustomerChange(cIndex, 'customerName', value)}
                                    onAddNew={(newValue) => handleCustomerChange(cIndex, 'customerName', newValue)}
                                />
                              </TableCell>
                            )}
                             {pIndex === 0 && (
                               <TableCell rowSpan={target.products.length + 1} className="align-top pt-5">
                                 <Select
                                    value={target.employeeId}
                                    onValueChange={(value) => handleCustomerChange(cIndex, 'employeeId', value)}
                                    disabled={role !== 'admin' && role !== 'manager'}
                                 >
                                    <SelectTrigger>
                                        <SelectValue placeholder="담당자 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employeeOptions.map(emp => (
                                            <SelectItem key={emp.value} value={emp.value}>{emp.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                 </Select>
                               </TableCell>
                             )}
                            <TableCell>
                                <Combobox
                                    items={productOptions}
                                    placeholder="Select or type product"
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="Product not found"
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(cIndex, pIndex, value)}
                                    onAddNew={(value) => handleProductChange(cIndex, pIndex, value)}
                                />
                                <div className="text-sm text-muted-foreground">{product.productCode}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales?.[6] || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales?.[7] || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.pastSales?.[8] || 0)}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.monthlyTarget[selectedMonth] || ''}
                                onChange={(e) => handleTargetChange(cIndex, pIndex, parseFloat(e.target.value) || 0)}
                                className="h-8 text-right"
                                placeholder="0"
                              />
                            </TableCell>
                             <TableCell className="text-right">
                                {formatCurrency(product.monthlyActual[selectedMonth] || 0)}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(cIndex, pIndex)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                             <TableCell colSpan={7}>
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(cIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    제품 추가
                                </Button>
                            </TableCell>
                             <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCustomer(cIndex)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                  </TableBody>
                   <TableFooter>
                    <TableRow>
                        <TableCell colSpan={9} className="text-left">
                            <Button variant="outline" onClick={handleAddCustomer}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                고객 추가
                            </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="text-right font-bold text-base">Grand Total Target</TableCell>
                        <TableCell className="text-right font-bold text-base">{formatCurrency(grandTotalTarget)}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                   </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
