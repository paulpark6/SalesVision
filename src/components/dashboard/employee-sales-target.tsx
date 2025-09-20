
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { salesTargetData } from '@/lib/mock-data';

const employeeTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

export function EmployeeSalesTarget() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>팀원별 9월 매출 실적</CardTitle>
        <CardDescription>
          팀원별 월간 매출 목표 달성 현황입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {employeeTargets.map((employee) => {
            const achievementRate = (employee.current / employee.target) * 100;
            return (
                 <div key={employee.name} className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">{employee.name}</span>
                        <span className="text-sm font-medium">{achievementRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={achievementRate} />
                    <div className="text-xs text-muted-foreground">
                        실적: ${employee.current.toLocaleString()} / 목표: ${employee.target.toLocaleString()}
                    </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
