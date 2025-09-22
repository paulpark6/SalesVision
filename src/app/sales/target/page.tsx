
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
  TableFooter,
} from '@/components/ui/table';
import { salesTargetManagementData, employees, customers, products as allProducts } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';


type ProductTarget = {
    id: string;
    productCode: string;
    productName: string;
    categoryCode?: string;
    pastSales: { [month: number]: number };
    monthlyTarget: { [month: number]: number };
    monthlyActual: { [month: number]: number };
};

type CustomerTarget = {
    id: string;
    employeeId: string;
    employeeName: string;
    customerCode: string;
    customerName: string;
    products: ProductTarget[];
};

const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [targets, setTargets] = useState<CustomerTarget[]>(salesTargetManagementData);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

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
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  const employeeSummary = useMemo(() => {
    const summary: { [key: string]: { name: string; target: number; actual: number } } = {};
    employees.forEach(e => {
        if (e.role !== 'admin') {
            summary[e.value] = { name: e.name, target: 0, actual: 0 };
        }
    });

    targets.forEach(item => {
      if (summary[item.employeeId]) {
        item.products.forEach(p => {
          if (p.monthlyTarget) {
            summary[item.employeeId].target += p.monthlyTarget[selectedMonth + 1] || 0;
          }
          if (p.monthlyActual) {
            summary[item.employeeId].actual += p.monthlyActual[selectedMonth + 1] || 0;
          }
        });
      }
    });

    return Object.values(summary);

  }, [targets, selectedMonth]);


  const filteredTargets = useMemo(() => {
    if (selectedEmployee === 'all') {
      return targets;
    }
    return targets.filter(d => d.employeeId === selectedEmployee);
  }, [selectedEmployee, targets]);

  const handleTargetChange = (customerIndex: number, productIndex: number, month: number, value: number) => {
    const newTargets = [...targets];
    const customerTarget = newTargets.find(t => t.id === filteredTargets[customerIndex].id);
    if(customerTarget){
        const product = customerTarget.products[productIndex];
        product.monthlyTarget[month] = value;
        setTargets(newTargets);
    }
  };

  const addCustomer = () => {
    const newCustomer: CustomerTarget = {
        id: uuidv4(),
        employeeId: selectedEmployee !== 'all' ? selectedEmployee : '',
        employeeName: selectedEmployee !== 'all' ? employees.find(e => e.value === selectedEmployee)?.name || '' : '',
        customerCode: '',
        customerName: '신규 고객',
        products: [],
    };
    setTargets([...targets, newCustomer]);
  };
  
  const handleCustomerChange = (targetId: string, field: 'customerName' | 'employeeId', value: string) => {
      setTargets(prevTargets => prevTargets.map(t => {
          if (t.id === targetId) {
              if(field === 'customerName') {
                  const existingCustomer = customers.find(c => c.label.toLowerCase() === value.toLowerCase());
                  return {
                      ...t,
                      customerName: value,
                      customerCode: existingCustomer?.value || '신규'
                  };
              }
              if(field === 'employeeId') {
                  const employee = employees.find(e => e.value === value);
                  return {
                      ...t,
                      employeeId: value,
                      employeeName: employee?.name || ''
                  }
              }
          }
          return t;
      }))
  }


  const deleteCustomer = (targetId: string) => {
    setTargets(targets.filter(t => t.id !== targetId));
  };

  const addProductToCustomer = (targetId: string) => {
    const newProduct: ProductTarget = {
        id: uuidv4(),
        productCode: '',
        productName: '신규 제품',
        pastSales: { 6: 0, 7: 0, 8: 0 },
        monthlyTarget: {},
        monthlyActual: {}
    };
    
    setTargets(prevTargets => prevTargets.map(t => 
        t.id === targetId 
            ? { ...t, products: [...t.products, newProduct] }
            : t
    ));
  };
  
  const handleProductChange = (targetId: string, productId: string, value: string) => {
      setTargets(prevTargets => prevTargets.map(t => {
          if (t.id === targetId) {
              return {
                  ...t,
                  products: t.products.map(p => {
                      if (p.id === productId) {
                          const existingProduct = allProducts.find(ap => ap.label.toLowerCase() === value.toLowerCase());
                          return {
                              ...p,
                              productName: value,
                              productCode: existingProduct?.value || '신규'
                          }
                      }
                      return p;
                  })
              }
          }
          return t;
      }));
  };

  const deleteProductFromCustomer = (targetId: string, productId: string) => {
    setTargets(prevTargets => prevTargets.map(t => 
        t.id === targetId 
            ? { ...t, products: t.products.filter(p => p.id !== productId) }
            : t
    ));
  };

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
            <h1 className="text-2xl font-semibold">고객별/제품별 월간 매출 목표 관리</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>매출 목표 설정</CardTitle>
              <CardDescription>
                직원 및 월을 선택하여 고객별/제품별 매출 목표를 설정하거나 수정합니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employee-select">담당자</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                        <SelectTrigger id="employee-select" className="w-[180px]">
                            <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            {employees.filter(e => e.role !== 'admin').map(e => (
                                <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="month-select">목표 월</Label>
                    <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                        <SelectTrigger id="month-select" className="w-[120px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthNames.map((name, index) => (
                                <SelectItem key={index} value={String(index)}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
                {selectedEmployee === 'all' && (
                    <Card className="mb-8">
                        <CardHeader>
                             <CardTitle>팀원별 {monthNames[selectedMonth]} 목표 달성 현황</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>담당자</TableHead>
                                        <TableHead className="text-right">매출 목표</TableHead>
                                        <TableHead className="text-right">매출 실적</TableHead>
                                        <TableHead className="w-[200px]">달성률</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employeeSummary.map(emp => {
                                        const achievementRate = emp.target > 0 ? (emp.actual / emp.target) * 100 : (emp.actual > 0 ? 100 : 0);
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
                        </CardContent>
                    </Card>
                )}

              <Table>
                <TableHeader>
                  <TableRow>
                    { (role === 'admin' || (role === 'manager' && selectedEmployee === 'all')) && <TableHead className='w-[150px]'>담당자</TableHead> }
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right w-[100px]">6월</TableHead>
                    <TableHead className="text-right w-[100px]">7월</TableHead>
                    <TableHead className="text-right w-[100px]">8월</TableHead>
                    <TableHead className="text-right w-[150px]">목표 ({monthNames[selectedMonth]})</TableHead>
                    <TableHead className="text-right w-[150px]">실적 ({monthNames[selectedMonth]})</TableHead>
                    <TableHead className="w-[40px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target, cIndex) => (
                    <Fragment key={`${target.id}`}>
                      {target.products.map((product, pIndex) => (
                        <TableRow key={product.id}>
                          {pIndex === 0 && (
                            <>
                            { (role === 'admin' || (role === 'manager' && selectedEmployee === 'all')) && (
                                <TableCell rowSpan={target.products.length + 1}>
                                    <Select 
                                        value={target.employeeId} 
                                        onValueChange={(val) => handleCustomerChange(target.id, 'employeeId', val)}
                                        disabled={role !== 'admin' && selectedEmployee !== 'all'}
                                    >
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {employees.filter(e => e.role !== 'admin').map(e => (
                                                <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            )}
                            <TableCell rowSpan={target.products.length + 1}>
                                <Combobox
                                    items={customers}
                                    placeholder="고객 선택 또는 입력..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={target.customerName}
                                    onValueChange={(val) => handleCustomerChange(target.id, 'customerName', val)}
                                    onAddNew={(val) => handleCustomerChange(target.id, 'customerName', val)}
                                />
                                <div className="text-sm text-muted-foreground mt-1">{target.customerCode}</div>
                            </TableCell>
                            </>
                          )}
                          <TableCell>
                            <Combobox
                                items={allProducts}
                                placeholder="제품 선택 또는 입력..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productName}
                                onValueChange={(val) => handleProductChange(target.id, product.id, val)}
                                onAddNew={(val) => handleProductChange(target.id, product.id, val)}
                            />
                            <div className="text-sm text-muted-foreground mt-1">{product.productCode}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[6] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[7] || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.pastSales?.[8] || 0)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="h-8 text-right"
                              value={product.monthlyTarget[selectedMonth + 1] || ''}
                              onChange={(e) => handleTargetChange(cIndex, pIndex, selectedMonth + 1, Number(e.target.value))}
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.monthlyActual[selectedMonth + 1] || 0)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProductFromCustomer(target.id, product.id)}>
                                <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        {target.products.length === 0 && (
                             <>
                                { (role === 'admin' || (role === 'manager' && selectedEmployee === 'all')) && <TableCell>
                                     <Select 
                                        value={target.employeeId} 
                                        onValueChange={(val) => handleCustomerChange(target.id, 'employeeId', val)}
                                        disabled={role !== 'admin' && selectedEmployee !== 'all'}
                                    >
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {employees.filter(e => e.role !== 'admin').map(e => (
                                                <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell> }
                                <TableCell>
                                    <Combobox
                                        items={customers}
                                        placeholder="고객 선택 또는 입력..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
                                        value={target.customerName}
                                        onValueChange={(val) => handleCustomerChange(target.id, 'customerName', val)}
                                        onAddNew={(val) => handleCustomerChange(target.id, 'customerName', val)}
                                    />
                                    <div className="text-sm text-muted-foreground mt-1">{target.customerCode}</div>
                                </TableCell>
                                <TableCell colSpan={role === 'admin' || (role === 'manager' && selectedEmployee === 'all') ? 6 : 7}>
                                     <Button variant="outline" size="sm" onClick={() => addProductToCustomer(target.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCustomer(target.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </>
                        )}
                        {target.products.length > 0 && (
                            <>
                                <TableCell colSpan={5}>
                                     <Button variant="outline" size="sm" onClick={() => addProductToCustomer(target.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> 제품 추가
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCustomer(target.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </>
                        )}
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                      <TableCell colSpan={role === 'admin' || (role === 'manager' && selectedEmployee === 'all') ? 8 : 7}>
                          <Button variant="outline" onClick={addCustomer}>
                              <PlusCircle className="mr-2 h-4 w-4" /> 고객 추가
                          </Button>
                      </TableCell>
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
