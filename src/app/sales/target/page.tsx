
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { customers, products, employees, pastSalesDetails, monthNames } from '@/lib/mock-data';
import type { SalesTarget } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

type TargetLineItem = {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

type CustomerTarget = {
  customerId: string;
  customerName: string;
  targetItems: TargetLineItem[];
  totalTarget: number;
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [customerTargets, setCustomerTargets] = useState<CustomerTarget[]>([]);
  const [targetMonth, setTargetMonth] = useState(monthNames.current);
  
  const loggedInEmployee = useMemo(() => {
    if (!auth?.role || !auth?.name) return null;
    return employees.find(e => e.name === auth.name);
  }, [auth]);

  // Initialize targets based on past sales data and logged-in employee
  useEffect(() => {
    if (loggedInEmployee) {
      const assignedCustomers = customers
        .filter(c => {
          const customerInSales = pastSalesDetails.find(ps => ps.customerId === c.value);
          const assignedToEmployee = c.label === 'Tech Solutions Inc.' || c.label === 'Retail Innovations'; // Simplified logic for Jane Smith
          if (loggedInEmployee.name === 'Alex Ray') {
              return c.label === 'Creative Designs LLC';
          }
          if(loggedInEmployee.name === 'John Doe') {
              return c.label === 'Global Exports';
          }
          return customerInSales && assignedToEmployee;
        })
        .map(c => ({
          customerId: c.value,
          customerName: c.label,
          targetItems: [],
          totalTarget: 0,
        }));
      setCustomerTargets(assignedCustomers);
    }
  }, [loggedInEmployee]);


  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const updateCustomerTarget = (customerId: string, updatedItems: TargetLineItem[]) => {
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    setCustomerTargets(prevTargets => 
      prevTargets.map(ct => 
        ct.customerId === customerId 
        ? { ...ct, targetItems: updatedItems, totalTarget: newTotal }
        : ct
      )
    );
  };

  const addTargetItem = (customerId: string) => {
    const customerTarget = customerTargets.find(ct => ct.customerId === customerId);
    if (!customerTarget) return;

    const newItem: TargetLineItem = {
      id: Date.now(),
      productId: '',
      productName: '',
      quantity: 0,
      price: 0,
      total: 0,
    };
    const updatedItems = [...customerTarget.targetItems, newItem];
    updateCustomerTarget(customerId, updatedItems);
  };
  
  const removeTargetItem = (customerId: string, itemId: number) => {
    const customerTarget = customerTargets.find(ct => ct.customerId === customerId);
    if (!customerTarget) return;
    const updatedItems = customerTarget.targetItems.filter(item => item.id !== itemId);
    updateCustomerTarget(customerId, updatedItems);
  };

  const handleItemChange = (customerId: string, itemId: number, field: keyof TargetLineItem, value: any) => {
    const customerTarget = customerTargets.find(ct => ct.customerId === customerId);
    if (!customerTarget) return;

    const updatedItems = customerTarget.targetItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        if (field === 'productName') {
          const product = products.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
          if (product) {
            updatedItem.productId = product.value;
            updatedItem.price = product.basePrice;
          } else {
            updatedItem.productId = '';
            updatedItem.price = 0;
          }
        }
        
        updatedItem.total = updatedItem.quantity * updatedItem.price;
        return updatedItem;
      }
      return item;
    });
    updateCustomerTarget(customerId, updatedItems);
  };

  const grandTotal = useMemo(() => {
    return customerTargets.reduce((sum, ct) => sum + ct.totalTarget, 0);
  }, [customerTargets]);

  const handleSubmit = () => {
    toast({
      title: 'Targets Submitted',
      description: 'Your sales targets for the month have been saved.',
    });
    handleBack();
  };

  if (!role || !loggedInEmployee) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Set Sales Targets for {targetMonth}</h1>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
                <Button type="button" onClick={handleSubmit}>
                    Save Targets
                </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Performance & Target Setting</CardTitle>
              <CardDescription>
                Review past 3 months' sales and set targets for {targetMonth}. Add products and quantities for each customer.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[15%]">Customer</TableHead>
                            <TableHead className="w-[20%]">{monthNames.prev3} Sales</TableHead>
                            <TableHead className="w-[20%]">{monthNames.prev2} Sales</TableHead>
                            <TableHead className="w-[20%]">{monthNames.prev1} Sales</TableHead>
                            <TableHead className="w-[25%]">{targetMonth} Target</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customerTargets.map(({ customerId, customerName, targetItems, totalTarget }) => {
                            const pastSales = pastSalesDetails.find(ps => ps.customerId === customerId);
                            return (
                                <TableRow key={customerId} className="align-top">
                                    <TableCell className="font-medium">{customerName}</TableCell>
                                    {[monthNames.prev3, monthNames.prev2, monthNames.prev1].map(month => {
                                        const monthSales = pastSales?.sales.find(s => s.month === month);
                                        const monthTotal = monthSales?.sales.reduce((sum, s) => sum + s.total, 0) || 0;
                                        return (
                                            <TableCell key={month}>
                                                {monthSales && monthSales.sales.length > 0 ? (
                                                    <>
                                                        <ul className="text-xs space-y-1">
                                                            {monthSales.sales.map(sale => (
                                                                <li key={sale.productId}>
                                                                    {sale.productName}: {sale.quantity} units ({formatCurrency(sale.total)})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p className="font-bold text-xs mt-2 pt-2 border-t">Total: {formatCurrency(monthTotal)}</p>
                                                    </>
                                                ) : <span className="text-xs text-muted-foreground">No sales</span>}
                                            </TableCell>
                                        )
                                    })}
                                    <TableCell>
                                        <div className="space-y-2">
                                            {targetItems.map(item => (
                                                <div key={item.id} className="flex items-center gap-2">
                                                     <div className="flex-1">
                                                        <Combobox
                                                            items={products}
                                                            placeholder="Select product..."
                                                            searchPlaceholder="Search..."
                                                            noResultsMessage="No product found."
                                                            value={item.productName}
                                                            onValueChange={(value) => handleItemChange(customerId, item.id, 'productName', value)}
                                                        />
                                                     </div>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Qty" 
                                                        value={item.quantity || ''}
                                                        onChange={(e) => handleItemChange(customerId, item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-16 h-9"
                                                    />
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeTargetItem(customerId, item.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => addTargetItem(customerId)}>
                                                <PlusCircle className="mr-2 h-4 w-4"/> Add Product
                                            </Button>
                                            <p className="font-bold text-sm mt-2 pt-2 border-t">
                                                Target Total: {formatCurrency(totalTarget)}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold text-lg">Grand Total</TableCell>
                            <TableCell className="font-bold text-lg">{formatCurrency(grandTotal)}</TableCell>
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
