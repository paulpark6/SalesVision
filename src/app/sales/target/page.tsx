
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductRow = {
  id: string;
  productName: string;
  productCode?: string;
  juneSales: number;
  julySales: number;
  augustSales: number;
  quantity: number;
  unitPrice: number;
  septemberTarget: number;
  isFixed: boolean; // Add isFixed to track if the product is from existing data
};

type CustomerData = {
  customerCode: string;
  customerName: string;
  products: ProductRow[];
  isFixed: boolean; // Add isFixed to track if the customer is from existing data
};

const getInitialData = (): CustomerData[] => {
    const customerMap: { [key: string]: CustomerData } = {};

    salesReportData.forEach(sale => {
        if (!customerMap[sale.customerCode]) {
            const customerInfo = allCustomers.find(c => c.value === sale.customerCode);
            customerMap[sale.customerCode] = {
                customerCode: sale.customerCode,
                customerName: customerInfo?.label || sale.customerName,
                products: [],
                isFixed: true,
            };
        }
        
        const productInfo = allProducts.find(p => p.label.toLowerCase().includes(sale.productName.toLowerCase()));

        customerMap[sale.customerCode].products.push({
            id: uuidv4(),
            productName: sale.productName,
            productCode: productInfo?.value || '',
            juneSales: sale.juneSales,
            julySales: sale.julySales,
            augustSales: sale.augustSales,
            quantity: 1, // Default quantity
            unitPrice: sale.unitPrice,
            septemberTarget: sale.unitPrice, // Default target
            isFixed: true, // This product row is from existing data
        });
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
  
  const handleCustomerChange = useCallback((customerIndex: number, newCustomerCode: string) => {
    const selectedCustomer = allCustomers.find(c => c.value === newCustomerCode);
    if (!selectedCustomer) return;

    setData(prevData => {
        const newData = [...prevData];
        newData[customerIndex] = {
            ...newData[customerIndex],
            customerCode: selectedCustomer.value,
            customerName: selectedCustomer.label,
        };
        return newData;
    });
  }, []);
  
  const handleAddNewCustomer = useCallback((customerIndex: number, newCustomerName: string) => {
    const newCustomerCode = `C-${(allCustomers.length + 1 + Math.random()).toString().slice(2, 6)}`;
    const newCustomer = { value: newCustomerCode, label: newCustomerName };
    allCustomers.push(newCustomer);

    setData(prevData => {
        const newData = [...prevData];
        newData[customerIndex] = {
            ...newData[customerIndex],
            customerCode: newCustomer.value,
            customerName: newCustomer.label,
        };
        return newData;
    });
    toast({
        title: "New Customer Added",
        description: `${newCustomerName} has been temporarily added to the list.`
    });
  }, [toast]);

  const handleProductChange = useCallback((customerIndex: number, productIndex: number, field: keyof ProductRow, value: any, productCode?: string) => {
      setData(prevData => {
          const newData = [...prevData];
          const customer = newData[customerIndex];
          const product = customer.products[productIndex];
          
          if (field === 'quantity' || field === 'unitPrice') {
              const numericValue = Number(value) || 0;
              (product[field] as number) = numericValue;
              product.septemberTarget = product.quantity * product.unitPrice;
          } else {
              (product[field] as any) = value;
          }
          
          if (field === 'productName' && productCode) {
              product.productCode = productCode;
          }

          return newData;
      });
  }, []);
  
  const handleAddNewProduct = useCallback((customerIndex: number, productIndex: number, newProductName: string) => {
    const newProductValue = newProductName.toLowerCase().replace(/\s+/g, '-');
    const newProduct = { value: newProductValue, label: newProductName, basePrice: 0 };
    allProducts.push(newProduct);
    
    handleProductChange(customerIndex, productIndex, 'productName', newProductName, newProductValue);

    toast({
        title: "New Product Added",
        description: `${newProductName} has been temporarily added to the list.`
    });
  }, [handleProductChange, toast]);

  const handleAddProduct = (customerIndex: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.push({
        id: uuidv4(),
        productName: '',
        juneSales: 0,
        julySales: 0,
        augustSales: 0,
        quantity: 1,
        unitPrice: 0,
        septemberTarget: 0,
        isFixed: false,
      });
      return newData;
    });
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.splice(productIndex, 1);
      // If last product for a customer is removed, remove the customer
      if (newData[customerIndex].products.length === 0) {
          newData.splice(customerIndex, 1);
      }
      return newData;
    });
  };
  
  const handleAddCustomer = () => {
    setData(prevData => [
        ...prevData,
        {
            customerCode: '',
            customerName: '',
            products: [{
                id: uuidv4(),
                productName: '',
                juneSales: 0,
                julySales: 0,
                augustSales: 0,
                quantity: 1,
                unitPrice: 0,
                septemberTarget: 0,
                isFixed: false,
            }],
            isFixed: false,
        }
    ]);
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleSave = () => {
    toast({
        title: "Changes Saved",
        description: "Your sales targets have been updated.",
    });
    handleBack();
  };
  
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

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
              <CardTitle>고객별, 제품별 목표 설정</CardTitle>
              <CardDescription>
                6, 7, 8월 실적이 있는 고객 및 제품은 고정되어 있으며, 신규 목표를 추가할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">고객명</TableHead>
                    <TableHead className="w-[20%]">제품명</TableHead>
                    <TableHead className="text-right">6월 실적</TableHead>
                    <TableHead className="text-right">7월 실적</TableHead>
                    <TableHead className="text-right">8월 실적</TableHead>
                    <TableHead className="w-24 text-right">수량</TableHead>
                    <TableHead className="w-32 text-right">단가</TableHead>
                    <TableHead className="w-32 text-right">9월 목표</TableHead>
                    <TableHead className="w-20 text-center">Actions</TableHead>
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
                                    searchPlaceholder="Search customer..."
                                    noResultsMessage="No customer found."
                                    value={item.customerName}
                                    onValueChange={(newValue) => {
                                        const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newValue.toLowerCase());
                                        if (selectedCustomer) {
                                            handleCustomerChange(customerIndex, selectedCustomer.value);
                                        }
                                    }}
                                    onAddNew={(newCustomerName) => handleAddNewCustomer(customerIndex, newCustomerName)}
                                    disabled={item.isFixed}
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
                                onValueChange={(newValue) => {
                                    const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newValue.toLowerCase());
                                    handleProductChange(customerIndex, productIndex, 'productName', newValue, selectedProduct?.value);
                                }}
                                onAddNew={(newProductName) => handleAddNewProduct(customerIndex, productIndex, newProductName)}
                                disabled={product.isFixed}
                            />
                          </TableCell>
                          <TableCell className="text-right">${product.juneSales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${product.julySales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${product.augustSales.toLocaleString()}</TableCell>
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
                          <TableCell className="text-right font-medium">${product.septemberTarget.toLocaleString()}</TableCell>
                           <TableCell className="text-center">
                            {productIndex === 0 ? (
                                 <div className="flex gap-1 justify-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddProduct(customerIndex)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemoveProduct(customerIndex, productIndex)} disabled={product.isFixed}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemoveProduct(customerIndex, productIndex)} disabled={product.isFixed}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-6">
                <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleBack}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    