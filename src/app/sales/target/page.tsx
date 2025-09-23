
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductSale = {
  id: string;
  productName: string;
  productCode: string;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  target: number;
  quantity: number;
  isNew: boolean;
};

type CustomerSalesData = {
  customerName: string;
  customerCode: string;
  customerGrade: string;
  products: ProductSale[];
};

const getInitialData = (): CustomerSalesData[] => {
  const customerMap: { [key: string]: CustomerSalesData } = {};

  salesReportData.forEach(reportItem => {
    if (!customerMap[reportItem.customerCode]) {
      customerMap[reportItem.customerCode] = {
        customerName: reportItem.customerName,
        customerCode: reportItem.customerCode,
        customerGrade: allCustomers.find(c => c.value === reportItem.customerCode)?.grade || 'C',
        products: [],
      };
    }
  });

  return Object.values(customerMap).filter(customer => {
      const reportItems = salesReportData.filter(item => item.customerCode === customer.customerCode);
      return reportItems.length > 0 && reportItems.some(item => item.actual > 0);
  }).map(customer => {
      const reportItems = salesReportData.filter(item => item.customerCode === customer.customerCode);
      customer.products = reportItems.map(reportItem => {
          const productInfo = allProducts.find(p => p.label.toLowerCase().includes(reportItem.productName.toLowerCase()));
          return {
                id: uuidv4(),
                productName: reportItem.productName,
                productCode: productInfo?.value || 'N/A',
                sales: {
                    june: Math.floor(Math.random() * 5000), 
                    july: Math.floor(Math.random() * 5000), 
                    august: Math.floor(Math.random() * 5000)
                },
                target: reportItem.target,
                quantity: 0,
                isNew: false,
          }
      });
      return customer;
  });
};

const getProductPrice = (productCode: string, customerGrade: string) => {
    const product = allProducts.find(p => p.value === productCode);
    if (!product) return 0;

    const basePrice = product.basePrice;
    let discount = 0;
    switch (customerGrade) {
        case 'A': discount = 0.1; break;
        case 'B': discount = 0.05; break;
    }
    return basePrice * (1 - discount);
};

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [data, setData] = useState<CustomerSalesData[]>([]);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    setData(getInitialData());
  }, []);

  const handleProductChange = useCallback((customerIndex: number, productIndex: number, newProductCode: string) => {
    setData(prevData => {
      const newData = [...prevData];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];
      
      const selectedProduct = allProducts.find(p => p.value === newProductCode);
      if (selectedProduct) {
        product.productName = selectedProduct.label;
        product.productCode = selectedProduct.value;

        // Recalculate target when product changes
        const unitPrice = getProductPrice(selectedProduct.value, customer.customerGrade);
        product.target = unitPrice * product.quantity;
      }
      return newData;
    });
  }, []);

  const handleQuantityChange = useCallback((customerIndex: number, productIndex: number, quantity: number) => {
    setData(prevData => {
      const newData = [...prevData];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];

      product.quantity = quantity;
      const unitPrice = getProductPrice(product.productCode, customer.customerGrade);
      product.target = unitPrice * quantity;
      return newData;
    });
  }, []);
  
  const handleAddProduct = (customerIndex: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.push({
        id: uuidv4(),
        productName: '',
        productCode: '',
        sales: { june: 0, july: 0, august: 0 },
        target: 0,
        quantity: 0,
        isNew: true,
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
  
  const handleSaveChanges = () => {
    // Logic to save changes
    console.log('Saving changes:', data);
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated.',
    });
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  const handleAddCustomer = () => {
    setData(prevData => [
      ...prevData,
      {
        customerName: '',
        customerCode: '',
        customerGrade: '',
        products: [{
          id: uuidv4(),
          productName: '',
          productCode: '',
          sales: { june: 0, july: 0, august: 0 },
          target: 0,
          quantity: 0,
          isNew: true,
        }]
      }
    ]);
  };
  
  const handleCustomerChange = (customerIndex: number, newCustomerValue: string) => {
      setData(prevData => {
          const newData = [...prevData];
          const customerData = newData[customerIndex];
          const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerValue.toLowerCase());

          if (selectedCustomer) {
              customerData.customerName = selectedCustomer.label;
              customerData.customerCode = selectedCustomer.value;
              customerData.customerGrade = selectedCustomer.grade;
          } else {
              // It's a new customer being typed
              customerData.customerName = newCustomerValue;
              customerData.customerCode = 'NEW-CUST'; // Placeholder
              customerData.customerGrade = 'C'; // Default grade
          }
          
          // Recalculate targets for all products for this customer
          customerData.products.forEach(product => {
              if(product.productCode) {
                  const unitPrice = getProductPrice(product.productCode, customerData.customerGrade);
                  product.target = unitPrice * product.quantity;
              }
          });

          return newData;
      });
  };

  const handleAddNewCustomerOption = (newCustomerName: string, customerIndex: number) => {
    // This function is a bit tricky in this structure, as we need to update `allCustomers` state
    // For now, let's just optimistically update the UI
    const newCustomer = {
        value: newCustomerName.toLowerCase().replace(/\s/g, '-'),
        label: newCustomerName
    };
    // Note: This won't persist `allCustomers` between renders. A more robust solution
    // would involve lifting state up or using a global state manager.
    handleCustomerChange(customerIndex, newCustomer.label);
  };


  if (!role) {
    return null; // or a loading skeleton
  }

  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);
  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 목표 설정</CardTitle>
              <CardDescription>
                고객 및 제품별로 9월 매출 목표를 설정합니다. 수량 입력 시 목표 금액이 자동 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">고객명</TableHead>
                    <TableHead className="w-[20%]">제품명</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="text-right w-[10%]">수량</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <Fragment key={item.customerCode || customerIndex}>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length} className="align-top font-medium">
                              {item.isNew || !item.customerCode ? (
                                <Combobox
                                    items={customerOptions}
                                    value={item.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    placeholder="Select customer"
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="No customer found."
                                    onAddNew={(newCust) => handleAddNewCustomerOption(newCust, customerIndex)}
                                />
                              ) : (
                                  <div>
                                      <div>{item.customerName}</div>
                                      <div className="text-xs text-muted-foreground">{item.customerCode}</div>
                                  </div>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="align-top">
                            {product.isNew ? (
                              <Combobox
                                items={productOptions}
                                value={product.productName}
                                onValueChange={(value) => {
                                  const selectedProduct = allProducts.find(p => p.label.toLowerCase() === value.toLowerCase());
                                  handleProductChange(customerIndex, productIndex, selectedProduct?.value || '');
                                }}
                                placeholder="Select product"
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                              />
                            ) : (
                              <div>
                                <div>{product.productName}</div>
                                <div className="text-xs text-muted-foreground">{product.productCode}</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right align-top">${product.sales.june.toLocaleString()}</TableCell>
                          <TableCell className="text-right align-top">${product.sales.july.toLocaleString()}</TableCell>
                          <TableCell className="text-right align-top">${product.sales.august.toLocaleString()}</TableCell>
                          <TableCell className="text-right align-top">
                            <Input
                              type="number"
                              className="h-8 text-right"
                              placeholder="0"
                              value={product.quantity || ''}
                              onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell className="text-right align-top font-semibold">
                            ${product.target.toLocaleString()}
                          </TableCell>
                           <TableCell className="align-top">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={8} className="py-1 px-2">
                           <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customerIndex)}>
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
            <CardFooter className="justify-between border-t p-6">
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
