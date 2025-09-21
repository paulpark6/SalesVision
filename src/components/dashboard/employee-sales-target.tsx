
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '../ui/progress';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const employeeTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

export function EmployeeSalesTarget() {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>팀원별 9월 매출 실적</CardTitle>
        <CardDescription>
          팀원별 월간 매출 목표 달성 현황입니다. 이름을 클릭하면 상세 실적을 볼 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
            {employeeTargets.map((employee) => {
                const achievementRate = (employee.current / employee.target) * 100;
                return (
                    <div key={employee.name} className="space-y-2">
                        <div className="flex justify-between">
                            <Link href={`/employees/${encodeURIComponent(employee.name)}`} className="font-medium hover:underline">
                                {employee.name}
                            </Link>
                            <span className="text-sm text-muted-foreground">{formatCurrency(employee.current)} / {formatCurrency(employee.target)}</span>
                        </div>
                        <Progress value={achievementRate} />
                         <div className="text-right text-sm font-semibold text-primary">
                            {achievementRate.toFixed(1)}%
                        </div>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
