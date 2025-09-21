
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
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { customers, products, employees, pastSalesDetails, salesTargetData as initialSalesTargetData } from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';

type TargetProduct = {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
};

type CustomerTarget = {
    customerCode: string;
    customerName: string;
    targetProducts: TargetProduct[];
    totalTarget: number;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useAuth();
  const role = auth?.role;

  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>('9');
  const [customerTargets, setCustomerTargets] = useState<CustomerTarget[]>([]);

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
  
  const activeCustomers = useMemo(() => {
    const customerCodesWithPastSales = new Set(pastSalesDetails.map(detail => detail.customerCode));
    return customers.filter(c => customerCodesWithPastSales.has(c.value));
  }, []);

  useEffect(() => {
    // Initialize targets for active customers
    setCustomerTargets(activeCustomers.map(c => ({
        customerCode: c.value,
        customerName: c.label,
        targetProducts: [],
        totalTarget: 0,
    })));
  }, [activeCustomers]);


  const handleAddProduct = (customerCode: string, product: typeof products[0]) => {
    setCustomerTargets(prevTargets => prevTargets.map(ct => {
        if (ct.customerCode === customerCode) {
            const newProduct: TargetProduct = {
                productId: product.value,
                productName: product.label,
                quantity: 1,
                price: product.basePrice,
                total: product.basePrice,
            };
            const updatedProducts = [...ct.targetProducts, newProduct];
            const newTotal = updatedProducts.reduce((sum, p) => sum + p.total, 0);
            return { ...ct, targetProducts: updatedProducts, totalTarget: newTotal };
        }
        return ct;
    }));
  };

  const handleQuantityChange = (customerCode: string, productId: string, quantity: number) => {
    setCustomerTargets(prevTargets => prevTargets.map(ct => {
        if (ct.customerCode === customerCode) {
            const updatedProducts = ct.targetProducts.map(p => {
                if (p.productId === productId) {
                    return { ...p, quantity: quantity, total: p.price * quantity };
                }
                return p;
            });
            const newTotal = updatedProducts.reduce((sum, p) => sum + p.total, 0);
            return { ...ct, targetProducts: updatedProducts, totalTarget: newTotal };
        }
        return ct;
    }));
  };
  
  const handleRemoveProduct = (customerCode: string, productId: string) => {
    setCustomerTargets(prevTargets => prevTargets.map(ct => {
        if (ct.customerCode === customerCode) {
            const updatedProducts = ct.targetProducts.filter(p => p.productId !== productId);
            const newTotal = updatedProducts.reduce((sum, p) => sum + p.total, 0);
            return { ...ct, targetProducts: updatedProducts, totalTarget: newTotal };
        }
        return ct;
    }));
  };
  
  const grandTotal = useMemo(() => {
    return customerTargets.reduce((sum, ct) => sum + ct.totalTarget, 0);
  }, [customerTargets]);

  const handleSubmitTargets = () => {
    toast({
        title: "Targets Submitted",
        description: `Total target of ${formatCurrency(grandTotal)} has been submitted for approval.`
    })
    router.push(role === 'admin' ? '/dashboard' : '/admin');
  }

  if (!role) {
    return null;
  }
  
  const availableYears = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));
  const availableMonths = Array.from({length: 12}, (_, i) => String(i + 1));


  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>월간 매출 목표 설정</CardTitle>
              <CardDescription>
                고객별 과거 3개월 매출 실적을 참고하여 이번 달 매출 목표를 설정합니다.
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
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                  </Button>
                  <Button onClick={handleSubmitTargets}>Submit All Targets</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Customer</TableHead>
                    <TableHead>June Sales</TableHead>
                    <TableHead>July Sales</TableHead>
                    <TableHead>August Sales</TableHead>
                    <TableHead className="w-[450px]">September Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCustomers.map(customer => {
                    const customerPastSales = pastSalesDetails.find(d => d.customerCode === customer.value);
                    const customerTarget = customerTargets.find(ct => ct.customerCode === customer.value);
                    
                    return (
                      <TableRow key={customer.value} className="align-top">
                        <TableCell className="font-medium">{customer.label}</TableCell>
                        
                        {[6, 7, 8].map(month => (
                          <TableCell key={month}>
                            {customerPastSales && customerPastSales.sales[month] ? (
                                <div className='space-y-2'>
                                {customerPastSales.sales[month].products.map(p => (
                                    <div key={p.productId} className="text-xs">
                                        <div>{p.productName}</div>
                                        <div className="text-muted-foreground">Qty: {p.quantity}, Total: {formatCurrency(p.total)}</div>
                                    </div>
                                ))}
                                <p className="font-semibold text-xs mt-1 border-t pt-1">Month Total: {formatCurrency(customerPastSales.sales[month].total)}</p>
                                </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No sales</span>
                            )}
                          </TableCell>
                        ))}

                        <TableCell>
                          {customerTarget && (
                            <div className='space-y-2'>
                                {customerTarget.targetProducts.map(tp => (
                                    <div key={tp.productId} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{tp.productName}</p>
                                            <p className="text-xs text-muted-foreground">{formatCurrency(tp.price)}/unit</p>
                                        </div>
                                        <Input 
                                            type="number" 
                                            value={tp.quantity}
                                            onChange={(e) => handleQuantityChange(customer.value, tp.productId, parseInt(e.target.value) || 0)}
                                            className="h-8 w-16"
                                            min="0"
                                        />
                                        <p className="text-sm w-24 text-right">{formatCurrency(tp.total)}</p>
                                         <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => handleRemoveProduct(customer.value, tp.productId)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <ProductSelector onProductSelect={(product) => handleAddProduct(customer.value, product)} />
                                <p className="font-semibold text-sm mt-2 border-t pt-2 text-right">
                                    Target Total: {formatCurrency(customerTarget.totalTarget)}
                                </p>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold text-lg">Grand Total Target</TableCell>
                        <TableCell className="text-right font-bold text-lg">{formatCurrency(grandTotal)}</TableCell>
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

function ProductSelector({ onProductSelect }: { onProductSelect: (product: typeof products[0]) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                 <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                            {products.map((product) => (
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
    );
}

    