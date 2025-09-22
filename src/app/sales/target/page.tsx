
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  customers as allCustomers,
  products as allProducts,
  salesReportData as salesTargetInitialData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer, SalesTargetProduct } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();
  const role = auth?.role;

  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initialData: SalesTargetCustomer[] = salesTargetInitialData.map(c => ({
      id: c.customerCode,
      customerName: c.customerName,
      isNew: false,
      products: [{
          id: uuidv4(),
          productName: 'Default Product',
          lastYearActual: c.actual, // Using report actual as last year's
          juneSales: c.actual * 0.3, // Mocking month data
          julySales: c.actual * 0.4,
          augustSales: c.actual * 0.3,
          septemberTarget: c.target,
          isNew: false,
      }]
    }));
    setCustomerData(initialData);
  }, []);
  
  const handleCustomerNameChange = useCallback((customerId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId ? { ...customer, customerName: newName } : customer
      )
    );
  }, []);

  const handleProductNameChange = useCallback((customerId: string, productId: string, newName: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.map(product =>
                product.id === productId ? { ...product, productName: newName } : product
              ),
            }
          : customer
      )
    );
  }, []);

  const handleTargetChange = useCallback((customerId: string, productId: string, newTarget: number) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: customer.products.map(product =>
                product.id === productId ? { ...product, septemberTarget: newTarget } : product
              ),
            }
          : customer
      )
    );
  }, []);

  const handleAddProduct = useCallback((customerId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer =>
        customer.id === customerId
          ? {
              ...customer,
              products: [
                ...customer.products,
                {
                  id: uuidv4(),
                  productName: '',
                  lastYearActual: 0,
                  juneSales: 0,
                  julySales: 0,
                  augustSales: 0,
                  septemberTarget: 0,
                  isNew: true,
                },
              ],
            }
          : customer
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
    setCustomerData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.filter(p => p.id !== productId);
          // If it's the last product for that customer, remove the customer as well
          if (updatedProducts.length === 0) {
            return null;
          }
          return { ...customer, products: updatedProducts };
        }
        return customer;
      }).filter((c): c is SalesTargetCustomer => c !== null)
    );
  }, []);

  const handleAddCustomer = useCallback(() => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          productName: '',
          lastYearActual: 0,
          juneSales: 0,
          julySales: 0,
          augustSales: 0,
          septemberTarget: 0,
          isNew: true,
        },
      ],
    };
    setCustomerData(prevData => [...prevData, newCustomer]);
  }, []);

  const handleRemoveCustomer = useCallback((customerId: string) => {
    setCustomerData(prevData => prevData.filter(c => c.id !== customerId));
  }, []);

  const handleSubmit = () => {
    toast({
      title: '성공',
      description: '매출 목표가 성공적으로 제출되었습니다.',
    });
  };

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!isMounted) {
    return null; 
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
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <Button onClick={handleSubmit}>목표 제출</Button>
          </div>
          
          {role === 'admin' && (
             <Card>
              <CardHeader>
                <CardTitle>담당자 요약</CardTitle>
                <CardDescription>
                  팀원별 월간 매출 목표 달성 현황입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                    {employeeSalesTargets.map((employee) => {
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
          )}

          <Card>
            <CardHeader>
              <CardTitle>고객별/제품별 목표 설정</CardTitle>
              <CardDescription>
                6월-8월 실적을 바탕으로 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품명</TableHead>
                    <TableHead className="text-right">전년 실적</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px]">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) =>
                    customer.products.map((product, productIndex) => (
                      <TableRow key={product.id}>
                        {productIndex === 0 && (
                          <TableCell rowSpan={customer.products.length} className="align-top border-r">
                            <div className="flex items-start gap-2">
                              {customer.isNew ? (
                                <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택"
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerNameChange(customer.id, value)}
                                />
                              ) : (
                                <span className="font-medium mt-2">{customer.customerName}</span>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 mt-0.5"
                                onClick={() => handleRemoveCustomer(customer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                             <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleAddProduct(customer.id)}
                              >
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                제품 추가
                              </Button>
                          </TableCell>
                        )}
                        <TableCell>
                           {product.productName && !product.isNew ? (
                            <span>{product.productName}</span>
                           ) : (
                            <Combobox
                                items={productOptions}
                                placeholder="제품 선택"
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productName}
                                onValueChange={(value) => handleProductNameChange(customer.id, product.id, value)}
                            />
                           )}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.lastYearActual)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={product.septemberTarget}
                            onChange={(e) => handleTargetChange(customer.id, product.id, parseInt(e.target.value) || 0)}
                            className="text-right h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveProduct(customer.id, product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-start border-t pt-6">
              <Button onClick={handleAddCustomer}>
                 <PlusCircle className="mr-2 h-4 w-4"/>
                고객 추가
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
