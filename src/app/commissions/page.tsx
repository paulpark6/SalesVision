
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
import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { commissionData } from '@/lib/mock-data';

type Sale = {
  type: '수입' | '현지';
  salePrice: number;
  costPrice: number;
};

// Function to calculate commission based on the new rules
const calculateCommission = (sales: Sale[]) => {
  let totalCommission = 0;
  let totalSales = 0;
  let importSalesTotal = 0;

  // Separate sales by type to apply different rules
  const importSales = sales.filter(s => s.type === '수입');
  const localSales = sales.filter(s => s.type === '현지');

  // Calculate commission for imported products
  importSales.forEach(sale => {
    importSalesTotal += sale.salePrice;
  });

  if (importSalesTotal > 200000) {
    totalCommission += 200000 * 0.05;
    totalCommission += (importSalesTotal - 200000) * 0.03;
  } else {
    totalCommission += importSalesTotal * 0.05;
  }
  
  totalSales += importSalesTotal;

  // Calculate commission for local products
  localSales.forEach(sale => {
    const grossMargin = sale.salePrice - sale.costPrice;
    const marginPercentage = sale.salePrice > 0 ? (grossMargin / sale.salePrice) * 100 : 0;

    let commissionRate = 0;
    if (marginPercentage < 10) {
      commissionRate = 0.03;
    } else if (marginPercentage >= 10 && marginPercentage < 20) {
      commissionRate = 0.10;
    } else if (marginPercentage >= 20 && marginPercentage < 30) {
      commissionRate = 0.12;
    } else if (marginPercentage >= 30 && marginPercentage < 40) {
      commissionRate = 0.15;
    } else { // 40% or more
      commissionRate = 0.18;
    }
    totalCommission += grossMargin * commissionRate;
    totalSales += sale.salePrice;
  });

  const averageCommissionRate = totalSales > 0 ? (totalCommission / totalSales) * 100 : 0;

  return { totalSales, totalCommission, averageCommissionRate };
};


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
  
  const processedCommissionData = useMemo(() => {
    return commissionData.map(employee => {
      const { totalSales, totalCommission, averageCommissionRate } = calculateCommission(employee.sales);
      return {
        ...employee,
        totalSales,
        commissionEarned: totalCommission,
        effectiveRate: averageCommissionRate,
      };
    });
  }, []);

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
                Review commission earnings for each employee for the current period based on sales type and margins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Total Sales</TableHead>
                    <TableHead className="text-right">Avg. Commission Rate</TableHead>
                    <TableHead className="text-right">Commission Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedCommissionData.map((commission) => (
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
                            {commission.effectiveRate.toFixed(2)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${commission.commissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
