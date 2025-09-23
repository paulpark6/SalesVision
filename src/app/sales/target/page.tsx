
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
import { salesTargetPageData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductSale = {
  id: string;
  productCode: string;
  productName: string;
  june: number;
  july: number;
  august: number;
  quantity: number;
  target: number;
  isNew: boolean;
};

type ProcessedDataItem = {
  customerName: string;
  customerCode: string;
  products: ProductSale[];
};

// This function simulates fetching and processing initial data
const getInitialData = () => {
    const groupedByCustomer: Record<string, ProcessedDataItem> = {};

    salesTargetPageData.forEach(item => {
        // Only include customers with actual sales
        if (item.sales.june > 0 || item.sales.july > 0 || item.sales.august > 0) {
            if (!groupedByCustomer[item.customerName]) {
                groupedByCustomer[item.customerName] = {
                    customerName: item.customerName,
                    customerCode: item.customerCode,
                    products: [],
                };
            }
            groupedByCustomer[item.customerName].products.push({
                id: `${item.customerCode}-${item.product.productCode}`,
                productCode: item.product.productCode,
                productName: item.product.productName,
                june: item.sales.june,
                july: item.sales.july,
                august: item.sales.august,
                quantity: 0,
                target: 0,
                isNew: false,
            });
        }
    });

    return Object.values(groupedByCustomer);
};


const getProductPrice = (productCode: string, customerCode: string) => {
    const product = allProducts.find(p => p.value === productCode);
    const customer = allCustomers.find(c => c.value === customerCode);
    if (!product || !customer) return 0;

    const basePrice = product.basePrice;
    let discount = 0;
    switch (customer.grade) {
        case 'A': discount = 0.1; break; // 10%
        case 'B': discount = 0.05; break; // 5%
    }
    return basePrice * (1 - discount);
}

export default function SalesTargetPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  
  const [data, setData] = useState<ProcessedDataItem[]>([]);
  
  useEffect(() => {
    setData(getInitialData());
  }, []);


  const handleAddProduct = (customerCode: string) => {
    setData(prevData =>
      prevData.map(customer => {
        if (customer.customerCode === customerCode) {
          const newProduct: ProductSale = {
            id: uuidv4(),
            productCode: '',
            productName: '',
            june: 0,
            july: 0,
            august: 0,
            quantity: 0,
            target: 0,
            isNew: true,
          };
          return { ...customer, products: [...customer.products, newProduct] };
        }
        return customer;
      })
    );
  };
  
  const handleAddCustomer = () => {
    const newCustomer: ProcessedDataItem = {
      customerCode: '',
      customerName: '',
      products: [
        {
          id: uuidv4(),
          productCode: '',
          productName: '',
          june: 0,
          july: 0,
          august: 0,
          quantity: 0,
          target: 0,
          isNew: true,
        },
      ],
    };
    setData(prevData => [...prevData, newCustomer]);
  };

  const handleRemoveProduct = (customerCode: string, productId: string) => {
    setData(prevData =>
      prevData.map(customer => {
        if (customer.customerCode === customerCode) {
          const updatedProducts = customer.products.filter(p => p.id !== productId);
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  };
  
  const handleProductChange = useCallback((customerCode: string, productId: string, newProductCode: string) => {
    const selectedProduct = allProducts.find(p => p.value === newProductCode);
    if (!selectedProduct) return;

    setData(prevData =>
      prevData.map(customer => {
        if (customer.customerCode === customerCode) {
          const newProducts = customer.products.map(p => {
            if (p.id === productId) {
              const unitPrice = getProductPrice(newProductCode, customerCode);
              const newTarget = p.quantity * unitPrice;
              return { ...p, productCode: newProductCode, productName: selectedProduct.label, target: newTarget };
            }
            return p;
          });
          return { ...customer, products: newProducts };
        }
        return customer;
      })
    );
  }, []);

  const handleQuantityChange = useCallback((customerCode: string, productId: string, newQuantity: number) => {
    setData(prevData =>
      prevData.map(customer => {
        if (customer.customerCode === customerCode) {
          const newProducts = customer.products.map(p => {
            if (p.id === productId) {
              const unitPrice = getProductPrice(p.productCode, customer.customerCode);
              const newTarget = newQuantity * unitPrice;
              return { ...p, quantity: newQuantity, target: newTarget };
            }
            return p;
          });
          return { ...customer, products: newProducts };
        }
        return customer;
      })
    );
  }, []);
  
  const handleCustomerChange = (currentCustomerCode: string, newCustomerValue: string) => {
      const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerValue.toLowerCase());
      if(selectedCustomer) {
        setData(prevData => prevData.map(customer => {
            if(customer.customerCode === currentCustomerCode) { //this works for new customers where code is ''
                return { ...customer, customerCode: selectedCustomer.value, customerName: selectedCustomer.label };
            }
            return customer;
        }));
      }
  };

  const handleAddNewCustomer = (newCustomerName: string) => {
    const newCustomer = {
      value: newCustomerName.toLowerCase().replace(/\s+/g, '-'),
      label: newCustomerName,
      grade: 'C', // Default grade
    };
    allCustomers.push(newCustomer);
    
    // Find the newly added (empty) customer row and update it
    setData(prevData => prevData.map(customer => {
        if(customer.customerCode === '') {
            return { ...customer, customerCode: newCustomer.value, customerName: newCustomer.label };
        }
        return customer;
    }));
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCancel = () => {
    setData(getInitialData());
    toast({
      title: 'Changes Canceled',
      description: 'Your changes have been discarded.',
    });
  };

  const handleSave = () => {
    // Here you would typically send the data to your backend
    console.log('Saving data:', data);
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated.',
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별/고객별 매출 목표</h1>
            <Button type="button" variant="outline" onClick={() => router.push(role === 'admin' ? '/dashboard' : '/admin')}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sales Target Setting</CardTitle>
              <CardDescription>
                고객별 제품 매출 현황을 확인하고 9월 매출 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객</TableHead>
                    <TableHead className="w-[200px]">제품</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="w-[100px]">수량</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((customer, customerIndex) => (
                    <>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="font-medium align-top">
                               {customer.customerCode === '' ? (
                                    <Combobox
                                        items={customerOptions}
                                        value={customer.customerName}
                                        onValueChange={(value) => handleCustomerChange(customer.customerCode, value)}
                                        onAddNew={handleAddNewCustomer}
                                        placeholder="Select customer"
                                        searchPlaceholder="Search or add..."
                                        noResultsMessage="No customer found."
                                    />
                               ) : (
                                 customer.customerName
                               )}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                               <Combobox
                                    items={productOptions}
                                    value={product.productName}
                                    onValueChange={(value) => {
                                        const selected = productOptions.find(p => p.label.toLowerCase() === value.toLowerCase());
                                        if (selected) {
                                            handleProductChange(customer.customerCode, product.id, selected.value);
                                        }
                                    }}
                                    placeholder="Select product"
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                />
                            ) : (
                              product.productName
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 text-right"
                              placeholder='0'
                              value={product.quantity || ''}
                              onChange={(e) => handleQuantityChange(customer.customerCode, product.id, parseInt(e.target.value, 10) || 0)}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.target)}</TableCell>
                          <TableCell>
                            {product.isNew && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(customer.customerCode, product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                         <TableCell colSpan={8} className="py-2 pl-[195px]">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddProduct(customer.customerCode)}
                                className="text-sm"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
                 <Button onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
