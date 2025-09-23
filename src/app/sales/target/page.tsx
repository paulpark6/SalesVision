
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
  CardFooter,
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductEntry = {
  id: string;
  productName: string;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  quantity: number;
  targetAmount: number;
  isNew: boolean;
};

type CustomerData = {
  customerCode: string;
  customerName: string;
  customerGrade: string;
  products: ProductEntry[];
};

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
};

const getInitialData = (): CustomerData[] => {
    const customerProductSales = [
      { customerCode: "C-101", productName: "Laptop Pro", sales: { june: 5000, july: 5500, august: 6000 } },
      { customerCode: "C-101", productName: "Wireless Mouse", sales: { june: 300, july: 400, august: 350 } },
      { customerCode: "C-102", productName: "Laptop Pro", sales: { june: 8000, july: 8200, august: 7800 } },
      { customerCode: "C-103", productName: "Docking Station", sales: { june: 1500, july: 1600, august: 1550 } },
    ];

    const uniqueCustomerCodesWithSales = [...new Set(customerProductSales.map(item => item.customerCode))];
    
    const customersWithSales = allCustomers.filter(c => uniqueCustomerCodesWithSales.includes(c.value));

    const initialData = customersWithSales.map(customer => {
        const productsForCustomer = customerProductSales
            .filter(sale => sale.customerCode === customer.value)
            .map(sale => ({
                id: uuidv4(),
                productName: sale.productName,
                sales: sale.sales,
                quantity: 0,
                targetAmount: 0,
                isNew: false,
            }));

        return {
            customerCode: customer.value,
            customerName: customer.label,
            customerGrade: customer.grade,
            products: productsForCustomer,
        };
    });

    return initialData;
};


export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const [data, setData] = useState<CustomerData[]>([]);

  const role = auth?.role;

  useEffect(() => {
    setData(getInitialData());
  }, []);

  const handleProductChange = (customerIndex: number, productIndex: number, newProductName: string) => {
    const newData = [...data];
    const productInfo = allProducts.find(p => p.label.toLowerCase() === newProductName.toLowerCase());
    
    if (productInfo) {
      newData[customerIndex].products[productIndex].productName = productInfo.label;
      const customerGrade = newData[customerIndex].customerGrade;
      const basePrice = productInfo.basePrice;
      const discount = getDiscount(customerGrade);
      const finalPrice = basePrice * (1 - discount);
      const quantity = newData[customerIndex].products[productIndex].quantity;
      newData[customerIndex].products[productIndex].targetAmount = quantity * finalPrice;
    }
    
    setData(newData);
  };
  
  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    const newData = [...data];
    const productEntry = newData[customerIndex].products[productIndex];
    const productInfo = allProducts.find(p => p.label === productEntry.productName);

    if (productInfo) {
      const customerGrade = newData[customerIndex].customerGrade;
      const basePrice = productInfo.basePrice;
      const discount = getDiscount(customerGrade);
      const finalPrice = basePrice * (1 - discount);
      
      productEntry.quantity = quantity;
      productEntry.targetAmount = quantity * finalPrice;
      setData(newData);
    }
  };

  const handleAddProduct = (customerIndex: number) => {
    const newData = [...data];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      sales: { june: 0, july: 0, august: 0 },
      quantity: 0,
      targetAmount: 0,
      isNew: true,
    });
    setData(newData);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...data];
    newData[customerIndex].products.splice(productIndex, 1);
    setData(newData);
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Success',
      description: 'Sales targets have been saved successfully.',
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddCustomer = () => {
    setData(prevData => [
      ...prevData,
      {
        customerCode: '',
        customerName: '',
        customerGrade: '',
        products: [
          {
            id: uuidv4(),
            productName: '',
            sales: { june: 0, july: 0, august: 0 },
            quantity: 0,
            targetAmount: 0,
            isNew: true,
          },
        ],
      },
    ]);
  };
  
  const handleCustomerChange = (customerIndex: number, newCustomerLabel: string) => {
    const newData = [...data];
    const customerInfo = allCustomers.find(c => c.label.toLowerCase() === newCustomerLabel.toLowerCase());
    
    if (customerInfo) {
      newData[customerIndex].customerName = customerInfo.label;
      newData[customerIndex].customerCode = customerInfo.value;
      newData[customerIndex].customerGrade = customerInfo.grade;
    } else {
      // Handle new customer typed in
      const newCustomerCode = `C-${Math.floor(Math.random() * 900) + 100}`;
      newData[customerIndex].customerName = newCustomerLabel;
      newData[customerIndex].customerCode = newCustomerCode;
      newData[customerIndex].customerGrade = 'C'; // Default grade
    }
    
    // Recalculate prices for existing products for this customer
    newData[customerIndex].products.forEach((product, productIndex) => {
      const productInfo = allProducts.find(p => p.label === product.productName);
      if (productInfo) {
        const basePrice = productInfo.basePrice;
        const discount = getDiscount(newData[customerIndex].customerGrade);
        const finalPrice = basePrice * (1 - discount);
        const quantity = product.quantity;
        newData[customerIndex].products[productIndex].targetAmount = quantity * finalPrice;
      }
    });

    setData(newData);
  };


  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);

  if (!role) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>월별/제품별 매출 목표</CardTitle>
              <CardDescription>
                고객 및 제품별 과거 3개월 매출을 기반으로 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">고객명</TableHead>
                    <TableHead>제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[100px]">수량</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <Fragment key={item.customerCode || customerIndex}>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length} className="align-top font-medium">
                               { (item.customerCode === '') ? (
                                    <Combobox
                                      items={customerOptions}
                                      value={item.customerName}
                                      onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                      placeholder="Select or add customer"
                                      searchPlaceholder="Search customers..."
                                      noResultsMessage="No customer found."
                                      onAddNew={(newCustomer) => handleCustomerChange(customerIndex, newCustomer)}
                                    />
                                ) : (
                                  <>
                                    <div>{item.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{item.customerCode} ({item.customerGrade})</div>
                                  </>
                                )}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                <Combobox
                                    items={productOptions}
                                    value={product.productName}
                                    onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                                    placeholder="Select a product"
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="Product not found."
                                />
                            ) : (
                              product.productName
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.sales.august)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 text-right"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(product.targetAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                         <TableCell colSpan={8} className="p-1">
                            <Button variant="link" size="sm" onClick={() => handleAddProduct(customerIndex)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                         </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
