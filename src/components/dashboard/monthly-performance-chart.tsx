
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { monthlyPerformanceData } from '@/lib/mock-data';

const chartConfig = {
  actual: { label: 'Actual', color: 'hsl(var(--chart-2))' },
  target: { label: 'Target', color: 'hsl(var(--chart-1))' },
};

export function MonthlyPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent 3-Month Performance</CardTitle>
        <CardDescription>Sales performance over the last three months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPerformanceData}>
              <XAxis
                dataKey="month"
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
              <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    