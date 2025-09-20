
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
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

import { salesComparisonData, salesTargetData, salesTargetChartData } from '@/lib/mock-data';
import { Progress } from '../ui/progress';

const CustomLabel = (props: any) => {
    const { x, y, width, height, value, payload } = props;

    // Don't render label if segment is too small
    if (height < 20 || !value) {
        return null;
    }

    // The payload contains the full data entry for the bar
    const total = (payload.jane || 0) + (payload.alex || 0) + (payload.john || 0);
    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

    return (
        <g>
            <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium">
                {`$${(value / 1000).toFixed(0)}K, ${percentage}%`}
            </text>
        </g>
    );
};


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

    return (
      <Card>
        <CardHeader>
          <CardTitle>9월 누적 매출 종합 비교</CardTitle>
          <CardDescription>팀의 9월 목표, 실적, 전년 동기 실적을 비교합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">9월 누적 달성률</span>
              <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
            </div>
            <Progress value={achievementRate} />
            <div className="text-xs text-muted-foreground">
              실적: ${totalActual.toLocaleString()} / 목표: ${totalTarget.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">9월 누적 매출 비교</span>
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
              <BarChart data={salesComparisonData} margin={{ top: 20 }}>
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
                <Legend />
                <Bar dataKey="jane" stackId="a" fill="hsl(var(--chart-3))" name="Jane" radius={[4, 4, 0, 0]}>
                   <LabelList dataKey="jane" content={<CustomLabel />} />
                </Bar>
                <Bar dataKey="alex" stackId="a" fill="hsl(var(--chart-4))" name="Alex">
                   <LabelList dataKey="alex" content={<CustomLabel />} />
                </Bar>
                <Bar dataKey="john" stackId="a" fill="hsl(var(--chart-5))" name="John" radius={[4, 4, 0, 0]}>
                   <LabelList dataKey="john" content={<CustomLabel />} />
                </Bar>
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
  const yoyGrowth = ((salesTargetChartData[0].sales - salesTargetChartData[1].sales) / salesTargetChartData[1].sales) * 100;
  
  const chartConfig = {
    sales: { label: '매출', color: 'hsl(var(--chart-1))' },
    target: { label: '목표', color: 'hsl(var(--chart-2))' },
  };
  
  const SingleCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    
    if (height < 20 || !value) return null;

    return (
        <g>
            <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium">
                {`$${(value / 1000).toFixed(0)}K`}
            </text>
        </g>
    );
};


  return (
    <Card>
      <CardHeader>
        <CardTitle>9월 누적 매출 현황</CardTitle>
        <CardDescription>월간 매출 목표 달성률. 9월과 작년 실적을 비교합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">9월 누적 달성률</span>
            <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
          </div>
          <Progress value={achievementRate} />
          <div className="text-xs text-muted-foreground">
            실적: ${current.toLocaleString()} / 목표: ${target.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">9월 누적 매출 비교</span>
            <span className={`text-sm font-bold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
            </span>
          </div>
           <div className="text-xs text-muted-foreground flex justify-between">
            <span>올해: ${salesTargetChartData[0].sales.toLocaleString()}</span>
            <span>작년: ${salesTargetChartData[1].sales.toLocaleString()}</span>
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
              <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="매출" >
                 <LabelList dataKey="sales" content={<SingleCustomLabel />} />
              </Bar>
              <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="목표" >
                 <LabelList dataKey="target" content={<SingleCustomLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
