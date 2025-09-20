
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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

import { salesTargetChartData, salesTargetData, teamSalesTargetData, teamSalesTargetChartData } from '@/lib/mock-data';
import { Progress } from '../ui/progress';

export function SalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  const data = isTeamData ? teamSalesTargetData : salesTargetData;
  const chartData = isTeamData ? teamSalesTargetChartData : salesTargetChartData;
  
  const achievementRate = (data.current / data.target) * 100;
  const lastYearTotalSales = isTeamData ? Object.values(teamSalesTargetChartData[1]).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0) : data.lastYear;
  const lastYearTarget = isTeamData ? 120000 : 40000;
  const lastYearAchievementRate = (lastYearTotalSales / lastYearTarget) * 100;


  const cardTitle = isTeamData ? '9월 누적 매출 현황' : '매출 목표';
  const cardDescription = isTeamData 
    ? '팀 전체의 9월 매출 목표 달성률. 9월과 작년 실적을 비교합니다.'
    : '월간 매출 목표 달성률. 9월과 작년 실적을 비교합니다.';

  const chartConfig = {
    sales: { label: '매출', color: 'hsl(var(--chart-1))' },
    target: { label: '목표', color: 'hsl(var(--chart-2))' },
    jane: { label: 'Jane', color: 'hsl(var(--chart-3))' },
    alex: { label: 'Alex', color: 'hsl(var(--chart-4))' },
    john: { label: 'John', color: 'hsl(var(--chart-5))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">9월 누적 달성률</span>
            <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={achievementRate} />
          <div className="text-xs text-muted-foreground">
            실적: ${data.current.toLocaleString()} / 목표: ${data.target.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">전년 동기 매출 비교</span>
            <span className="text-sm text-muted-foreground">{lastYearAchievementRate.toFixed(1)}% 달성</span>
          </div>
          <Progress value={lastYearAchievementRate} className="[&>div]:bg-secondary-foreground/50" />
           <div className="text-xs text-muted-foreground">
            실적: ${lastYearTotalSales.toLocaleString()} / 목표: ${lastYearTarget.toLocaleString()}
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20 }}>
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
              {isTeamData && <Legend />}
              {isTeamData ? (
                <>
                  <Bar dataKey="jane" fill="hsl(var(--chart-3))" stackId="a" radius={[4, 4, 0, 0]} name="Jane 누적" />
                  <Bar dataKey="alex" fill="hsl(var(--chart-4))" stackId="a" name="Alex 누적" />
                  <Bar dataKey="john" fill="hsl(var(--chart-5))" stackId="a" radius={[4, 4, 0, 0]} name="John 누적" />
                </>
              ) : (
                <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="매출" />
              )}
              <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="목표" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
