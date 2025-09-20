
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { customerData as initialCustomerData, customerUploadCsvData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Customer = typeof initialCustomerData[0];

export default function CustomersPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customerData, setCustomerData] = useState<Customer[]>(initialCustomerData);
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getYearlySales = (customer: Customer, year: number) => {
    const sale = customer.yearlySales.find(s => s.year === year);
    return sale ? formatCurrency(sale.amount) : '-';
  }

  const getMonthlySales = (customer: Customer, month: number) => {
    const sale = customer.monthlySales.find(s => s.month === month);
    return sale ? { actual: formatCurrency(sale.actual), average: formatCurrency(sale.average) } : { actual: '-', average: '-' };
  }
  
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2018 }, (_, i) => currentYear - i);
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1);

  const handleCustomerTypeChange = (customerCode: string, newType: 'own' | 'transfer') => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.customerCode === customerCode
          ? { ...customer, customerType: newType }
          : customer
      )
    );
    toast({
        title: 'Customer Characteristic Changed',
        description: `Customer (${customerCode}) characteristic changed to ${newType}.`
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: 'File Selected',
        description: `Selected file: ${file.name}. Processing would start here.`,
      });
      event.target.value = '';
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([customerUploadCsvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'sample-customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Sample File Downloading",
        description: "sample-customers.csv has started downloading.",
    })
  };


  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">고객 관리</h1>
                <div className="flex items-center gap-2">
                    {role === 'manager' && (
                        <>
                             <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleDownloadSample}>
                                <Download className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Download Sample
                                </span>
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleUploadClick}>
                                <Upload className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Upload File
                                </span>
                            </Button>
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".csv"
                            />
                        </>
                    )}
                    <Button type="button" variant="outline" onClick={handleBack}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
          <Card>
            <CardHeader>
              <CardTitle>고객 목록</CardTitle>
              <CardDescription>
                담당 직원별 고객 목록, 매출 및 신용 현황입니다. 매니저는 고객 특성을 변경할 수 있습니다.
              </CardDescription>
              <div className="flex items-end gap-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="year-select">Year</Label>
                   <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="year-select" className="w-[120px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="month-select">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-select" className="w-[120px]">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                       {availableMonths.map(month => (
                        <SelectItem key={month} value={String(month)}>{month}월</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>담당 직원</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>고객 특성</TableHead>
                    <TableHead className="text-right">실제 월 매출</TableHead>
                    <TableHead className="text-right">월 평균 매출</TableHead>
                    <TableHead className="text-right">연 매출 ({selectedYear})</TableHead>
                    <TableHead className="text-right">신용 잔액 (9월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => {
                      const monthlySales = getMonthlySales(customer, parseInt(selectedMonth));
                      return (
                      <TableRow key={customer.customerCode}>
                        <TableCell>
                           <div className="font-medium">{customer.employee}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.customerCode}
                          </div>
                        </TableCell>
                         <TableCell>
                          <Badge variant="secondary">{customer.customerGrade}</Badge>
                        </TableCell>
                        <TableCell>
                            {role === 'manager' ? (
                                <Select 
                                    value={customer.customerType} 
                                    onValueChange={(value: 'own' | 'transfer') => handleCustomerTypeChange(customer.customerCode, value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="own">Own</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge variant={customer.customerType === 'own' ? 'default' : 'outline'}>
                                    {customer.customerType === 'own' ? 'Own' : 'Transfer'}
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          {monthlySales.actual}
                        </TableCell>
                        <TableCell className="text-right">
                          {monthlySales.average}
                        </TableCell>
                        <TableCell className="text-right">
                          {getYearlySales(customer, parseInt(selectedYear))}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(customer.creditBalance)}
                        </TableCell>
                      </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
