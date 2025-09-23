
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
  CardFooter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ProductDetail = {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  target: number;
};

type CustomerTargetData = {
  customerName: string;
  customerCode: string;
  products: ProductDetail[];
  isNew: boolean;
};

const getDiscount = (grade: string | undefined) => {
    if (!grade) return 0;
    switch (grade) {
        case 'A': return 0.1; // 10%
        case 'B': return 0.05; // 5%
        default: return 0;
    }
}

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  const [data, setData] = useState<CustomerTargetData[]>([]);
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);

  const getInitialData = useCallback(() => {
    const uniqueCustomerCodes = [...new Set(salesReportData.map(item => item.customerCode))];
    
    const initialData = uniqueCustomerCodes.map(customerCode => {
      const customerInfo = allCustomers.find(c => c.value === customerCode);
      const reportItems = salesReportData.filter(item => item.customerCode === customerCode);
      
      const products: ProductDetail[] = reportItems.map(reportItem => {
         const productInfo = allProducts.find(p => p.label.toLowerCase() === reportItem.customerName.toLowerCase());
          return {
            id: uuidv4(),
            productName: reportItem.customerName, // This seems to be the product name based on previous errors
            productCode: productInfo?.value || '',
            quantity: reportItem.actual > 5000 ? Math.round(reportItem.actual / 500) : 10,
            target: reportItem.target,
          };
      });

      return {
        customerName: customerInfo?.label || 'Unknown Customer',
        customerCode: customerCode,
        products: products.length > 0 ? products : [{
            id: uuidv4(),
            productName: '',
            productCode: '',
            quantity: 1,
            target: 0
        }],
        isNew: false,
      };
    }).filter(customer => customer.products.length > 0);
    
    setData(initialData);
  }, []);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const handleAddCustomer = () => {
    setData(prevData => [
      ...prevData,
      {
        customerName: '',
        customerCode: '',
        products: [
          { id: uuidv4(), productName: '', productCode: '', quantity: 1, target: 0 }
        ],
        isNew: true
      }
    ]);
  };

  const handleAddProduct = (customerIndex: number) => {
    const newData = [...data];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      productCode: '',
      quantity: 1,
      target: 0
    });
    setData(newData);
  };
  
  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...data];
    if (newData[customerIndex].products.length > 1) {
        newData[customerIndex].products.splice(productIndex, 1);
    } else {
        newData.splice(customerIndex, 1);
    }
    setData(newData);
  };
  
  const handleCustomerChange = (customerIndex: number, newCustomerValue: string) => {
    const newData = [...data];
    const customer = allCustomers.find(c => c.label.toLowerCase() === newCustomerValue.toLowerCase());

    if(customer) {
        newData[customerIndex].customerName = customer.label;
        newData[customerIndex].customerCode = customer.value;
    } else {
        // Handle new customer typed in
        const newCustomerCode = `NEW-${newCustomerValue.substring(0,3).toUpperCase()}`;
        newData[customerIndex].customerName = newCustomerValue;
        newData[customerIndex].customerCode = newCustomerCode;
    }

    // Recalculate targets for all products of this customer
    newData[customerIndex].products.forEach(product => {
        const productInfo = allProducts.find(p => p.value === product.productCode);
        const customerInfo = allCustomers.find(c => c.value === newData[customerIndex].customerCode);

        if (productInfo) {
            const basePrice = productInfo.basePrice;
            const discount = getDiscount(customerInfo?.grade);
            const finalPrice = basePrice * (1-discount);
            product.target = finalPrice * product.quantity;
        }
    });

    setData(newData);
  };

  const handleProductChange = (customerIndex: number, productIndex: number, field: string, value: string | number) => {
    const newData = [...data];
    const product = newData[customerIndex].products[productIndex];
    let newProductName = product.productName;
    let newProductCode = product.productCode;
    let newQuantity = product.quantity;

    if (field === 'product') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
        if(selectedProduct) {
            newProductName = selectedProduct.label;
            newProductCode = selectedProduct.value;
        }
    } else if (field === 'quantity') {
        newQuantity = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    }

    const productInfo = allProducts.find(p => p.value === newProductCode);
    const customerInfo = allCustomers.find(c => c.value === newData[customerIndex].customerCode);

    let newTarget = 0;
    if(productInfo) {
        const basePrice = productInfo.basePrice;
        const discount = getDiscount(customerInfo?.grade);
        const finalPrice = basePrice * (1-discount);
        newTarget = finalPrice * newQuantity;
    }
    
    newData[customerIndex].products[productIndex] = {
        ...product,
        productName: newProductName,
        productCode: newProductCode,
        quantity: newQuantity,
        target: newTarget
    };
    
    setData(newData);
  };


  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated successfully.',
    });
  };

  const handleCancel = () => {
    getInitialData();
    toast({
      title: 'Changes Canceled',
      description: 'Your changes have been discarded.',
      variant: 'destructive',
    });
  };
  
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
          </div>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 매출 목표</CardTitle>
              <CardDescription>
                고객별로 판매할 제품과 수량을 입력하여 9월 매출 목표를 설정합니다. 단가는 고객 등급에 따라 자동 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[250px]">제품</TableHead>
                    <TableHead>6월</TableHead>
                    <TableHead>7월</TableHead>
                    <TableHead>8월</TableHead>
                    <TableHead className="text-right">수량</TableHead>
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
                               <Combobox
                                    items={customerOptions}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="No customer found."
                                    value={item.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    onAddNew={(newValue) => handleCustomerChange(customerIndex, newValue)}
                                />
                            </TableCell>
                          )}
                          <TableCell>
                             <Combobox
                                items={productOptions}
                                placeholder="Select product..."
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'product', value)}
                             />
                          </TableCell>
                          <TableCell>$0</TableCell>
                          <TableCell>$0</TableCell>
                          <TableCell>$0</TableCell>
                          <TableCell className="text-right">
                             <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleProductChange(
                                    customerIndex,
                                    productIndex,
                                    'quantity',
                                    parseInt(e.target.value)
                                  )
                                }
                                className="h-8 w-20 text-right ml-auto"
                                min="0"
                              />
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${product.target.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                                {productIndex === item.products.length - 1 && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddProduct(customerIndex)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
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
