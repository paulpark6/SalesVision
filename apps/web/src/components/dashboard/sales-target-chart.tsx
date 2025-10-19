
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
    const totalTarget = salesComparisonData.find(d => d.name === 'September Cumulative Target')?.jane! + salesComparisonData.find(d => d.name === 'September Cumulative Target')?.alex! + salesComparisonData.find(d => d.name === 'September Cumulative Target')?.john!;
    const totalActual = salesComparisonData.find(d => d.name === 'September Cumulative Actual')?.jane! + salesComparisonData.find(d => d.name === 'September Cumulative Actual')?.alex! + salesComparisonData.find(d => d.name === 'September Cumulative Actual')?.john!;
    const totalLastYear = salesComparisonData.find(d => d.name === 'Prior Year Cumulative Actual')?.jane! + salesComparisonData.find(d => d.name === 'Prior Year Cumulative Actual')?.alex! + salesComparisonData.find(d => d.name === 'Prior Year Cumulative Actual')?.john!;

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
          <CardTitle>September Team Performance</CardTitle>
          <CardDescription>Compare the team’s September targets, actuals, and prior-year results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">September Achievement Rate</span>
              <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
            </div>
            <Progress value={achievementRate} />
            <div className="text-xs text-muted-foreground">
              Actual: ${totalActual.toLocaleString()} / Target: ${totalTarget.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Year-Over-Year Change</span>
              <span className={`text-sm font-bold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
              </span>
            </div>
             <div className="text-xs text-muted-foreground flex justify-between">
              <span>This year: ${totalActual.toLocaleString()}</span>
              <span>Last year: ${totalLastYear.toLocaleString()}</span>
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
    sales: { label: 'Sales', color: 'hsl(var(--chart-2))' },
    target: { label: 'Target', color: 'hsl(var(--chart-1))' },
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>September Performance</CardTitle>
        <CardDescription>Monthly sales target attainment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">September Achievement Rate</span>
            <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={achievementRate} />
          <div className="text-xs text-muted-foreground">
            Actual: ${current.toLocaleString()} / Target: ${target.toLocaleString()}
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
              <Bar dataKey="target" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
