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

export default function DashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (auth === undefined) return;

    // If user is not logged in or is not an owner, redirect to login.
    if (!auth || auth.role !== 'owner') {
      router.push('/login');
    }
  }, [auth, router]);

  // Render nothing or a loading spinner while checking auth
  if (!role || role !== 'owner') {
    return null; // or a loading component
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar role="owner" />
        <div className="flex flex-col sm:pl-14">
          <SidebarInset>
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
                  <div className="flex gap-2">
                      <Button asChild>
                          <Link href="/sales/new">Add Sale</Link>
                      </Button>
                      <Button asChild variant="outline">
                          <Link href="/admin">Go to Admin View</Link>
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
                  <SalesTrendAnalysisCard />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
