
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { cumulativeReportData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function CumulativeSalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  const cardTitle = isTeamData ? '팀 9월 누적 매출 현황' : '9월 누적 매출 현황';
  const cardDescription = isTeamData 
    ? '9월까지의 팀 전체 누적 매출과 연간 목표, 전년 실적을 비교합니다.' 
    : '9월까지의 누적 매출과 연간 목표, 전년 실적을 비교합니다.';

  const septemberData = cumulativeReportData.find(d => d.month === '9월');
  
  let cumulativeActual = 0;
  let cumulativeTarget = 0;
  let cumulativeLastYear = 0;

  if (septemberData) {
      const upToSeptember = cumulativeReportData.slice(0, cumulativeReportData.indexOf(septemberData) + 1);
      cumulativeActual = upToSeptember.reduce((acc, item) => acc + item.actual, 0);
      cumulativeTarget = upToSeptember.reduce((acc, item) => acc + item.target, 0);
      cumulativeLastYear = upToSeptember.reduce((acc, item) => acc + item.lastYear, 0);
  }

  const chartData = [{
    month: '9월 누적',
    '목표': cumulativeTarget,
    '실적': cumulativeActual,
    '전년실적': cumulativeLastYear,
  }];
  
  const achievementRate = cumulativeTarget > 0 ? (cumulativeActual / cumulativeTarget) * 100 : 0;
  const yoyGrowth = cumulativeLastYear > 0 ? ((cumulativeActual - cumulativeLastYear) / cumulativeLastYear) * 100 : 0;

  const chartConfig = {
    '목표': { label: '목표', color: 'hsl(var(--chart-1))' },
    '실적': { label: '실적', color: 'hsl(var(--chart-2))' },
    '전년실적': { label: '전년실적', color: 'hsl(var(--chart-3))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
            <div className="flex justify-around text-center text-xs sm:text-sm font-bold h-8">
                <div className="w-1/3 flex justify-end pr-2 sm:pr-4">
                    <div className="flex flex-col items-center">
                        <span>목표 대비</span>
                        <span>{achievementRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="w-1/3 flex justify-center items-center px-1 sm:px-2">
                    <div className={cn("flex items-center gap-1", yoyGrowth >= 0 ? "text-green-600" : "text-red-600")}>
                        {yoyGrowth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        <span>{yoyGrowth.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="w-1/3"></div>
            </div>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 0 }}
                  barCategoryGap="20%"
                >
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      className="font-bold"
                    />
                    <YAxis
                        tickFormatter={(value) => `$${value / 1000}K`}
                        tickLine={false}
                        axisLine={false}
                    />
                  <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                  <Legend />
                   <Bar
                    dataKey="목표"
                    fill="var(--color-목표)"
                    radius={[4, 4, 0, 0]}
                    name="목표"
                  />
                  <Bar
                    dataKey="실적"
                    fill="var(--color-실적)"
                    radius={[4, 4, 0, 0]}
                    name="실적"
                  />
                   <Bar
                    dataKey="전년실적"
                    fill="var(--color-전년실적)"
                    radius={[4, 4, 0, 0]}
                    name="전년실적"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
