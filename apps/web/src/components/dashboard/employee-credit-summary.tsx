
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '../ui/separator';

const employeeCredits = [
    { name: 'Jane Smith', amount: 12500.75, count: 15 },
    { name: 'Alex Ray', amount: 8200.00, count: 10 },
    { name: 'John Doe', amount: 15300.50, count: 22 },
];

const totalCredit = employeeCredits.reduce((acc, curr) => acc + curr.amount, 0);

export function EmployeeCreditSummary() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>팀원별 신용 판매 현황</CardTitle>
        <CardDescription>
          팀원별 현재 신용 판매 잔액입니다. 총 잔액: ${totalCredit.toLocaleString('en-US')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {employeeCredits.map((employee, index) => (
            <div key={employee.name}>
                <div className="flex justify-between items-center">
                    <div className='flex flex-col'>
                        <span className="text-sm font-medium">{employee.name}</span>
                        <span className='text-xs text-muted-foreground'>{employee.count}건</span>
                    </div>
                    <span className="text-lg font-semibold">${employee.amount.toLocaleString('en-US')}</span>
                </div>
                {index < employeeCredits.length - 1 && <Separator className="mt-4" />}
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
