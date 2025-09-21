
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { products, employees, pastSalesDetails } from '@/lib/mock-data';
import type { PastSalesDetail, PastSaleProduct, Product } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

type TargetProduct = {
  id: string; // unique id for list key
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

type CustomerTarget = {
  customerId: string;
  products: TargetProduct[];
};

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

  const [targetMonth, setTargetMonth] = useState(9); // September
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [customerTargets, setCustomerTargets] = useState<Record<string, CustomerTarget>>({});

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.name) return null;
    return employees.find(e => e.name === auth.name);
  }, [auth]);

  const filteredSalesDetails = useMemo(() => {
    if (!loggedInEmployee) return [];
    if (loggedInEmployee.role === 'admin' || loggedInEmployee.role === 'manager') {
        // Managers and Admins can see all data
        return pastSalesDetails;
    }
    return pastSalesDetails.filter(detail => detail.employeeName === loggedInEmployee.name);
  }, [loggedInEmployee]);

  const handleAddProduct = (customerId: string) => {
    setCustomerTargets(prev => {
        const newProduct: TargetProduct = {
            id: crypto.randomUUID(),
            productId: '',
            productName: '',
            quantity: 0,
            price: 0
        };
        const currentProducts = prev[customerId]?.products || [];
        return {
            ...prev,
            [customerId]: {
                customerId,
                products: [...currentProducts, newProduct]
            }
        };
    });
  };

  const handleRemoveProduct = (customerId: string, productId: string) => {
      setCustomerTargets(prev => {
          const newProducts = prev[customerId].products.filter(p => p.id !== productId);
          return {
              ...prev,
              [customerId]: {
                  ...prev[customerId],
                  products: newProducts
              }
          };
      });
  };

  const handleProductChange = (customerId: string, targetProductId: string, newProductValue: string) => {
      const selectedProduct = products.find(p => p.label.toLowerCase() === newProductValue.toLowerCase());
      if (selectedProduct) {
          setCustomerTargets(prev => {
              const newProducts = prev[customerId].products.map(p => {
                  if (p.id === targetProductId) {
                      return {
                          ...p,
                          productId: selectedProduct.value,
                          productName: selectedProduct.label,
                          price: selectedProduct.basePrice
                      };
                  }
                  return p;
              });
              return { ...prev, [customerId]: { ...prev[customerId], products: newProducts } };
          });
      }
  };

  const handleQuantityChange = (customerId: string, targetProductId: string, quantity: number) => {
    setCustomerTargets(prev => {
        const newProducts = prev[customerId].products.map(p => {
            if (p.id === targetProductId) {
                return { ...p, quantity: quantity < 0 ? 0 : quantity };
            }
            return p;
        });
        return { ...prev, [customerId]: { ...prev[customerId], products: newProducts } };
    });
  };

  const getCustomerTargetTotal = (customerId: string) => {
      const target = customerTargets[customerId];
      if (!target) return 0;
      return target.products.reduce((total, p) => total + (p.quantity * p.price), 0);
  };
  
  const grandTotal = useMemo(() => {
      return Object.keys(customerTargets).reduce((total, customerId) => {
          return total + getCustomerTargetTotal(customerId);
      }, 0);
  }, [customerTargets]);

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleSubmitTargets = () => {
    // Logic to save the targets
    toast({
        title: "Targets Submitted",
        description: `Total target of ${formatCurrency(grandTotal)} for ${Object.keys(customerTargets).length} customers submitted for approval.`
    })
    router.push('/admin');
  };

  if (!role) {
    return null;
  }
  
  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const pastMonths = [targetMonth - 3, targetMonth - 2, targetMonth - 1].map(m => m <= 0 ? m + 12 : m);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">월간 매출 목표 설정</h1>
                 <Button type="button" variant="outline" onClick={handleCancel}>
                    Back to Dashboard
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>고객별 매출 목표 설정 ({targetYear}년 {targetMonth}월)</CardTitle>
                    <CardDescription>
                        지난 3개월간의 고객별 판매 실적을 확인하고 이번 달 목표를 설정합니다. 제품명과 수량을 입력하면 총액이 자동 계산됩니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px]">고객명</TableHead>
                                {pastMonths.map(month => (
                                    <TableHead key={month} className="min-w-[250px]">{monthNames[month]} 실적</TableHead>
                                ))}
                                <TableHead className="min-w-[400px]">{monthNames[targetMonth]} 목표</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSalesDetails.map((customer) => (
                                <TableRow key={customer.customerId} className="align-top">
                                    <TableCell className="font-medium">{customer.customerName}</TableCell>
                                    {pastMonths.map(month => {
                                        const monthSales = customer.monthlySales.find(ms => ms.month === month);
                                        return (
                                            <TableCell key={month}>
                                                {monthSales && monthSales.products.length > 0 ? (
                                                    <div className="space-y-1 text-xs">
                                                        {monthSales.products.map(p => (
                                                            <div key={p.productId} className="flex justify-between">
                                                                <span className="truncate pr-2">{p.productName}</span>
                                                                <span className="font-mono whitespace-nowrap">{p.quantity}개 / {formatCurrency(p.sales)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-xs text-muted-foreground">매출 없음</span>}
                                            </TableCell>
                                        )
                                    })}
                                    <TableCell>
                                        <div className="space-y-2">
                                            {(customerTargets[customer.customerId]?.products || []).map((targetProduct) => (
                                                 <div key={targetProduct.id} className="flex items-center gap-2">
                                                     <div className="w-1/2">
                                                        <Combobox
                                                            items={products}
                                                            placeholder="제품 선택..."
                                                            searchPlaceholder="제품 검색..."
                                                            noResultsMessage="제품을 찾을 수 없습니다."
                                                            value={targetProduct.productName}
                                                            onValueChange={(value) => handleProductChange(customer.customerId, targetProduct.id, value)}
                                                        />
                                                     </div>
                                                     <Input 
                                                        type="number" 
                                                        placeholder="수량" 
                                                        className="h-9 w-20"
                                                        value={targetProduct.quantity}
                                                        onChange={(e) => handleQuantityChange(customer.customerId, targetProduct.id, parseInt(e.target.value, 10))}
                                                    />
                                                    <span className="w-24 font-mono text-sm text-right">{formatCurrency(targetProduct.quantity * targetProduct.price)}</span>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveProduct(customer.customerId, targetProduct.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                 </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.customerId)}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                제품 추가
                                            </Button>
                                             <div className="text-right font-bold pr-12 pt-2">
                                                <span>Total: {formatCurrency(getCustomerTargetTotal(customer.customerId))}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold text-lg">총 목표 합계</TableCell>
                                <TableCell className="text-right font-bold text-lg pr-12">{formatCurrency(grandTotal)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex justify-end gap-2 pt-6">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSubmitTargets}>목표 제출</Button>
                    </div>
                </CardContent>
            </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
