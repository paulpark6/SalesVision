
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { salesReportData } from '@/lib/mock-data';

export default function SalesReportPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalTarget = useMemo(() => salesReportData.reduce((sum, item) => sum + item.target, 0), []);
  const totalActual = useMemo(() => salesReportData.reduce((sum, item) => sum + item.actual, 0), []);
  const totalAchievement = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">9월 매출 실적 보고서</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별 매출 목표 및 실적 비교</CardTitle>
              <CardDescription>
                9월에 설정된 고객별 매출 목표와 실제 달성 실적을 비교합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>담당 직원</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead className="text-right">매출 목표 (9월)</TableHead>
                    <TableHead className="text-right">매출 실적 (9월)</TableHead>
                    <TableHead className="w-[200px]">달성률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReportData.map((data) => {
                    const achievementRate = data.target > 0 ? (data.actual / data.target) * 100 : 0;
                    return (
                      <TableRow key={data.customerCode}>
                        <TableCell>{data.employeeName}</TableCell>
                        <TableCell>
                            <div className="font-medium">{data.customerName}</div>
                            <div className="text-sm text-muted-foreground">{data.customerCode}</div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(data.target)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(data.actual)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={achievementRate} className="h-2" />
                            <span className="text-xs font-semibold w-12 text-right">
                                {achievementRate.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-6 font-bold text-lg mt-6 pr-4">
                  <div>
                      <span>총 목표: {formatCurrency(totalTarget)}</span>
                  </div>
                  <div>
                      <span>총 실적: {formatCurrency(totalActual)}</span>
                  </div>
                   <div>
                      <span>총 달성률: {totalAchievement.toFixed(1)}%</span>
                  </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
