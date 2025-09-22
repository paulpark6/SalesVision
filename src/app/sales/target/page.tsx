
'use client';
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
  salesReportData,
} from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import Link from 'next/link';


const employeeSalesTargets = [
    { name: 'Jane Smith', current: 38000, target: 45000 },
    { name: 'Alex Ray', current: 52000, target: 50000 },
    { name: 'John Doe', current: 41000, target: 40000 },
];

const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// This component will be created to manage the state of a single product row
const ProductRow = ({ product, customerIndex, productIndex, handleProductChange, handleRemoveProduct, isNewCustomer }) => {
    return (
        <TableRow key={product.id}>
             {productIndex > 0 && <td className="p-0" colSpan={4}></td>}
            {/* Product Column */}
            <TableCell className="w-[200px]">
                {product.isNew ? (
                    <Combobox
                        items={allProducts}
                        placeholder="Select product..."
                        searchPlaceholder="Search products..."
                        noResultsMessage="No product found."
                        value={product.productName}
                        onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'productName', value)}
                    />
                ) : (
                    <span className="font-medium">{product.productName}</span>
                )}
            </TableCell>

            {/* Monthly Sales */}
            <TableCell className="text-right w-[100px]">{formatCurrency(product.juneSales)}</TableCell>
            <TableCell className="text-right w-[100px]">{formatCurrency(product.julySales)}</TableCell>
            <TableCell className="text-right w-[100px]">{formatCurrency(product.augustSales)}</TableCell>
            
            {/* Target & Actual */}
            <TableCell className="text-right w-[120px]">
                <Input
                    type="number"
                    value={product.target}
                    onChange={(e) => handleProductChange(customerIndex, productIndex, 'target', parseFloat(e.target.value) || 0)}
                    className="h-8 text-right"
                />
            </TableCell>
            <TableCell className="text-right w-[120px]">
                 <Input
                    type="number"
                    value={product.actual}
                    onChange={(e) => handleProductChange(customerIndex, productIndex, 'actual', parseFloat(e.target.value) || 0)}
                    className="h-8 text-right"
                />
            </TableCell>

            {/* Actions */}
            <TableCell className="text-center w-[50px]">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    );
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  
  useEffect(() => {
    // We will initialize the data with sales from June to August
    const initialData: SalesTargetCustomer[] = salesReportData.map(c => {
        // Find the customer details from the main customer list
        const customerDetails = allCustomers.find(cust => cust.value === c.customerCode);

        // Simulate product data based on sales report
        const hasSales = c.juneSales > 0 || c.julySales > 0 || c.augustSales > 0;
        const products = hasSales ? [
            { 
                id: uuidv4(), 
                productName: 'Quantum Drive', 
                juneSales: c.juneSales,
                julySales: c.julySales,
                augustSales: c.augustSales,
                target: c.target, 
                actual: c.actual,
                isNew: false,
            },
            // Add more products if logic dictates
            ...(c.customerName === 'Cybernetics Inc.' ? [{
                id: uuidv4(), 
                productName: 'Nano Bots', 
                juneSales: 12000,
                julySales: 15000,
                augustSales: 13000,
                target: 40000, 
                actual: 30000,
                isNew: false,
            }] : [])
        ] : [];


        return {
          id: c.customerCode,
          customerName: c.customerName,
          employee: c.employeeName,
          grade: customerDetails?.grade || 'N/A',
          customerType: customerDetails?.type || 'own',
          isNew: false, // This is existing data
          products: products,
        }
    }).filter(c => c.products.length > 0); // Only show customers with product sales in June-Aug

    setCustomerData(initialData);

  }, []);

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

  const handleAddCustomer = () => {
    const newCustomer: SalesTargetCustomer = {
      id: uuidv4(),
      customerName: '',
      employee: '',
      grade: '',
      customerType: 'own',
      isNew: true,
      products: [
        { id: uuidv4(), productName: '', juneSales: 0, julySales: 0, augustSales: 0, target: 0, actual: 0, isNew: true },
      ],
    };
    setCustomerData([...customerData, newCustomer]);
  };

  const handleRemoveCustomer = (customerIndex: number) => {
    const newData = [...customerData];
    newData.splice(customerIndex, 1);
    setCustomerData(newData);
  };

  const handleCustomerChange = (index: number, field: keyof SalesTargetCustomer, value: any) => {
    const newData = [...customerData];
    if (field === 'customerName') {
        const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
        if(selectedCustomer) {
            newData[index] = {
                ...newData[index],
                customerName: selectedCustomer.label,
                id: selectedCustomer.value, // Use actual customer code for id
                grade: selectedCustomer.grade,
                customerType: selectedCustomer.type,
            };
        } else {
            // Handle case where it's a new customer not in the list
             newData[index].customerName = value;
        }
    } else {
       (newData[index] as any)[field] = value;
    }
    setCustomerData(newData);
  };

 const handleAddProduct = (customerIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      juneSales: 0,
      julySales: 0,
      augustSales: 0,
      target: 0,
      actual: 0,
      isNew: true,
    });
    setCustomerData(newData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...customerData];
    newData[customerIndex].products.splice(productIndex, 1);
    // If all products are removed, remove the customer as well, unless they were just added
    if (newData[customerIndex].products.length === 0 && !newData[customerIndex].isNew) {
        handleRemoveCustomer(customerIndex);
    } else {
        setCustomerData(newData);
    }
  };

  const handleProductChange = (customerIndex: number, productIndex: number, field: string, value: any) => {
    const newData = [...customerData];
    if (field === 'productName') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
        if (selectedProduct) {
            newData[customerIndex].products[productIndex].productName = selectedProduct.label;
        } else {
            newData[customerIndex].products[productIndex].productName = value;
        }
    } else {
        (newData[customerIndex].products[productIndex] as any)[field] = value;
    }
    setCustomerData(newData);
  };
  
  const handleSave = () => {
    toast({
        title: "Targets Saved",
        description: "The sales targets for September have been successfully saved.",
    });
  }

  const totals = useMemo(() => {
    let june = 0, july = 0, august = 0, target = 0, actual = 0;
    customerData.forEach(c => {
        c.products.forEach(p => {
            june += p.juneSales || 0;
            july += p.julySales || 0;
            august += p.augustSales || 0;
            target += p.target || 0;
            actual += p.actual || 0;
        });
    });
    return { june, july, august, target, actual };
  }, [customerData]);


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
            <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
            <div className="flex items-center gap-2">
                 <Button type="button" variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
                <Button type="button" onClick={handleSave}>
                    Save Targets
                </Button>
            </div>
          </div>
          
           {role === 'manager' && (
              <Card className='mb-8'>
                <CardHeader>
                    <CardTitle>팀원별 9월 목표 달성 현황</CardTitle>
                    <CardDescription>
                    팀원별 월간 매출 목표 달성 현황입니다. 이름을 클릭하면 상세 실적을 볼 수 있습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Sales Target</TableHead>
                                <TableHead>Current Sales</TableHead>
                                <TableHead className="w-[250px]">Achievement</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeeSalesTargets.map(emp => (
                                <TableRow key={emp.name}>
                                    <TableCell>
                                        <Link href={`/employees/${encodeURIComponent(emp.name)}`} className="font-medium hover:underline text-blue-600">
                                            {emp.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{formatCurrency(emp.target)}</TableCell>
                                    <TableCell>{formatCurrency(emp.current)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <progress
                                                className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-slate-900 [&::-moz-progress-bar]:bg-slate-900"
                                                max={emp.target}
                                                value={emp.current}
                                            />
                                            <span className="text-sm font-medium w-16 text-right">{((emp.current / emp.target) * 100).toFixed(1)}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
           )}

          <Card>
            <CardHeader>
              <CardTitle>고객별/제품별 목표 설정</CardTitle>
              <CardDescription>
                6-8월 실적을 바탕으로 9월의 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">고객명</TableHead>
                      <TableHead className="w-[120px]">담당자</TableHead>
                      <TableHead className="w-[80px]">등급</TableHead>
                      <TableHead className="w-[100px]">고객 특성</TableHead>
                      <TableHead className="w-[200px]">제품</TableHead>
                      <TableHead className="text-right w-[100px]">6월</TableHead>
                      <TableHead className="text-right w-[100px]">7월</TableHead>
                      <TableHead className="text-right w-[100px]">8월</TableHead>
                      <TableHead className="text-right w-[120px]">9월 목표</TableHead>
                      <TableHead className="text-right w-[120px]">9월 실적</TableHead>
                      <TableHead className="text-center w-[50px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <>
                              <TableCell rowSpan={customer.products.length + 1} className="align-top border-r font-medium w-[150px]">
                                {customer.isNew ? (
                                  <Combobox
                                    items={allCustomers}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="No customer found."
                                    value={customer.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, 'customerName', value)}
                                  />
                                ) : (
                                  customer.customerName
                                )}
                              </TableCell>
                              <TableCell rowSpan={customer.products.length + 1} className="align-top border-r w-[120px]">{customer.employee}</TableCell>
                              <TableCell rowSpan={customer.products.length + 1} className="align-top border-r w-[80px]">{customer.grade}</TableCell>
                              <TableCell rowSpan={customer.products.length + 1} className="align-top border-r w-[100px]">{customer.customerType}</TableCell>
                            </>
                          )}
                          <TableCell className="font-medium w-[200px]">
                             {product.isNew ? (
                                <Combobox
                                    items={allProducts}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'productName', value)}
                                />
                            ) : (
                                product.productName
                            )}
                          </TableCell>
                          <TableCell className="text-right w-[100px]">{formatCurrency(product.juneSales)}</TableCell>
                          <TableCell className="text-right w-[100px]">{formatCurrency(product.julySales)}</TableCell>
                          <TableCell className="text-right w-[100px]">{formatCurrency(product.augustSales)}</TableCell>
                          <TableCell className="text-right w-[120px]">
                            <Input type="number" value={product.target} onChange={(e) => handleProductChange(customerIndex, productIndex, 'target', parseFloat(e.target.value) || 0)} className="h-8 text-right" />
                          </TableCell>
                          <TableCell className="text-right w-[120px]">
                            <Input type="number" value={product.actual} onChange={(e) => handleProductChange(customerIndex, productIndex, 'actual', parseFloat(e.target.value) || 0)} className="h-8 text-right" />
                          </TableCell>
                          <TableCell className="text-center w-[50px]">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                         <td colSpan={4} className="p-0"></td>
                         <TableCell colSpan={7} className="pt-2 pb-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddProduct(customerIndex)}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add Product
                            </Button>
                        </TableCell>
                      </TableRow>
                      {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={11} className='p-0'>
                                <div className="border-t my-2"></div>
                            </TableCell>
                          </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totals.june)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totals.july)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totals.august)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totals.actual)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
           <div className="flex justify-start mt-4">
                <Button type="button" variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
