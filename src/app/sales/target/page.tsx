
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { customers, products, employees } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { MonthlyPerformanceChart } from '@/components/dashboard/monthly-performance-chart';
import { X } from 'lucide-react';

type TargetItem = {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  targetAmount: number;
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [targetMonth, setTargetMonth] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [targetItems, setTargetItems] = useState<TargetItem[]>([]);

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
  
  const productPrice = useMemo(() => {
    const product = products.find(p => p.value === selectedProduct);
    return product ? product.basePrice : 0;
  }, [selectedProduct]);

  const handleAddTarget = () => {
    if (!targetMonth || !selectedCustomer || !selectedProduct || quantity <= 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select a month, customer, product, and quantity.',
        variant: 'destructive',
      });
      return;
    }
    const customer = customers.find(c => c.value === selectedCustomer);
    const product = products.find(p => p.value === selectedProduct);

    if (customer && product) {
        const newItem: TargetItem = {
            id: Date.now(),
            customerName: customer.label,
            productName: product.label,
            quantity,
            targetAmount: quantity * product.basePrice
        };
        setTargetItems(prev => [...prev, newItem]);
        // Reset form
        setSelectedProduct('');
        setQuantity(1);
    }
  };
  
  const handleRemoveTarget = (id: number) => {
    setTargetItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleSaveTargets = () => {
    if (targetItems.length === 0) {
        toast({
            title: 'No Targets to Save',
            description: 'Please add at least one target.',
            variant: 'destructive'
        });
        return;
    }
    toast({
        title: 'Targets Saved',
        description: `Successfully saved ${targetItems.length} targets for ${targetMonth}.`
    });
    setTargetItems([]);
  };

  if (!role) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const nextThreeMonths = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i + 1);
    return {
      value: `${currentYear}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
  });


  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">매출 목표 설정 및 실적</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          
          <MonthlyPerformanceChart />

          <Card>
            <CardHeader>
              <CardTitle>월별 목표 설정</CardTitle>
              <CardDescription>
                고객별, 제품별 수량을 입력하여 월간 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border p-4 rounded-lg">
                     <div className="space-y-2">
                        <Label htmlFor="target-month">목표 월</Label>
                        <Select value={targetMonth} onValueChange={setTargetMonth}>
                            <SelectTrigger id="target-month"><SelectValue placeholder="Select Month" /></SelectTrigger>
                            <SelectContent>
                                {nextThreeMonths.map(m => <SelectItem key={m.value} value={m.label}>{m.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="customer">고객</Label>
                        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                            <SelectTrigger id="customer"><SelectValue placeholder="Select Customer" /></SelectTrigger>
                            <SelectContent>
                                {customers.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="product">제품</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger id="product"><SelectValue placeholder="Select Product" /></SelectTrigger>
                            <SelectContent>
                                {products.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="quantity">수량</Label>
                        <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                     </div>
                      <Button onClick={handleAddTarget} disabled={!targetMonth}>Add to Target</Button>
                </div>
            </CardContent>
          </Card>
          
          {targetItems.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Targets for {targetMonth}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Target Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {targetItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.customerName}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.targetAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTarget(item.id)}>
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-6">
                        <Button onClick={handleSaveTargets}>Save All Targets</Button>
                    </div>
                </CardContent>
            </Card>
          )}

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    