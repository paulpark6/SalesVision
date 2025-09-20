
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ArrowLeft, DollarSign, Target } from 'lucide-react';
import { employees, salesTargetData, salesTargetChartData } from '@/lib/mock-data';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { auth } = useAuth();
  const role = auth?.role;

  const employeeName = decodeURIComponent(params.employeeName as string);

  useEffect(() => {
    if (auth === undefined) return;
    
    if (!auth || (auth.role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router]);
  
  if (!role || role !== 'manager') {
    return null;
  }
  
  const chartConfig = {
    sales: { label: '매출', color: 'hsl(var(--chart-1))' },
    target: { label: '목표', color: 'hsl(var(--chart-2))' },
  };

  return (
    <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">{employeeName} - 9월 실적</h1>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">9월 매출</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${salesTargetData.current.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">전월 대비 +15%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">9월 목표 달성률</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{((salesTargetData.current / salesTargetData.target) * 100).toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">목표: ${salesTargetData.target.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>월별 매출 목표 비교</CardTitle>
                    <CardDescription>
                        {employeeName}의 9월 매출과 전년 동월 실적을 비교합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesTargetChartData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}K`}
                                />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="매출" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" fill="hsl(var(--chart-2))" name="목표" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
