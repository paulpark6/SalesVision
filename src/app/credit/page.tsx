
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DuePaymentsTable } from '@/components/dashboard/due-payments-table';

export default function CreditManagementPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (!role || role !== 'admin') {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Credit Management</h1>
                 <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
              </Button>
            </div>
             <div className="grid gap-4 md:gap-8">
                <DuePaymentsTable />
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
