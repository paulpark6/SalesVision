
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { products as allProducts, pastSalesDetails } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';

type TargetProduct = {
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
};

type CustomerTarget = {
  [customerName: string]: TargetProduct[];
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [targetMonth, setTargetMonth] = useState<string>('9');
  const [customerTargets, setCustomerTargets] = useState<CustomerTarget>({});

  const loggedInEmployee = useMemo(() => {
    if (!auth?.name) return null;
    return auth.name;
  }, [auth]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredSalesDetails = useMemo(() => {
    if (!loggedInEmployee) return [];
    if (role === 'admin') return pastSalesDetails;
    return pastSalesDetails.filter(detail => detail.employeeName === loggedInEmployee);
  }, [loggedInEmployee, role]);

  const addProductToTarget = (customerName: string, product: typeof allProducts[0]) => {
    setCustomerTargets(prev => {
      const existingProducts = prev[customerName] || [];
      if (existingProducts.find(p => p.productCode === product.value)) {
        return prev; // Don't add duplicates
      }
      const newProduct: TargetProduct = {
        productCode: product.value,
        productName: product.label,
        price: product.basePrice,
        quantity: 1,
        total: product.basePrice
      };
      return { ...prev, [customerName]: [...existingProducts, newProduct] };
    });
  };
  
  const removeProductFromTarget = (customerName: string, productCode: string) => {
    setCustomerTargets(prev => {
        const updatedProducts = (prev[customerName] || []).filter(p => p.productCode !== productCode);
        return {...prev, [customerName]: updatedProducts};
    });
  };

  const handleQuantityChange = (customerName: string, productCode: string, quantity: number) => {
    setCustomerTargets(prev => {
      const updatedProducts = (prev[customerName] || []).map(p => {
        if (p.productCode === productCode) {
          return { ...p, quantity, total: p.price * quantity };
        }
        return p;
      });
      return { ...prev, [customerName]: updatedProducts };
    });
  };
  
  const getCustomerTargetTotal = (customerName: string) => {
    return (customerTargets[customerName] || []).reduce((sum, p) => sum + p.total, 0);
  };

  const grandTotal = useMemo(() => {
    return Object.values(customerTargets).flat().reduce((sum, p) => sum + p.total, 0);
  }, [customerTargets]);

  if (!role || !loggedInEmployee) {
    return null;
  }
  
  const currentYear = new Date().getFullYear();
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex items-center gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="month-select">대상 월</Label>
                  <Select value={targetMonth} onValueChange={setTargetMonth}>
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
              <Button type="button" variant="outline" onClick={handleCancel}>
                Back to Dashboard
              </Button>
              <Button>목표 저장</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별 판매 내역 및 목표 설정</CardTitle>
              <CardDescription>
                지난 3개월간의 고객별 판매 내역을 확인하고 이번 달의 판매 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">고객명</TableHead>
                    <TableHead>6월 실적</TableHead>
                    <TableHead>7월 실적</TableHead>
                    <TableHead>8월 실적</TableHead>
                    <TableHead className="w-[400px]">9월 목표</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalesDetails.map((detail) => (
                    <TableRow key={detail.customerName} className="align-top">
                      <TableCell className="font-medium">{detail.customerName}</TableCell>
                      {['June', 'July', 'August'].map(month => {
                        const monthSale = detail.sales.find(s => s.month === month);
                        return (
                          <TableCell key={month}>
                            {monthSale && monthSale.products.length > 0 ? (
                               <div className="text-xs space-y-1">
                                {monthSale.products.map(p => (
                                  <div key={p.productCode} className="flex justify-between">
                                    <span>{p.productName} ({p.quantity})</span>
                                    <span>{formatCurrency(p.totalAmount)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : '-'}
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {(customerTargets[detail.customerName] || []).map(target => (
                            <div key={target.productCode} className="flex items-center gap-2">
                                <span className="flex-1 truncate" title={target.productName}>{target.productName}</span>
                                <Input 
                                    type="number"
                                    value={target.quantity}
                                    onChange={(e) => handleQuantityChange(detail.customerName, target.productCode, parseInt(e.target.value) || 0)}
                                    className="h-8 w-16"
                                    min="0"
                                />
                                <span className="w-20 text-right text-sm">{formatCurrency(target.total)}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProductFromTarget(detail.customerName, target.productCode)}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                          ))}
                          <ProductSearchPopover onProductSelect={(product) => addProductToTarget(detail.customerName, product)} />
                          <div className="text-right font-semibold pr-8 pt-2 border-t mt-2">
                            {formatCurrency(getCustomerTargetTotal(detail.customerName))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold text-base">총 목표 금액</TableCell>
                        <TableCell className="text-right font-bold text-base">{formatCurrency(grandTotal)}</TableCell>
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


function ProductSearchPopover({ onProductSelect }: { onProductSelect: (product: typeof allProducts[0]) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start text-muted-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {allProducts.map((product) => (
                <CommandItem
                  key={product.value}
                  value={product.label}
                  onSelect={() => {
                    onProductSelect(product);
                    setOpen(false);
                  }}
                >
                  {product.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
