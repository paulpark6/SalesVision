
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CumulativeSalesTargetChart({ isTeamData = false }: { isTeamData?: boolean }) {
  const cardTitle = isTeamData ? '팀 9월 누적 매출 현황' : '9월 누적 매출 현황';
  const cardDescription = isTeamData 
    ? '9월까지의 팀 전체 누적 매출과 연간 목표를 비교합니다.' 
    : '9월까지의 누적 매출과 연간 목표를 비교합니다.';


  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">클릭하여 누적 보고서 보기</p>
         </div>
      </CardContent>
    </Card>
  );
}
