
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
  
  const currentYearTotalSales = isTeamData 
    ? teamSalesTargetChartData[0].jane + teamSalesTargetChartData[0].alex + teamSalesTargetChartData[0].john 
    : data.current;
    
  const lastYearTotalSales = isTeamData 
    ? teamSalesTargetChartData[1].jane + teamSalesTargetChartData[1].alex + teamSalesTargetChartData[1].john 
    : salesTargetChartData[1].sales;

  const yoyGrowth = ((currentYearTotalSales - lastYearTotalSales) / lastYearTotalSales) * 100;


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
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">전년 동기 매출 비교</span>
            <span className={`text-sm font-bold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
            </span>
          </div>
           <div className="text-xs text-muted-foreground flex justify-between">
            <span>올해: ${currentYearTotalSales.toLocaleString()}</span>
            <span>작년: ${lastYearTotalSales.toLocaleString()}</span>
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
