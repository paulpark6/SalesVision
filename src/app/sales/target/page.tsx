
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
  TableFooter
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { employees, customers as initialCustomers, products as initialProducts } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';

type ProductData = {
  id: string;
  productName: string;
  productCode: string;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  salesTarget: number;
  salesActual: number;
};

type CustomerData = {
  id: string;
  customerName: string;
  employee: string;
  products: ProductData[];
};

const initialProductData: Omit<ProductData, 'id' | 'salesActual'>[] = [
  {
    productName: 'Smartwatch',
    productCode: 'E-001',
    sales: { june: 12000, july: 15000, august: 18000 },
    salesTarget: 25000,
  },
  {
    productName: 'Wireless Headphones',
    productCode: 'E-002',
    sales: { june: 8000, july: 9000, august: 10000 },
    salesTarget: 12000,
  },
];

const initialCustomerSalesData: CustomerData[] = [
  {
    id: 'cust-1',
    customerName: 'Global Tech Inc.',
    employee: 'Jane Smith',
    products: [
      { id: 'prod-1-1', ...initialProductData[0], salesActual: 22000 },
      { id: 'prod-1-2', ...initialProductData[1], salesActual: 11500 },
    ],
  },
  {
    id: 'cust-2',
    customerName: 'Innovate Solutions',
    employee: 'Alex Ray',
    products: [
       { id: 'prod-2-1', ...initialProductData[0], sales: { june: 18000, july: 20000, august: 21000 }, salesTarget: 30000, salesActual: 28000 },
    ],
  },
    {
    id: 'cust-3',
    customerName: 'Quantum Systems',
    employee: 'John Doe',
    products: [
       { id: 'prod-3-1', productName: 'Gaming Laptop', productCode: 'E-003', sales: { june: 25000, july: 28000, august: 30000 }, salesTarget: 35000, salesActual: 32000 },
    ],
  },
];


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [salesData, setSalesData] = useState<CustomerData[]>(initialCustomerSalesData);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // --- Customer Handlers ---
  const handleAddCustomer = () => {
    const newCustomer: CustomerData = {
      id: `cust-${Date.now()}`,
      customerName: '',
      employee: '',
      products: [],
    };
    setSalesData([...salesData, newCustomer]);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setSalesData(salesData.filter(c => c.id !== customerId));
     toast({ title: 'Customer Deleted', description: 'The customer and their product targets have been removed.' });
  };

  const handleCustomerChange = (customerId: string, field: 'customerName' | 'employee', value: string) => {
    setSalesData(salesData.map(c => 
      c.id === customerId ? { ...c, [field]: value } : c
    ));
  };
  
  // --- Product Handlers ---
  const handleAddProduct = (customerId: string) => {
    const newProduct: ProductData = {
      id: `prod-${Date.now()}`,
      productName: '',
      productCode: '',
      sales: { june: 0, july: 0, august: 0 },
      salesTarget: 0,
      salesActual: 0,
    };
    setSalesData(salesData.map(c => 
      c.id === customerId ? { ...c, products: [...c.products, newProduct] } : c
    ));
  };

  const handleDeleteProduct = (customerId: string, productId: string) => {
    setSalesData(salesData.map(c => 
      c.id === customerId 
        ? { ...c, products: c.products.filter(p => p.id !== productId) } 
        : c
    ));
    toast({ title: 'Product Deleted', description: 'The product target has been removed.' });
  };

  const handleProductChange = (customerId: string, productId: string, field: keyof ProductData | `sales.${'june'|'july'|'august'}`, value: string | number) => {
    setSalesData(salesData.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          products: customer.products.map(product => {
            if (product.id === productId) {
              const updatedProduct = { ...product };
              if (typeof field === 'string' && field.startsWith('sales.')) {
                const key = field.split('.')[1] as keyof ProductData['sales'];
                updatedProduct.sales = { ...updatedProduct.sales, [key]: Number(value) };
              } else {
                 // @ts-ignore
                updatedProduct[field] = (field === 'salesTarget' || field === 'salesActual') ? Number(value) : value;
              }
              return updatedProduct;
            }
            return product;
          })
        };
      }
      return customer;
    }));
  };
  
  const handleProductSelection = (customerId: string, productId: string, selectedProductName: string) => {
    const selectedProduct = initialProducts.find(p => p.label.toLowerCase() === selectedProductName.toLowerCase());
    setSalesData(salesData.map(customer => {
        if (customer.id === customerId) {
            return {
                ...customer,
                products: customer.products.map(product => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            productName: selectedProduct ? selectedProduct.label : selectedProductName,
                            productCode: selectedProduct ? selectedProduct.value : '',
                        }
                    }
                    return product;
                })
            }
        }
        return customer;
    }));
  }

  const filteredData = useMemo(() => {
    if (selectedEmployee === 'all') {
      return salesData;
    }
    return salesData.filter(d => d.employee === selectedEmployee);
  }, [selectedEmployee, salesData]);

  const employeeSummary = useMemo(() => {
    if (selectedEmployee !== 'all') return [];
    
    const summary: {[key: string]: { target: number, actual: number }} = {};

    salesData.forEach(customer => {
        if (!summary[customer.employee]) {
            summary[customer.employee] = { target: 0, actual: 0 };
        }
        customer.products.forEach(p => {
            summary[customer.employee].target += p.salesTarget;
            summary[customer.employee].actual += p.salesActual;
        });
    });

    return Object.entries(summary).map(([name, data]) => ({
      employeeName: name,
      totalTarget: data.target,
      totalActual: data.actual,
      achievementRate: data.target > 0 ? (data.actual / data.target) * 100 : 0
    })).filter(e => e.employeeName);
  }, [salesData, selectedEmployee]);

  const customerOptions = useMemo(() => initialCustomers.map(c => ({ value: c.label, label: c.label })), []);
  const productOptions = useMemo(() => initialProducts.map(p => ({ value: p.label, label: p.label })), []);

  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별/고객별/제품별 매출 목표</h1>
             <div className="flex items-center gap-4">
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="직원 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
            </div>
          </div>
          
           {selectedEmployee === 'all' && (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>직원별 9월 실적 요약</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>담당자</TableHead>
                                <TableHead className="text-right">총 목표</TableHead>
                                <TableHead className="text-right">총 실적</TableHead>
                                <TableHead className="text-right">달성률</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeeSummary.map(emp => (
                                <TableRow key={emp.employeeName}>
                                    <TableCell className="font-medium">{emp.employeeName}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(emp.totalTarget)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(emp.totalActual)}</TableCell>
                                    <TableCell className="text-right font-bold">{emp.achievementRate.toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
           )}

          <Card>
            <CardHeader>
              <CardTitle>고객별 매출 목표</CardTitle>
              <CardDescription>
                월별/고객별/제품별 매출 목표를 설정하고 실적을 입력합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table className="min-w-max whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    {role !== 'employee' && <TableHead className="w-[150px]">담당자</TableHead>}
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품명</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="text-right w-[120px]">9월 목표</TableHead>
                    <TableHead className="text-right w-[120px]">9월 실적</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((customer, customerIndex) => (
                    <Fragment key={customer.id}>
                      <TableRow className="bg-muted/30">
                        {role !== 'employee' && (
                           <TableCell className="font-semibold">
                             <Select value={customer.employee} onValueChange={(value) => handleCustomerChange(customer.id, 'employee', value)}>
                                 <SelectTrigger className="h-8">
                                     <SelectValue placeholder="Select Employee" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     {employees.map(e => <SelectItem key={e.value} value={e.name}>{e.name}</SelectItem>)}
                                 </SelectContent>
                             </Select>
                           </TableCell>
                        )}
                        <TableCell className="font-semibold">
                           <Combobox
                                items={customerOptions}
                                value={customer.customerName}
                                onValueChange={(value) => handleCustomerChange(customer.id, 'customerName', value)}
                                placeholder="고객 선택 또는 입력"
                                searchPlaceholder="고객 검색..."
                                noResultsMessage="고객을 찾을 수 없습니다."
                            />
                        </TableCell>
                        <TableCell colSpan={role === 'employee' ? 7 : 6}></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {customer.products.map((product) => (
                        <TableRow key={product.id}>
                          {role !== 'employee' && <TableCell></TableCell>}
                          <TableCell></TableCell>
                          <TableCell>
                             <Combobox
                                items={productOptions}
                                value={product.productName}
                                onValueChange={(value) => handleProductSelection(customer.id, product.id, value)}
                                placeholder="제품 선택 또는 입력"
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 min-w-[100px] text-right"
                              value={product.salesTarget}
                              onChange={(e) => handleProductChange(customer.id, product.id, 'salesTarget', e.target.value)}
                            />
                          </TableCell>
                           <TableCell>
                            <Input
                              type="number"
                              className="h-8 min-w-[100px] text-right"
                              value={product.salesActual}
                              onChange={(e) => handleProductChange(customer.id, product.id, 'salesActual', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(customer.id, product.id)}>
                              <X className="h-5 w-5 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                          {role !== 'employee' && <TableCell></TableCell>}
                          <TableCell></TableCell>
                          <TableCell colSpan={role === 'employee' ? 7 : 6}>
                              <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  제품 추가
                              </Button>
                          </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={role === 'employee' ? 8 : 9}>
                            <Button onClick={handleAddCustomer}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                고객 추가
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
