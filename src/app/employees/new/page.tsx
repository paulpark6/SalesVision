
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function NewEmployeePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    // Only managers should access this page
    if (!auth || auth.role !== 'manager') {
      router.push('/login');
    }
  }, [auth, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the form submission,
    // e.g., send data to your backend API to create a new employee.

    toast({
      title: 'Employee Registered',
      description: 'The new employee has been successfully registered.',
    });
    router.push('/admin'); // Redirect to manager dashboard
  };

  const handleCancel = () => {
    router.push('/admin');
  };
  
  // Render nothing or a loading spinner while checking auth
  if (!role || role !== 'manager') {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Register New Employee</CardTitle>
              <CardDescription>
                Enter the details for the new employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="e.g., EMP-004"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a secure password"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Register Employee</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
