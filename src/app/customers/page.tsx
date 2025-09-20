
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
import { useEffect, useState, useRef, useMemo, Fragment } from 'react';
import { Badge } from '@/components/ui/badge';
import { customerData as initialCustomerData, customerUploadCsvData, employees } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Upload, Users, ChevronDown, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Papa from 'papaparse';


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
  const [showMyCustomers, setShowMyCustomers] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const loggedInEmployee = useMemo(() => {
    if (!auth?.role) return null;
    return employees.find(e => e.role === auth.role) || employees.find(e => e.name === auth.name);
  },[auth]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  // Set default state for my-customers-filter based on role
  useEffect(() => {
    if (role === 'employee') {
      setShowMyCustomers(true);
    }
  }, [role]);

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
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

  const handleCustomerTypeChange = (customerCode: string, newType: 'own' | 'transfer' | 'pending') => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.customerCode === customerCode
          ? { ...customer, customerType: newType }
          : customer
      )
    );
    if (newType !== 'pending') {
      toast({
          title: 'Customer Type Approved',
          description: `Customer (${customerCode}) type set to ${newType}.`
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const newCustomers = results.data.map((row: any) => {
            const employee = employees.find(e => e.value === row.Employee);
            return {
              employee: employee ? employee.name : 'Unassigned',
              customerName: row.CustomerName,
              customerCode: row.CustomerCode,
              customerGrade: row.Grade,
              customerType: 'pending' as 'own' | 'transfer' | 'pending',
              monthlySales: [],
              yearlySales: [],
              creditBalance: 0,
              contact: {
                name: row.CustomerName,
                position: 'N/A',
                phone: 'N/A',
                address: 'N/A',
                email: null,
              },
              companyOverview: 'No overview provided.'
            } as Customer;
          }).filter(c => c.customerCode && c.customerName); // Basic validation

          setCustomerData(prev => [...prev, ...newCustomers]);

          toast({
            title: 'Upload Successful',
            description: `${newCustomers.length} new customers have been added and are pending approval.`,
          });
        },
        error: (error: any) => {
          toast({
            title: 'Upload Failed',
            description: `An error occurred: ${error.message}`,
            variant: 'destructive',
          });
        }
      });
      event.target.value = ''; // Reset file input
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

  const filteredCustomerData = useMemo(() => {
    if (role === 'employee' || (role === 'manager' && showMyCustomers)) {
      if (loggedInEmployee) {
        return customerData.filter(customer => customer.employee === loggedInEmployee.name);
      }
      return [];
    }
    return customerData;
  }, [customerData, showMyCustomers, loggedInEmployee, role]);
  
  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">고객 관리</h1>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
                        <Link href="/customers/new">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Customer
                            </span>
                        </Link>
                    </Button>
                    {(role === 'manager' || role === 'admin') && (
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
                담당 직원별 고객 목록, 매출 및 신용 현황입니다. 관리자만 고객 특성을 변경할 수 있습니다.
              </CardDescription>
              <div className="flex items-end justify-between pt-2">
                <div className="flex items-end gap-4">
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
                {role === 'manager' && (
                  <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <Label htmlFor="my-customers-filter">내 고객만 보기</Label>
                      <Switch
                          id="my-customers-filter"
                          checked={showMyCustomers}
                          onCheckedChange={setShowMyCustomers}
                      />
                  </div>
                )}
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
                    <TableHead className="text-right">당월 매출</TableHead>
                    <TableHead className="text-right">월 평균 매출</TableHead>
                    <TableHead className="text-right">연 매출 ({selectedYear})</TableHead>
                    <TableHead className="text-right">신용 잔액 (9월)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomerData.map((customer) => {
                      const monthlySales = getMonthlySales(customer, parseInt(selectedMonth));
                      const isOpen = openCollapsible === customer.customerCode;
                      return (
                        <Fragment key={customer.customerCode}>
                          <TableRow onClick={() => setOpenCollapsible(isOpen ? null : customer.customerCode)} className="cursor-pointer">
                            <TableCell>{customer.employee}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{customer.customerName}</span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                <div className="text-sm text-muted-foreground ml-auto">{customer.customerCode}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{customer.customerGrade}</Badge>
                            </TableCell>
                            <TableCell>
                                {customer.customerType === 'pending' ? (
                                    role === 'admin' ? (
                                        <Select
                                            onValueChange={(value: 'own' | 'transfer' | 'pending') => handleCustomerTypeChange(customer.customerCode, value)}
                                        >
                                            <SelectTrigger className="h-8 w-[130px] bg-yellow-100 dark:bg-yellow-900/50">
                                                <SelectValue placeholder="Pending Approval" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="own">Approve as Own</SelectItem>
                                                <SelectItem value="transfer">Approve as Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant="secondary">Pending Approval</Badge>
                                    )
                                ) : role === 'admin' ? (
                                    <Select
                                        value={customer.customerType}
                                        onValueChange={(value: 'own' | 'transfer' | 'pending') => handleCustomerTypeChange(customer.customerCode, value)}
                                    >
                                        <SelectTrigger className="h-8 w-[100px]">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="own">Own</SelectItem>
                                            <SelectItem value="transfer">Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge variant={customer.customerType === 'own' ? 'default' : 'secondary'}>
                                        {customer.customerType === 'own' ? 'Own' : 'Transfer'}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">{monthlySales.actual}</TableCell>
                            <TableCell className="text-right">{monthlySales.average}</TableCell>
                            <TableCell className="text-right">{getYearlySales(customer, parseInt(selectedYear))}</TableCell>
                            <TableCell className="text-right">{formatCurrency(customer.creditBalance)}</TableCell>
                          </TableRow>
                          {isOpen && (
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={8}>
                                  <div className="grid grid-cols-2 gap-4 p-4">
                                      <Card>
                                          <CardHeader>
                                              <CardTitle className="text-base">Contact Point</CardTitle>
                                          </CardHeader>
                                          <CardContent className="text-sm space-y-2">
                                              <p><span className="font-semibold">Name:</span> {customer.contact.name}</p>
                                              <p><span className="font-semibold">Position:</span> {customer.contact.position}</p>
                                              <p><span className="font-semibold">Phone:</span> {customer.contact.phone}</p>
                                              <p><span className="font-semibold">Address:</span> {customer.contact.address}</p>
                                              {customer.contact.email && <p><span className="font-semibold">Email:</span> {customer.contact.email}</p>}
                                          </CardContent>
                                      </Card>
                                      <Card>
                                          <CardHeader>
                                              <CardTitle className="text-base">Company Overview</CardTitle>
                                          </CardHeader>
                                          <CardContent className="text-sm">
                                              {customer.companyOverview}
                                          </CardContent>
                                      </Card>
                                  </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
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
