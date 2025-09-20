
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
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { employees } from '@/lib/mock-data';

export default function NewCustomerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [employee, setEmployee] = useState('');

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
        const loggedInEmployee = employees.find(e => e.role === auth.role);
        if (loggedInEmployee) {
            setEmployee(loggedInEmployee.value);
        }
    }
  }, [auth, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Customer Added',
      description: 'The new customer has been successfully registered.',
    });
    router.push('/customers'); 
  };
  
  const handleCancel = () => {
    router.push('/customers');
  };

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Add New Customer</h1>
              <Button type="button" variant="outline" onClick={handleCancel}>
                  Back to Customer List
              </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
              <CardDescription>Fill out the form to add a new customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium">Customer Information</legend>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input id="customerName" placeholder="e.g., Acme Inc." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerCode">Customer Code</Label>
                      <Input id="customerCode" placeholder="e.g., C-123" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerGrade">Grade</Label>
                      <Select name="customerGrade" required>
                        <SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerType">Type</Label>
                       <Select name="customerType" required>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="own">Own</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="employee">Assigned Employee</Label>
                        <Select name="employee" value={employee} onValueChange={setEmployee} required disabled={role === 'employee'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                  <SelectItem key={emp.value} value={emp.value}>
                                    {emp.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </fieldset>

                {/* Contact Point */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium">Contact Point</legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Name</Label>
                      <Input id="contactName" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPosition">Position</Label>
                      <Input id="contactPosition" placeholder="e.g., Purchasing Manager" required />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input id="contactPhone" type="tel" placeholder="e.g., 123-456-7890" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactAddress">Address</Label>
                      <Input id="contactAddress" placeholder="e.g., 123 Main St, Anytown" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email (Optional)</Label>
                      <Input id="contactEmail" type="email" placeholder="e.g., john.d@example.com" />
                    </div>
                  </div>
                </fieldset>
                
                {/* Company Overview */}
                <fieldset className="space-y-2">
                  <Label htmlFor="companyOverview" className="text-lg font-medium">Company Overview</Label>
                  <Textarea id="companyOverview" placeholder="Describe the customer's business..." />
                </fieldset>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button type="submit">Save Customer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
