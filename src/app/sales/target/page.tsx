
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
import { Button } from '@/components/ui/button';
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
} from '@/lib/mock-data';
import type { SalesTargetCustomer as SalesTargetCustomerType } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';


type ProductRow = {
  id: string;
  productName: string;
  productCode: string;
  isNew: boolean;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  targetQuantity: number;
  targetPrice: number;
};

type CustomerRow = {
  id: string;
  customerName: string;
  customerCode: string;
  customerGrade: string;
  isNew: boolean;
  products: ProductRow[];
};

const historicalData: { [key: string]: { [key: string]: { june: number, july: number, august: number } } } = {
    'C-101': { // Cybernetics Inc.
        'P-001': { june: 5000, july: 5500, august: 6000 }, // Quantum Drive
        'P-002': { june: 2000, july: 2200, august: 2500 }, // Nano Bots
    },
    'C-102': { // Stellar Solutions
        'P-003': { june: 8000, july: 8500, august: 9000 }, // Gravity Spanner
    },
    'C-103': { // Apex Innovations
        'P-004': { june: 3000, july: 3200, august: 3500 }, // Plasma Injector
    }
};


const getInitialData = (): CustomerRow[] => {
    const data: CustomerRow[] = [];
    const customerMap: { [key: string]: CustomerRow } = {};

    allCustomers.forEach(customer => {
        if (!customerMap[customer.value]) {
            customerMap[customer.value] = {
                id: uuidv4(),
                customerName: customer.label,
                customerCode: customer.value,
                customerGrade: customer.grade,
                isNew: false,
                products: [],
            };
            data.push(customerMap[customer.value]);
        }
    });

    allProducts.forEach(product => {
        const customerCode = allCustomers.find(c => c.products?.includes(product.value))?.value;
        if (customerCode && customerMap[customerCode]) {
             const sales = historicalData[customerCode]?.[product.value] || { june: 0, july: 0, august: 0 };
            customerMap[customerCode].products.push({
                id: uuidv4(),
                productName: product.label,
                productCode: product.value,
                isNew: false,
                sales: sales,
                targetQuantity: 0,
                targetPrice: 0,
            });
        }
    });

    return data.filter(c => c.products.length > 0);
};


export default function SalesTargetPage() {
  const { toast } = useToast();
  const [salesData, setSalesData] = useState<CustomerRow[]>([]);
  const [customerOptions, setCustomerOptions] = useState(allCustomers.map(c => ({ value: c.value, label: c.label })));

  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    setSalesData(getInitialData());
  }, []);
  
  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const getProductBasePrice = useCallback((productCode: string) => {
    const product = allProducts.find(p => p.value === productCode);
    return product ? product.basePrice : 0;
  }, []);

  const getDiscount = useCallback((grade: string) => {
    switch (grade) {
      case 'A': return 0.1; 
      case 'B': return 0.05;
      default: return 0;
    }
  }, []);

  const calculateTargetPrice = useCallback((productCode: string, customerGrade: string, quantity: number) => {
      if (!productCode || !customerGrade || !quantity) return 0;
      const basePrice = getProductBasePrice(productCode);
      const discount = getDiscount(customerGrade);
      return basePrice * (1 - discount) * quantity;
  }, [getDiscount, getProductBasePrice]);


  useEffect(() => {
    setSalesData(prevData => {
        return prevData.map(customer => ({
            ...customer,
            products: customer.products.map(product => ({
                ...product,
                targetPrice: calculateTargetPrice(product.productCode, customer.customerGrade, product.targetQuantity)
            }))
        }))
    })
  }, [calculateTargetPrice])


  const handleAddProduct = (customerIndex: number) => {
    const newData = [...salesData];
    newData[customerIndex].products.push({
      id: uuidv4(),
      productName: '',
      productCode: '',
      isNew: true,
      sales: { june: 0, july: 0, august: 0 },
      targetQuantity: 0,
      targetPrice: 0,
    });
    setSalesData(newData);
  };
  
  const handleAddCustomer = () => {
    const newCustomer: CustomerRow = {
      id: uuidv4(),
      customerName: '',
      customerCode: '',
      customerGrade: '',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          productName: '',
          productCode: '',
          isNew: true,
          sales: { june: 0, july: 0, august: 0 },
          targetQuantity: 0,
          targetPrice: 0,
        },
      ],
    };
    setSalesData([...salesData, newCustomer]);
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    const newData = [...salesData];
    newData[customerIndex].products.splice(productIndex, 1);
    // If the customer has no more products, remove the customer
    if (newData[customerIndex].products.length === 0) {
      newData.splice(customerIndex, 1);
    }
    setSalesData(newData);
  };
  
  const handleRemoveCustomer = (customerIndex: number) => {
    const newData = [...salesData];
    newData.splice(customerIndex, 1);
    setSalesData(newData);
  };

  const handleCustomerChange = (customerIndex: number, selectedCustomer: SalesTargetCustomerType | null) => {
    const newData = [...salesData];
    if (selectedCustomer) {
      newData[customerIndex].customerName = selectedCustomer.label;
      newData[customerIndex].customerCode = selectedCustomer.value;
      newData[customerIndex].customerGrade = selectedCustomer.grade;
      // Reset products when customer changes
      newData[customerIndex].products = [{
        id: uuidv4(),
        productName: '',
        productCode: '',
        isNew: true,
        sales: { june: 0, july: 0, august: 0 },
        targetQuantity: 0,
        targetPrice: 0,
      }];
    }
    setSalesData(newData);
  };
  
  const handleNewCustomer = (customerIndex: number, customerName: string) => {
    const newData = [...salesData];
    const newCustomerCode = `C-NEW-${customerName.slice(0,3).toUpperCase()}`;
    const newOption = { value: newCustomerCode, label: customerName };

    // This is just for the client-side state.
    // In a real app you would persist this.
    setCustomerOptions(prev => [...prev, newOption]);
    
    newData[customerIndex].customerName = customerName;
    newData[customerIndex].customerCode = newCustomerCode;
    newData[customerIndex].customerGrade = 'C'; // Default grade for new customer
    setSalesData(newData);
  };


  const handleProductChange = (customerIndex: number, productIndex: number, selectedProductValue: string) => {
    const newData = [...salesData];
    const product = allProducts.find(p => p.label.toLowerCase() === selectedProductValue.toLowerCase());
    if (product) {
      newData[customerIndex].products[productIndex].productName = product.label;
      newData[customerIndex].products[productIndex].productCode = product.value;
    }
    setSalesData(newData);
  };
  
  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
      const newData = [...salesData];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];
      product.targetQuantity = quantity;
      product.targetPrice = calculateTargetPrice(product.productCode, customer.customerGrade, quantity);
      setSalesData(newData);
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated.',
    });
  };

  const handleCancel = () => {
    setSalesData(getInitialData());
    toast({
      title: 'Changes Canceled',
      description: 'Your changes have been discarded.',
      variant: 'destructive',
    });
  };
  
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
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sales Target for September 2024</CardTitle>
              <CardDescription>
                Set the sales targets for each customer and product for the upcoming month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead className="text-right">June Sales</TableHead>
                      <TableHead className="text-right">July Sales</TableHead>
                      <TableHead className="text-right">August Sales</TableHead>
                      <TableHead className="w-[100px] text-right">수량</TableHead>
                      <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                      <TableHead className="w-[50px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((customer, customerIndex) => (
                      <>
                        {customer.products.map((product, productIndex) => (
                          <TableRow key={product.id}>
                            {productIndex === 0 && (
                              <TableCell rowSpan={customer.products.length + 1} className="align-top font-medium">
                                {customer.isNew ? (
                                  <div className='flex flex-col gap-2'>
                                      <Combobox
                                        items={customerOptions}
                                        placeholder="Select or add..."
                                        searchPlaceholder="Search customer..."
                                        noResultsMessage="No customer found."
                                        value={customer.customerName}
                                        onValueChange={(value) => {
                                            const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());
                                            handleCustomerChange(customerIndex, selectedCustomer);
                                        }}
                                        onAddNew={(newCustomerName) => handleNewCustomer(customerIndex, newCustomerName)}
                                    />
                                    <div className='text-xs text-muted-foreground'>
                                        Code: {customer.customerCode} <br/>
                                        Grade: {customer.customerGrade}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div>{customer.customerName}</div>
                                    <div className='text-xs text-muted-foreground'>
                                        Code: {customer.customerCode} | Grade: {customer.customerGrade}
                                    </div>
                                  </>
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                              {product.isNew ? (
                                <Combobox
                                  items={productOptions}
                                  placeholder="Select product..."
                                  searchPlaceholder="Search products..."
                                  noResultsMessage="No product found."
                                  value={product.productName}
                                  onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                                />
                              ) : (
                                product.productName
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sales.june > 0 ? `$${product.sales.june.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sales.july > 0 ? `$${product.sales.july.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sales.august > 0 ? `$${product.sales.august.toLocaleString()}` : '-'}
                            </TableCell>
                             <TableCell className="text-right">
                              <Input
                                type="number"
                                value={product.targetQuantity || ''}
                                onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value, 10))}
                                className="h-8 text-right"
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {product.targetPrice > 0 ? `$${product.targetPrice.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                               <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                         <TableRow>
                            <TableCell className="py-2 pl-4">
                                <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customerIndex)} className="w-full justify-start gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Product
                                </Button>
                            </TableCell>
                            <TableCell colSpan={7}></TableCell>
                        </TableRow>
                        {customerIndex < salesData.length - 1 && (
                             <TableRow>
                                <TableCell colSpan={8} className='p-0'>
                                    <div className="border-t my-2"></div>
                                </TableCell>
                            </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
             <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleAddCustomer}>
                    Add Customer
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                    Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
