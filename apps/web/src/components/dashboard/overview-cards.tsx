
'use client';

import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { overviewData, salesTargetData } from '@/lib/mock-data';

export function OverviewCards() {
  const newCustomerRevenue = 8594.5;
  const newCustomerRevenueProportion = (newCustomerRevenue / overviewData.totalRevenue) * 100;
  const ytdTarget = salesTargetData.target * 7; 
  const ytdActual = overviewData.totalRevenue * 6.5; 
  const ytdLastYear = 42100.5 * 6.5;

  const ytdTargetAchievementRate = (ytdActual / ytdTarget) * 100;
  const ytdGrowthVsLastYear = ((ytdActual - ytdLastYear) / ytdLastYear) * 100;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">9월 매출</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${overviewData.totalRevenue.toLocaleString('en-US')}
          </div>
          <p className="text-xs text-muted-foreground">
            전월 대비 +20.1%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">당해년도 9월 누적</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(ytdActual).toLocaleString('en-US')}
          </div>
          <p className="text-xs text-muted-foreground">
            목표 대비 {ytdTargetAchievementRate.toFixed(1)}%, 전년 대비 {ytdGrowthVsLastYear.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">신용</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(overviewData.totalRevenue * 0.45).toLocaleString('en-US')}
          </div>
          <p className="text-xs text-muted-foreground">전월 대비 +19%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">신규 고객 매출</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${newCustomerRevenue.toLocaleString('en-US')}</div>
          <p className="text-xs text-muted-foreground">당월 매출의 {newCustomerRevenueProportion.toFixed(1)}% 차지</p>
        </CardContent>
      </Card>
    </>
  );
}
