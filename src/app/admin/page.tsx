
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
import { EmployeeSalesTarget } from '@/components/dashboard/employee-sales-target';
import { CumulativeSalesTargetChart } from '@/components/dashboard/cumulative-sales-target-chart';
import { EmployeeCreditSummary } from '@/components/dashboard/employee-credit-summary';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Target } from 'lucide-react';
import { monthlySalesData } from '@/lib/mock-data';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    
    // Employees and managers should only see this page.
    if (!auth || (auth.role !== 'employee' && auth.role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router]);
  
  if (!role || (role !== 'employee' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{role === 'manager' ? 'Manager Dashboard' : 'My Sales Dashboard'}</h1>
                <div className="flex gap-2">
                    {role === 'manager' && (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/employees/new">Register Employee</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/purchases/new">Local Purchase</Link>
                            </Button>
                        </>
                    )}
                    <Button asChild>
                        <Link href="/sales/new">Add Sale</Link>
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {role === 'manager' && (
                    <OverviewCards />
                )}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                 {role === 'manager' && (
                    <>
                        <EmployeeSalesTarget />
                    </>
                 )}
                 <SalesTargetChart isTeamData={role === 'manager'} />
                 {role === 'employee' && (
                    <>
                      <CumulativeSalesTargetChart />
                    </>
                 )}
                <DuePaymentsTable />
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <RecentSalesTable />
                {role === 'manager' && <EmployeeCreditSummary />}
              </div>
            </div>
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
