
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SalesTargetChart } from '@/components/dashboard/sales-target-chart';
import { DuePaymentsTable } from '@/components/dashboard/due-payments-table';
import { RecentSalesTable } from '@/components/dashboard/recent-sales-table';
import { SalesTrendAnalysisCard } from '@/components/dashboard/sales-trend-analysis-card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { EmployeeSalesTarget } from '@/components/dashboard/employee-sales-target';
import { EmployeeCreditSummary } from '@/components/dashboard/employee-credit-summary';

export default function DashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (auth === undefined) return;

    // If user is not logged in or is not an admin, redirect to login.
    if (!auth || auth.role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router]);

  // Render nothing or a loading spinner while checking auth
  if (!role || role !== 'admin') {
    return null; // or a loading component
  }

  return (
    <SidebarProvider>
        <AppSidebar role="admin" />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
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
                <EmployeeSalesTarget />
                <SalesTargetChart isTeamData={true} />
                <DuePaymentsTable />
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <RecentSalesTable />
                <EmployeeCreditSummary />
                <SalesTrendAnalysisCard />
              </div>
            </div>
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
