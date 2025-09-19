'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SalesTargetChart } from '@/components/dashboard/sales-target-chart';
import { DuePaymentsTable } from '@/components/dashboard/due-payments-table';
import { RecentSalesTable } from '@/components/dashboard/recent-sales-table';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    
    // Employees should only see this page.
    if (!auth || auth.role !== 'employee') {
      router.push('/login');
    }
  }, [auth, router]);
  
  if (!role || role !== 'employee') {
    return null;
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
                <h1 className="text-2xl font-semibold">Employee Dashboard (My Sales)</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/sales/new">Add Sale</Link>
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <OverviewCards />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <SalesTargetChart />
                <DuePaymentsTable />
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <RecentSalesTable />
              </div>
            </div>
          </main>
        </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
