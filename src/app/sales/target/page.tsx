
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductRow = {
    id: string;
    productName: string;
    avgSales: number;
    quantity: number;
    unitPrice: number;
    target: number;
    hasHistory: boolean;
};

type CustomerData = {
    customerCode: string;
    customerName: string;
    products: ProductRow[];
    hasHistory: boolean;
};

const getInitialData = (): CustomerData[] => {
    const customerMap: { [key: string]: CustomerData } = {};

    // Filter customers who have sales data
    const customersWithSales = allCustomers.filter(c => 
        salesReportData.some(sr => sr.customerCode === c.value)
    );

    customersWithSales.forEach(customer => {
        if (!customerMap[customer.value]) {
            customerMap[customer.value] = {
                customerCode: customer.value,
                customerName: customer.label,
                products: [],
                hasHistory: true,
            };
        }

        // Since salesReportData doesn't have product details, we'll add a placeholder product for demonstration.
        // In a real app, you would fetch actual product sales for that customer.
        const existingProductsCount = customerMap[customer.value].products.length;
        if (existingProductsCount === 0) {
            const saleInfo = salesReportData.find(sr => sr.customerCode === customer.value);
            const avgSales = saleInfo ? (saleInfo.actual / 3) : 0; // Mock average over 3 months
            const defaultProduct = allProducts[0];
            const unitPrice = defaultProduct.basePrice;
            const quantity = avgSales > 0 && unitPrice > 0 ? Math.round(avgSales / unitPrice) : 10;
            
            customerMap[customer.value].products.push({
                id: uuidv4(),
                productName: defaultProduct.label,
                avgSales: avgSales,
                quantity: quantity,
                unitPrice: unitPrice,
                target: quantity * unitPrice,
                hasHistory: true,
            });
        }
    });

    return Object.values(customerMap);
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  const [data, setData] = useState<CustomerData[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
       setData(getInitialData());
    }
  }, [auth, router]);

  const handleProductChange = useCallback((customerIndex: number, productIndex: number, field: keyof ProductRow, value: string | number) => {
    setData(prevData => {
      const newData = [...prevData];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];
      
      let newProduct: ProductRow;

      if (field === 'productName') {
         const selectedProduct = allProducts.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
         newProduct = {
            ...product,
            productName: value as string,
            unitPrice: selectedProduct ? selectedProduct.basePrice : 0,
            target: selectedProduct ? product.quantity * selectedProduct.basePrice : 0
         };
      } else if (field === 'quantity' || field === 'unitPrice') {
         const numericValue = typeof value === 'string' ? parseFloat(value) : value;
         newProduct = { ...product, [field]: numericValue };
         newProduct.target = newProduct.quantity * newProduct.unitPrice;
      } else {
         newProduct = { ...product, [field]: value };
      }
      
      customer.products[productIndex] = newProduct;
      return newData;
    });
  }, []);

  const handleCustomerChange = useCallback((customerIndex: number, value: string) => {
    setData(prevData => {
        const newData = [...prevData];
        const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
        
        if (selectedCustomer) {
            newData[customerIndex] = {
                ...newData[customerIndex],
                customerCode: selectedCustomer.value,
                customerName: selectedCustomer.label,
            };
        } else {
             newData[customerIndex] = {
                ...newData[customerIndex],
                customerCode: `new-${value}`,
                customerName: value,
            };
        }
        return newData;
    });
  }, []);


  const handleAddProduct = (customerIndex: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.push({
        id: uuidv4(),
        productName: '',
        avgSales: 0,
        quantity: 0,
        unitPrice: 0,
        target: 0,
        hasHistory: false,
      });
      return newData;
    });
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
     setData(prevData => {
      const newData = [...prevData];
      const customer = newData[customerIndex];
      if (customer.products.length > 1) {
        customer.products.splice(productIndex, 1);
      } else {
        // If it's the last product, remove the entire customer row
        newData.splice(customerIndex, 1);
      }
      return newData;
    });
  };

  const handleAddCustomer = () => {
    setData(prevData => [
      ...prevData,
      {
        customerCode: `new-${uuidv4()}`,
        customerName: '',
        products: [
          {
            id: uuidv4(),
            productName: '',
            avgSales: 0,
            quantity: 0,
            unitPrice: 0,
            target: 0,
            hasHistory: false,
          },
        ],
        hasHistory: false,
      },
    ]);
  };
  
  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved",
        description: "Your sales targets have been updated successfully.",
    })
  }

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const allCustomersWithAdd = useMemo(() => {
      return allCustomers.map(c => ({ value: c.label, label: c.label }));
  }, []);

  const allProductsWithAdd = useMemo(() => {
      return allProducts.map(p => ({ value: p.label, label: p.label }));
  }, []);

  const totalTarget = useMemo(() => {
    return data.reduce((total, customer) => {
        return total + customer.products.reduce((customerTotal, product) => customerTotal + product.target, 0);
    }, 0);
  }, [data]);

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
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                고객 및 제품별로 9월 매출 목표를 설정합니다. 기존 실적이 있는 고객은 고정 표시됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="w-[150px] text-right">3개월 평균 매출</TableHead>
                    <TableHead className="w-[120px] text-right">수량</TableHead>
                    <TableHead className="w-[150px] text-right">단가</TableHead>
                    <TableHead className="w-[150px] text-right">9월 목표</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <React.Fragment key={item.customerCode}>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length} className="align-top font-medium">
                               <Combobox
                                    items={allCustomersWithAdd}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search or add..."
                                    noResultsMessage="No customer found."
                                    value={item.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    onAddNew={(newItem) => handleCustomerChange(customerIndex, newItem)}
                                    disabled={item.hasHistory}
                                />
                            </TableCell>
                          )}
                          <TableCell>
                             <Combobox
                                items={allProductsWithAdd}
                                placeholder="Select product..."
                                searchPlaceholder="Search or add..."
                                noResultsMessage="No product found."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'productName', value)}
                                disabled={product.hasHistory}
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.avgSales)}</TableCell>
                          <TableCell className="text-right">
                             <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'quantity', e.target.value)}
                                className="h-8 text-right"
                             />
                          </TableCell>
                           <TableCell className="text-right">
                            <Input
                                type="number"
                                value={product.unitPrice}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'unitPrice', e.target.value)}
                                className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.target)}</TableCell>
                          <TableCell className="text-center align-top">
                             {productIndex === 0 && (
                                <Button variant="ghost" size="icon" onClick={() => handleAddProduct(customerIndex)} className="h-8 w-8">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                             )}
                             <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customerIndex, productIndex)} className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
               <Button variant="outline" onClick={handleAddCustomer} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </CardContent>
            <CardFooter className="justify-end font-bold text-lg pr-6">
                Total Target: {formatCurrency(totalTarget)}
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    