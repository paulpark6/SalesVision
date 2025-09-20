
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for commissions
const commissionData = [
  {
    employeeId: 'emp-01',
    employeeName: 'Jane Smith',
    totalSales: 45231.89,
    commissionRate: 0.05, // 5%
  },
  {
    employeeId: 'emp-02',
    employeeName: 'Alex Ray',
    totalSales: 52000.00,
    commissionRate: 0.05, // 5%
  },
  {
    employeeId: 'emp-03',
    employeeName: 'John Doe',
    totalSales: 41000.00,
    commissionRate: 0.04, // 4%
  },
];

export default function CommissionsPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Employee Commissions</h1>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Back to Dashboard
              </Button>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>Commission Overview</CardTitle>
              <CardDescription>
                Review commission earnings for each employee for the current period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Total Sales</TableHead>
                    <TableHead className="text-right">Commission Rate</TableHead>
                    <TableHead className="text-right">Commission Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionData.map((commission) => {
                    const commissionEarned = commission.totalSales * commission.commissionRate;
                    return (
                      <TableRow key={commission.employeeId}>
                        <TableCell>
                          <div className="font-medium">{commission.employeeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {commission.employeeId}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${commission.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">
                            {(commission.commissionRate * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${commissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
