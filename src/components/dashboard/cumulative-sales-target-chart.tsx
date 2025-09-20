
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

export function CumulativeSalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  const cardTitle = isTeamData ? '팀 9월 누적 매출 현황' : '9월 누적 매출 현황';
  const cardDescription = isTeamData 
    ? '9월까지의 팀 전체 누적 매출과 연간 목표를 비교합니다.' 
    : '9월까지의 누적 매출과 연간 목표를 비교합니다.';

  const septemberData = cumulativeReportData.find(d => d.month === '9월');
  
  const chartData = septemberData ? [
    { name: '9월 누적', '누적 실적': septemberData.actual, '누적 목표': septemberData.target },
  ] : [];

  let cumulativeActual = 0;
  let cumulativeTarget = 0;

  if (septemberData) {
      const upToSeptember = cumulativeReportData.slice(0, cumulativeReportData.indexOf(septemberData) + 1);
      cumulativeActual = upToSeptember.reduce((acc, item) => acc + item.actual, 0);
      cumulativeTarget = upToSeptember.reduce((acc, item) => acc + item.target, 0);
  }

  const chartConfig = {
    '누적 실적': { label: '누적 실적', color: 'hsl(var(--chart-1))' },
    '누적 목표': { label: '누적 목표', color: 'hsl(var(--chart-2))' },
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
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={[{
                month: '9월 누적',
                실적: cumulativeActual,
                목표: cumulativeTarget,
              }]}
              layout="vertical"
              margin={{ left: 10 }}
            >
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
                className="font-bold"
              />
              <XAxis dataKey="실적" type="number" hide />
              <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
              <Legend />
              <Bar
                dataKey="실적"
                stackId="a"
                fill="var(--color-누적 실적)"
                radius={[0, 4, 4, 0]}
                name="누적 실적"
              />
              <Bar
                dataKey="목표"
                stackId="a"
                fill="var(--color-누적 목표)"
                radius={[0, 4, 4, 0]}
                name="누적 목표"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
