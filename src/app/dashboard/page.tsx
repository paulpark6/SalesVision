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
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would get the user's role from your auth context/session.
    // For simulation, we'll assume the 'owner' is accessing this page.
    // If we wanted to protect this route, we'd check the role here and redirect if not 'owner'.
    const simulatedRole = 'owner';
    setRole(simulatedRole);

    // This is a simple protection mechanism for this simulation.
    // An 'admin' who logs in is directed to /admin and should not see /dashboard.
    // If they try to navigate here, we could redirect them.
    // For now, we will just control UI elements.
  }, [router]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar role="owner" />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
