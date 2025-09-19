'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function NewSalePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (auth === undefined) return;
    
    // Anyone logged in can record a sale. If not logged in, redirect.
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Sale Recorded',
      description: 'The new sale has been successfully recorded.',
    });
    // Redirect based on the user's role.
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath); 
  };
  
  const handleCancel = () => {
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath);
  };
  
  // Render nothing or a loading spinner while checking auth
  if (!role) {
    return null; // or a loading component
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar role={role} />
        <div className="flex flex-col sm:pl-14">
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-semibold">Record a New Sale</h1>
                <Button type="button" variant="outline" onClick={handleCancel}>
                    Back to Dashboard
                </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sale Details</CardTitle>
                <CardDescription>Fill out the form to add a new sale.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input id="productName" placeholder="e.g., Laptop, T-Shirt" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input id="customerName" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="e.g., 2" required min="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (per item)</Label>
                      <Input id="price" type="number" placeholder="e.g., 1200" required min="0" step="0.01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                       <Select name="paymentMethod" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="credit">Credit</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                                <SelectItem value="prepayment">Prepayment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="employee">Employee</Label>
                       <Select name="employee" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="emp-01">John Doe (Admin)</SelectItem>
                                <SelectItem value="emp-02">Jane Smith (Employee)</SelectItem>
                                <SelectItem value="emp-03">Peter Jones (Employee)</SelectItem>
                                <SelectItem value="emp-04">Alex Ray (Manager)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save Sale</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
