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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (auth === undefined) return;
    
    // An admin can be an "admin" or an "owner". Owners can see everything.
    if (!auth || !['admin', 'owner'].includes(auth.role)) {
      router.push('/login');
    }
  }, [auth, router]);
  
  // Render nothing or a loading spinner while checking auth
  if (!role || !['admin', 'owner'].includes(role)) {
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
                <h1 className="text-2xl font-semibold">Admin Dashboard (My Sales)</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/sales/new">Add Sale</Link>
                    </Button>
                     {role === 'owner' && (
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Back to Owner View</Link>
                        </Button>
                    )}
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
