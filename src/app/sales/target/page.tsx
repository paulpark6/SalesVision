
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { customers, products, employees, pastSalesDetails, salesTargetData as initialSalesTargetData } from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PlusCircle, X, ChevronDown, User } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TargetItem = {
  id: number;
  customerCode: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [targetItems, setTargetItems] = useState<TargetItem[]>([
    { id: 1, customerCode: '', productCode: '', quantity: 0, unitPrice: 0 }
  ]);
  const [nextId, setNextId] = useState(2);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role || !auth?.name) return null;
    return employees.find(e => e.name === auth.name);
  }, [auth]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const assignedCustomers = useMemo(() => {
    if (!loggedInEmployee || role === 'admin') return customers;
    return customers.filter(c => c.employee === loggedInEmployee.name);
  }, [loggedInEmployee, role]);

  const filteredPastSales = useMemo(() => {
    const assignedCustomerCodes = new Set(assignedCustomers.map(c => c.customerCode));
    return pastSalesDetails.filter(detail => assignedCustomerCodes.has(detail.customerCode));
  }, [assignedCustomers]);

  const pastMonthsData = useMemo(() => {
    const getMonthData = (month: number) => {
      return filteredPastSales
        .filter(d => d.month === month)
        .reduce((acc, sale) => {
          if (!acc[sale.customerCode]) {
            acc[sale.customerCode] = { customerName: sale.customerName, products: [] };
          }
          acc[sale.customerCode].products.push({
            productName: sale.productName,
            quantity: sale.quantity,
            totalSales: sale.totalSales
          });
          return acc;
        }, {} as Record<string, { customerName: string; products: { productName: string; quantity: number; totalSales: number }[] }>);
    };

    const targetMonth = selectedMonth;
    const m1 = (targetMonth - 2 + 12) % 12 || 12;
    const m2 = (targetMonth - 3 + 12) % 12 || 12;
    const m3 = (targetMonth - 4 + 12) % 12 || 12;
    
    return {
      [m1]: getMonthData(m1),
      [m2]: getMonthData(m2),
      [m3]: getMonthData(m3),
    };
  }, [selectedMonth, filteredPastSales]);
  
  const months = useMemo(() => {
     const targetMonth = selectedMonth;
     const m1 = (targetMonth - 2 + 12) % 12 || 12;
     const m2 = (targetMonth - 3 + 12) % 12 || 12;
     const m3 = (targetMonth - 4 + 12) % 12 || 12;
     return [m3, m2, m1].sort((a,b) => a-b);
  }, [selectedMonth]);


  const handleAddItem = () => {
    setTargetItems([
      ...targetItems,
      { id: nextId, customerCode: '', productCode: '', quantity: 0, unitPrice: 0 }
    ]);
    setNextId(nextId + 1);
  };

  const handleRemoveItem = (id: number) => {
    setTargetItems(targetItems.filter(item => item.id !== id));
  };

  const handleItemChange = <K extends keyof TargetItem>(id: number, field: K, value: TargetItem[K]) => {
    setTargetItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'productCode') {
            const product = products.find(p => p.value === value);
            updatedItem.unitPrice = product?.basePrice || 0;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  const totalTargetAmount = useMemo(() => {
    return targetItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }, [targetItems]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Targets Submitted',
      description: `Targets for ${selectedMonth}월 have been set successfully.`,
    });
  };

  if (!role) {
    return null;
  }
  
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>조회 월 선택</CardTitle>
              <CardDescription>
                목표를 설정하거나 지난 실적을 조회할 월을 선택하세요.
              </CardDescription>
               <div className="flex items-end gap-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="month-select">Month</Label>
                  <Select
                    value={String(selectedMonth)}
                    onValueChange={(value) => setSelectedMonth(Number(value))}
                  >
                    <SelectTrigger id="month-select" className="w-[180px]">
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
            </CardHeader>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle>담당 고객 목록</CardTitle>
                <CardDescription>현재 담당하고 있는 고객 리스트입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assignedCustomers.map(customer => (
                    <Card key={customer.customerCode} className="p-4">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold">{customer.customerName}</p>
                                <p className="text-sm text-muted-foreground">{customer.customerCode}</p>
                                <Badge variant="outline" className="mt-2">{customer.customerGrade} 등급</Badge>
                            </div>
                        </div>
                    </Card>
                ))}
            </CardContent>
          </Card>


          <Collapsible>
            <CollapsibleTrigger asChild>
                <Card className='cursor-pointer hover:bg-muted/50'>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>지난 3개월 실적 상세</CardTitle>
                                <CardDescription>지난 3개월간의 고객별, 제품별 판매 실적입니다. 클릭하여 확인하세요.</CardDescription>
                            </div>
                            <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </div>
                    </CardHeader>
                </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Card className="border-t-0 rounded-t-none">
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[200px]'>고객명</TableHead>
                                    {months.map(m => (
                                        <TableHead key={m} className='text-center'>{m}월</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedCustomers.map(customer => (
                                    <TableRow key={customer.customerCode}>
                                        <TableCell className="font-semibold">{customer.customerName}</TableCell>
                                        {months.map(month => (
                                            <TableCell key={`${customer.customerCode}-${month}`}>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>제품</TableHead>
                                                            <TableHead className='text-right'>수량</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                    {(pastMonthsData[month as keyof typeof pastMonthsData][customer.customerCode]?.products.length > 0) ? (
                                                        pastMonthsData[month as keyof typeof pastMonthsData][customer.customerCode].products.map(p => (
                                                            <TableRow key={p.productName}>
                                                                <TableCell>{p.productName}</TableCell>
                                                                <TableCell className='text-right'>{p.quantity}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={2} className="text-center h-16 text-muted-foreground">실적 없음</TableCell>
                                                        </TableRow>
                                                    )}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </CollapsibleContent>
          </Collapsible>

          <Card>
            <CardHeader>
              <CardTitle>Set Monthly Target for {selectedMonth}월</CardTitle>
              <CardDescription>
                Add products and quantities for each customer to set their monthly sales target. The total amount will be calculated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Customer</TableHead>
                        <TableHead className="w-[250px]">Product</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="w-[100px]">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {targetItems.map(item => {
                         const product = products.find(p => p.value === item.productCode);
                         const customer = customers.find(c => c.value === item.customerCode);
                         const total = item.quantity * item.unitPrice;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                                <Combobox
                                    items={assignedCustomers.map(c => ({value: c.customerCode, label: c.customerName}))}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search customer..."
                                    noResultsMessage="No customer found"
                                    value={customer?.label || ''}
                                    onValueChange={(val) => {
                                        const selected = customers.find(c => c.label.toLowerCase() === val.toLowerCase());
                                        handleItemChange(item.id, 'customerCode', selected?.value || '');
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Combobox
                                    items={products}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search product..."
                                    noResultsMessage="No product found"
                                    value={product?.label || ''}
                                    onValueChange={(val) => {
                                        const selected = products.find(p => p.label.toLowerCase() === val.toLowerCase());
                                        handleItemChange(item.id, 'productCode', selected?.value || '');
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                readOnly
                                className="bg-muted"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                min="0"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${total.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {targetItems.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold">Total Target Amount</TableCell>
                            <TableCell className="text-right font-bold text-lg">${totalTargetAmount.toLocaleString()}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                  </Table>
                  <Button type="button" variant="outline" onClick={handleAddItem} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">Submit Targets</Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    