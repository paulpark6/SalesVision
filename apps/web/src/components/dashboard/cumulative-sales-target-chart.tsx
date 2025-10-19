
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { cumulativeReportData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function CumulativeSalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  const cardTitle = isTeamData ? 'Team Cumulative Performance (September)' : 'Cumulative Performance (September)';
  const cardDescription = isTeamData 
    ? 'Compare the team’s cumulative sales through September against annual goals and prior-year results.' 
    : 'Compare cumulative sales through September to annual goals and prior-year results.';

  let cumulativeActual = 0;
  let cumulativeTarget = 0;
  let cumulativeLastYear = 0;

  // Calculate cumulative values up to September
  const upToSeptember = cumulativeReportData.slice(0, 9); // Assuming data is for Jan-Sep
  cumulativeActual = upToSeptember.reduce((acc, item) => acc + item.actual, 0);
  cumulativeTarget = upToSeptember.reduce((acc, item) => acc + item.target, 0);
  cumulativeLastYear = upToSeptember.reduce((acc, item) => acc + item.lastYear, 0);


  const chartData = [{
    month: 'September Total',
    Target: cumulativeTarget,
    Actual: cumulativeActual,
    'Prior Year': cumulativeLastYear,
  }];
  
  const achievementRate = cumulativeTarget > 0 ? (cumulativeActual / cumulativeTarget) * 100 : 0;
  const yoyGrowth = 7.8; // As requested

  const chartConfig = {
    Target: { label: 'Target', color: 'hsl(var(--chart-1))' },
    Actual: { label: 'Actual', color: 'hsl(var(--chart-2))' },
    'Prior Year': { label: 'Prior Year', color: 'hsl(var(--chart-3))' },
  };

  const formatCurrencyLabel = (value: number) => `$${(value / 1000).toFixed(0)}K`;

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
            <div className="flex justify-around text-center text-xs sm:text-sm font-bold h-12">
                <div className="w-1/2 flex justify-center pr-4">
                    <div className="flex flex-col items-center">
                        <span>Target vs. Actual</span>
                        <span>{achievementRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="w-1/2 flex justify-center pl-4">
                     <div className={cn("flex flex-col items-center", yoyGrowth >= 0 ? "text-green-600" : "text-red-600")}>
                        <span>Year-over-Year Growth</span>
                        <div className="flex items-center gap-1">
                            {yoyGrowth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span>{yoyGrowth.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
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
                    dataKey="Target"
                    fill="var(--color-Target)"
                    radius={[4, 4, 0, 0]}
                    name="Target"
                  >
                    <LabelList dataKey="Target" position="top" formatter={formatCurrencyLabel} className="font-semibold" />
                  </Bar>
                  <Bar
                    dataKey="Actual"
                    fill="var(--color-Actual)"
                    radius={[4, 4, 0, 0]}
                    name="Actual"
                  >
                     <LabelList dataKey="Actual" position="top" formatter={formatCurrencyLabel} className="font-semibold" />
                  </Bar>
                   <Bar
                    dataKey="Prior Year"
                    fill="var(--color-Prior Year)"
                    radius={[4, 4, 0, 0]}
                    name="Prior Year"
                  >
                    <LabelList dataKey="Prior Year" position="top" formatter={formatCurrencyLabel} className="font-semibold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
