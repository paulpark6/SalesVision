
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
  customerType: 'self-developed' | 'transferred';
};

// Function to calculate commission based on the new rules
const calculateCommission = (sales: Sale[]) => {
  let totalCommission = 0;
  let totalSales = 0;

  // --- Imported Products Commission ---
  const selfDevImportSales = sales.filter(s => s.type === '수입' && s.customerType === 'self-developed');
  const transferredImportSales = sales.filter(s => s.type === '수입' && s.customerType === 'transferred');

  // Self-developed customer rules for imported goods
  let selfDevImportTotal = 0;
  selfDevImportSales.forEach(sale => {
    selfDevImportTotal += sale.salePrice;
  });

  if (selfDevImportTotal > 200000) {
    totalCommission += 200000 * 0.05;
    totalCommission += (selfDevImportTotal - 200000) * 0.03;
  } else {
    totalCommission += selfDevImportTotal * 0.05;
  }
  totalSales += selfDevImportTotal;

  // Transferred customer rules for imported goods (1%)
  transferredImportSales.forEach(sale => {
    totalCommission += sale.salePrice * 0.01;
    totalSales += sale.salePrice;
  });

  // --- Local Products Commission ---
  const selfDevLocalSales = sales.filter(s => s.type === '현지' && s.customerType === 'self-developed');
  const transferredLocalSales = sales.filter(s => s.type === '현지' && s.customerType === 'transferred');

  // Function to get commission rate for local products based on margin
  const getLocalCommissionRate = (salePrice: number, costPrice: number) => {
    const grossMargin = salePrice - costPrice;
    const marginPercentage = salePrice > 0 ? (grossMargin / salePrice) * 100 : 0;
    
    if (marginPercentage < 10) return 0.03;
    if (marginPercentage < 20) return 0.10;
    if (marginPercentage < 30) return 0.12;
    if (marginPercentage < 40) return 0.15;
    return 0.18; // 40% or more
  };

  // Self-developed customer rules for local goods
  selfDevLocalSales.forEach(sale => {
    const grossMargin = sale.salePrice - sale.costPrice;
    const commissionRate = getLocalCommissionRate(sale.salePrice, sale.costPrice);
    totalCommission += grossMargin * commissionRate;
    totalSales += sale.salePrice;
  });

  // Transferred customer rules for local goods (50% of self-developed commission)
  transferredLocalSales.forEach(sale => {
    const grossMargin = sale.salePrice - sale.costPrice;
    const baseCommissionRate = getLocalCommissionRate(sale.salePrice, sale.costPrice);
    totalCommission += (grossMargin * baseCommissionRate) * 0.5;
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
                직원별 커미션 수익을 검토합니다. 수입 제품은 관리자가, 현지 구매는 매니저가 등록한 판매를 기준으로 합니다.
                커미션은 고객 유형(자체 개발/인계)에 따라 다르게 계산됩니다.
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
