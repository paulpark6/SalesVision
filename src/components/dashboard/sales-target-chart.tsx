
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, ReferenceLine } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent
} from '@/components/ui/chart';

import { salesComparisonData, salesTargetData, salesTargetChartData } from '@/lib/mock-data';
import { Progress } from '../ui/progress';

export function SalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  if (isTeamData) {
    const totalTarget = salesComparisonData.find(d => d.name === '9월 누적 목표')?.jane! + salesComparisonData.find(d => d.name === '9월 누적 목표')?.alex! + salesComparisonData.find(d => d.name === '9월 누적 목표')?.john!;
    const totalActual = salesComparisonData.find(d => d.name === '9월 누적 실적')?.jane! + salesComparisonData.find(d => d.name === '9월 누적 실적')?.alex! + salesComparisonData.find(d => d.name === '9월 누적 실적')?.john!;
    const totalLastYear = salesComparisonData.find(d => d.name === '전년 동기 실적')?.jane! + salesComparisonData.find(d => d.name === '전년 동기 실적')?.alex! + salesComparisonData.find(d => d.name === '전년 동기 실적')?.john!;

    const achievementRate = (totalActual / totalTarget) * 100;
    const yoyGrowth = ((totalActual - totalLastYear) / totalLastYear) * 100;

    const chartConfig = {
      jane: { label: 'Jane', color: 'hsl(var(--chart-3))' },
      alex: { label: 'Alex', color: 'hsl(var(--chart-4))' },
      john: { label: 'John', color: 'hsl(var(--chart-5))' },
    };

    const processedData = salesComparisonData.map(item => {
        const total = (item.jane || 0) + (item.alex || 0) + (item.john || 0);
        return {
            ...item,
            total,
        };
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>9월 팀 매출 현황</CardTitle>
          <CardDescription>팀의 9월 목표, 실적, 전년 동기 실적을 비교합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">9월 달성률</span>
              <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
            </div>
            <Progress value={achievementRate} />
            <div className="text-xs text-muted-foreground">
              실적: ${totalActual.toLocaleString()} / 목표: ${totalTarget.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">전년 동월 대비</span>
              <span className={`text-sm font-bold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
              </span>
            </div>
             <div className="text-xs text-muted-foreground flex justify-between">
              <span>올해: ${totalActual.toLocaleString()}</span>
              <span>작년: ${totalLastYear.toLocaleString()}</span>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 20 }}>
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
                <Tooltip
                  cursor={{ fill: 'hsl(var(--background))' }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => {
                        const total = item.payload.total;
                        const percentage = total > 0 ? ((value as number / total) * 100) : 0;
                        const capitalizedName = (name as string).charAt(0).toUpperCase() + (name as string).slice(1);
                        return (
                          <div className="flex items-center gap-2">
                            <span style={{ color: item.color }} className="font-semibold">{capitalizedName}:</span>
                            <span>${(value as number).toLocaleString()} ({percentage.toFixed(1)}%)</span>
                          </div>
                        )
                      }}
                    />
                  }
                />
                <Legend />
                <ReferenceLine y={45000} label={{ value: "Company Target", position: 'insideTopLeft', fill: 'hsl(var(--foreground))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                <Bar dataKey="jane" stackId="a" fill="hsl(var(--chart-3))" name="Jane" radius={[0, 0, 0, 0]}/>
                <Bar dataKey="alex" stackId="a" fill="hsl(var(--chart-4))" name="Alex" />
                <Bar dataKey="john" stackId="a" fill="hsl(var(--chart-5))" name="John" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  
  // Default chart for individual employee
  const { current, target } = salesTargetData;
  const achievementRate = (current / target) * 100;
  
  const chartConfig = {
    sales: { label: '매출', color: 'hsl(var(--chart-2))' },
    target: { label: '목표', color: 'hsl(var(--chart-1))' },
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>9월 매출 현황</CardTitle>
        <CardDescription>월간 매출 목표 달성률을 나타냅니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">9월 달성률</span>
            <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={achievementRate} />
          <div className="text-xs text-muted-foreground">
            실적: ${current.toLocaleString()} / 목표: ${target.toLocaleString()}
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTargetChartData} margin={{ top: 20 }}>
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
              <Legend />
              <ReferenceLine y={45000} label={{ value: "Company Target", position: 'insideTopLeft', fill: 'hsl(var(--foreground))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Bar dataKey="target" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="목표" />
              <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="매출" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
