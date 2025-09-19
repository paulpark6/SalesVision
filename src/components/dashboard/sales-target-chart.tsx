'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { salesTargetChartData, salesTargetData } from '@/lib/mock-data';
import { Progress } from '../ui/progress';

export function SalesTargetChart() {
  const achievementRate = (salesTargetData.current / salesTargetData.target) * 100;
  const lastYearAchievementRate =
    (salesTargetData.lastYear / 40000) * 100;

  const chartConfig = {
    sales: {
      label: '매출',
      color: 'hsl(var(--chart-1))',
    },
    target: {
      label: '목표',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>매출 목표</CardTitle>
        <CardDescription>
          월간 매출 목표 달성률. 현재 월과 작년 실적을 비교합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">당월 달성률</span>
            <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={achievementRate} />
          <div className="text-xs text-muted-foreground">
            목표: ${salesTargetData.target.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">전년 동월 달성률</span>
            <span className="text-sm font-medium">{lastYearAchievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={lastYearAchievementRate} className="[&>div]:bg-secondary-foreground/50" />
           <div className="text-xs text-muted-foreground">
            목표: $40,000.00
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
              <Tooltip
                cursor={{ fill: 'hsl(var(--background))' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="매출" />
              <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="목표" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
