
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { products } from '@/lib/mock-data';

// Mock inventory data - in a real app, this would come from a database
const inventoryData = products.map(product => ({
  ...product,
  stock: Math.floor(Math.random() * 150),
  reorderLevel: 20,
}));

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

const getStatus = (stock: number, reorderLevel: number): InventoryStatus => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= reorderLevel) return 'Low Stock';
  return 'In Stock';
};

const getStatusVariant = (status: InventoryStatus): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'In Stock':
      return 'default';
    case 'Low Stock':
      return 'secondary';
    case 'Out of Stock':
      return 'destructive';
  }
};


export default function InventoryPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

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

  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null; // or a loading component
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Inventory Status</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
              <CardDescription>
                Monitor the inventory levels for all products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => {
                    const status = getStatus(item.stock, item.reorderLevel);
                    return (
                        <TableRow key={item.value}>
                            <TableCell className="font-medium">{item.value.toUpperCase()}</TableCell>
                            <TableCell>{item.label}</TableCell>
                            <TableCell className="text-right font-semibold">{item.stock}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getStatusVariant(status)}>
                                    {status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

