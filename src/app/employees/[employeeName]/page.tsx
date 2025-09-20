
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, DollarSign, Target, Users, MoreHorizontal } from 'lucide-react';
import { salesTargetData, employeeCustomerSales, customerProductSalesDetails } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { CustomerSalesDetailDialog } from '@/components/dashboard/customer-sales-detail-dialog';
import type { EmployeeCustomerSale } from '@/lib/mock-data';
import { SalesTargetChart } from '@/components/dashboard/sales-target-chart';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { auth } = useAuth();
  const role = auth?.role;

  const employeeName = decodeURIComponent(params.employeeName as string);

  const [selectedCustomer, setSelectedCustomer] = useState<EmployeeCustomerSale | null>(null);

  useEffect(() => {
    if (auth === undefined) return;
    
    if (!auth || (auth.role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router]);
  
  if (!role || role !== 'manager') {
    return null;
  }

  return (
    <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">{employeeName} - 9월 실적</h1>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">9월 매출</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${salesTargetData.current.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">전월 대비 +15%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">9월 목표 달성률</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{((salesTargetData.current / salesTargetData.target) * 100).toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">목표: ${salesTargetData.target.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                <SalesTargetChart />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>고객별 매출 현황</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[120px]'>고객명</TableHead>
                                    <TableHead className="text-right">매출 목표</TableHead>
                                    <TableHead className="text-right">매출액</TableHead>
                                    <TableHead className='w-[150px]'>달성률</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employeeCustomerSales.map((sale) => {
                                    const achievementRate = sale.salesTarget > 0 
                                      ? (sale.salesAmount / sale.salesTarget) * 100 
                                      : (sale.salesAmount > 0 ? 100 : 0);

                                    return (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">
                                          <button onClick={() => setSelectedCustomer(sale)} className="hover:underline">
                                            {sale.customerName}
                                          </button>
                                        </TableCell>
                                        <TableCell className="text-right">${sale.salesTarget.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${sale.salesAmount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={achievementRate} className="h-2" />
                                                <span className="text-xs text-muted-foreground">{achievementRate.toFixed(1)}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setSelectedCustomer(sale)}>View Details</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

          </main>
          {selectedCustomer && (
              <CustomerSalesDetailDialog
                  isOpen={!!selectedCustomer}
                  onOpenChange={(isOpen) => !isOpen && setSelectedCustomer(null)}
                  customerName={selectedCustomer.customerName}
                  salesData={customerProductSalesDetails[selectedCustomer.id] || []}
              />
          )}
        </SidebarInset>
    </SidebarProvider>
  );
}
