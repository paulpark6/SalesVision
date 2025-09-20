
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
  TableFooter,
} from '@/components/ui/table';
import { cumulativeReportData } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function CumulativeReportPage() {
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
  
  const processedData = useMemo(() => {
    let cumulativeTarget = 0;
    let cumulativeActual = 0;
    let cumulativeLastYear = 0;
    
    return cumulativeReportData.map(item => {
        cumulativeTarget += item.target;
        cumulativeActual += item.actual;
        cumulativeLastYear += item.lastYear;
        return {
            ...item,
            cumulativeTarget,
            cumulativeActual,
            cumulativeLastYear,
        };
    });
  }, []);

  const totalTarget = processedData[processedData.length - 1]?.cumulativeTarget || 0;
  const totalActual = processedData[processedData.length - 1]?.cumulativeActual || 0;
  const totalLastYear = processedData[processedData.length - 1]?.cumulativeLastYear || 0;
  const totalYoyGrowth = totalLastYear > 0 ? ((totalActual - totalLastYear) / totalLastYear) * 100 : (totalActual > 0 ? 100 : 0);
  
  const chartConfig = {
      actual: { label: '당해년도 실적', color: 'hsl(var(--chart-1))' },
      target: { label: '당해년도 목표', color: 'hsl(var(--chart-2))' },
      lastYear: { label: '전년동기간 실적', color: 'hsl(var(--chart-3))' },
  };

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
            <h1 className="text-2xl font-semibold">연간 누적 매출 보고서</h1>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 누적 실적 비교</CardTitle>
              <CardDescription>
                당해년도 누적 목표, 누적 실적, 전년 동기간 누적 실적을 월별로 비교합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(value) => `$${value / 1000}K`}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="cumulativeTarget" fill="var(--color-target)" radius={[4, 4, 0, 0]} name="누적 목표" />
                            <Bar dataKey="cumulativeActual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} name="누적 실적" />
                            <Bar dataKey="cumulativeLastYear" fill="var(--color-lastYear)" radius={[4, 4, 0, 0]} name="전년동기 누적" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>월</TableHead>
                    <TableHead className="text-right">누적 목표</TableHead>
                    <TableHead className="text-right">누적 실적 (당해)</TableHead>
                    <TableHead className="text-right">누적 실적 (전년)</TableHead>
                    <TableHead className="w-[200px]">목표 달성률</TableHead>
                    <TableHead className="w-[200px]">전년 대비 성장률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.map((data) => {
                    const achievementRate = data.cumulativeTarget > 0 ? (data.cumulativeActual / data.cumulativeTarget) * 100 : 0;
                    const yoyGrowth = data.cumulativeLastYear > 0 ? ((data.cumulativeActual - data.cumulativeLastYear) / data.cumulativeLastYear) * 100 : (data.cumulativeActual > 0 ? 100 : 0);
                    return (
                      <TableRow key={data.month}>
                        <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.cumulativeTarget)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(data.cumulativeActual)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.cumulativeLastYear)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={achievementRate} className="h-2" />
                            <span className="text-xs font-semibold w-12 text-right">
                                {achievementRate.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                         <TableCell>
                          <div className={cn(
                            "flex items-center justify-end gap-1 font-semibold",
                            yoyGrowth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {yoyGrowth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span>{yoyGrowth.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totalTarget)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totalActual)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totalLastYear)}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={(totalActual/totalTarget)*100} className="h-2" />
                                <span className="text-xs font-bold w-12 text-right">
                                    {((totalActual/totalTarget)*100).toFixed(1)}%
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "flex items-center justify-end gap-1 font-bold",
                            totalYoyGrowth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {totalYoyGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            <span>{totalYoyGrowth.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
