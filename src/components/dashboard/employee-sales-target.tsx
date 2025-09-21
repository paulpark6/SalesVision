
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">Sales Target</TableHead>
              <TableHead className="text-right">Actual Sales</TableHead>
              <TableHead className="w-[150px]">Achievement Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeTargets.map((employee) => {
                const achievementRate = (employee.current / employee.target) * 100;
                return (
                    <TableRow key={employee.name}>
                        <TableCell className="font-medium">
                           <Link href={`/employees/${encodeURIComponent(employee.name)}`} className="hover:underline">
                                {employee.name}
                           </Link>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(employee.target)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(employee.current)}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={achievementRate} className="h-2" />
                                <span className="text-xs font-semibold w-12 text-right">
                                    {achievementRate.toFixed(1)}%
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
