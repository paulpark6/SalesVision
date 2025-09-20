
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { salesTargetHistoryData as initialData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TargetData = typeof initialData[0];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [salesData, setSalesData] = useState(initialData);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) { // All roles can access this page
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleTargetChange = (customerCode: string, newTarget: number) => {
    setSalesData(prevData => 
        prevData.map(item => 
            item.customerCode === customerCode ? { ...item, nextMonthTarget: newTarget } : item
        )
    );
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleSubmitForApproval = () => {
    toast({
        title: "Approval Request Sent",
        description: "The monthly sales targets have been submitted for administrator approval.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
  }
  
  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">월별 고객 매출 목표</h1>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
                { (role === 'employee' || role === 'manager') &&
                    <Button onClick={handleSubmitForApproval}>
                        Submit for Approval
                    </Button>
                }
            </div>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>고객별 매출 목표 설정</CardTitle>
                <CardDescription>
                    지난 3개월간의 매출 실적을 바탕으로 다음 달(10월)의 매출 목표를 설정합니다. 신규 고객은 목록에 추가하여 목표를 설정할 수 있습니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">고객명</TableHead>
                            <TableHead className="text-right">7월 매출</TableHead>
                            <TableHead className="text-right">8월 매출</TableHead>
                            <TableHead className="text-right">9월 매출</TableHead>
                            <TableHead className="w-[200px] text-right">10월 목표</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesData.map((data) => {
                            const isOpen = openCollapsible === data.customerCode;
                            return (
                                <Fragment key={data.customerCode}>
                                    <TableRow className="cursor-pointer" onClick={() => setOpenCollapsible(isOpen ? null : data.customerCode)}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                                <div className="font-medium">{data.customerName}</div>
                                                <div className="text-sm text-muted-foreground">{data.customerCode}</div>
                                            </div>
                                        </TableCell>
                                        {data.monthlySales.map(sale => (
                                            <TableCell key={sale.month} className="text-right">
                                                {formatCurrency(sale.amount)}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <Input 
                                                type="number" 
                                                className="w-full text-right"
                                                value={data.nextMonthTarget}
                                                onChange={(e) => handleTargetChange(data.customerCode, parseFloat(e.target.value) || 0)}
                                                onClick={(e) => e.stopPropagation()} // Prevent row click
                                            />
                                        </TableCell>
                                    </TableRow>
                                    {isOpen && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="p-0">
                                                <div className="bg-muted/50 p-4 grid grid-cols-3 gap-4">
                                                    {data.monthlySales.map(sale => (
                                                        <div key={sale.month}>
                                                            <h4 className="font-semibold mb-2">{sale.month} 판매 제품</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {sale.products.map(product => (
                                                                    <Badge key={product} variant="secondary">{product}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

