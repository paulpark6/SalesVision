
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
import { cumulativeSalesTargetChartData, overviewData, salesTargetData, teamCumulativeSalesTargetChartData } from '@/lib/mock-data';

export function CumulativeSalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
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
  
  const chartData = isTeamData ? teamCumulativeSalesTargetChartData : cumulativeSalesTargetChartData;
  const cardTitle = isTeamData ? '팀 연간 누적 매출 목표' : '연간 누적 매출 목표';
  const cardDescription = isTeamData ? '팀 전체의 연간 누적 매출과 목표를 비교합니다.' : '연간 누적 매출과 목표를 비교합니다.';


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
              <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="누적 매출" />
              <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="누적 목표" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
