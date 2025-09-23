
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import type { SalesTargetCustomer as MockSalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Combobox } from '@/components/ui/combobox';

// Enhanced data structure to include sales history and new item flag
type SalesTargetProduct = {
    id: string;
    productName: string;
    quantity: number;
    target: number;
    isNew: boolean;
    sales: {
        june: number;
        july: number;
        august: number;
    };
};

type SalesTargetCustomer = {
    id: string;
    customerName: string;
    isNew: boolean;
    products: SalesTargetProduct[];
};

// Generate more realistic mock sales history
const mockSalesHistory: { [key: string]: { [key: string]: { june: number; july: number; august: number } } } = {
    'C-101': { // Cybernetics Inc.
        'P-001': { june: 12000, july: 15000, august: 13000 }, // QuantumDrive
        'P-002': { june: 5000, july: 6000, august: 5500 },   // NanoBots
    },
    'C-102': { // Apex Solutions
        'P-003': { june: 8000, july: 9500, august: 9000 }, // DataWeaver
    },
    'C-103': { // Stellar Corp
        'P-004': { june: 20000, july: 22000, august: 21000 }, // FusionCore
    },
    'C-104': { // Nova Limited
        'P-001': { june: 3000, july: 4000, august: 3500 }, // QuantumDrive
    }
};


const getInitialData = (): SalesTargetCustomer[] => {
    const data: SalesTargetCustomer[] = [];
    const customerMap: { [key: string]: SalesTargetCustomer } = {};

    allCustomers.forEach(customer => {
        if (!customerMap[customer.value]) {
             customerMap[customer.value] = {
                id: customer.value,
                customerName: customer.label,
                isNew: false,
                products: [],
            };
            data.push(customerMap[customer.value]);
        }
    });

    allProducts.forEach(product => {
        // Find which customers have sales history for this product
        Object.keys(mockSalesHistory).forEach(customerCode => {
            if (mockSalesHistory[customerCode][product.value]) {
                const customer = customerMap[customerCode];
                if (customer) {
                    customer.products.push({
                        id: product.value,
                        productName: product.label,
                        quantity: 0, // Default quantity
                        target: 0, // Default target
                        isNew: false,
                        sales: mockSalesHistory[customerCode][product.value],
                    });
                }
            }
        });
    });

    // Ensure customers without history still appear
    allCustomers.forEach(customer => {
        if (customerMap[customer.value] && customerMap[customer.value].products.length === 0) {
             customerMap[customer.value].products.push({
                id: `new-prod-${Date.now()}`,
                productName: '',
                quantity: 0,
                target: 0,
                isNew: true,
                sales: { june: 0, july: 0, august: 0 }
            });
        }
    });
    
    return data.filter(c => c.products.length > 0);
};

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
}

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>([]);
  const role = auth?.role;

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
        setCustomerData(getInitialData());
    }
  }, [auth, router]);
  
  const handleCustomerChange = (customerIndex: number, newCustomerCode: string) => {
    const selectedCustomer = allCustomers.find(c => c.value === newCustomerCode);
    if (!selectedCustomer) return;

    setCustomerData(prev => {
        const newData = [...prev];
        const currentCustomer = newData[customerIndex];
        
        // Check if customer is already in use
        if (prev.some((c, idx) => idx !== customerIndex && c.id === newCustomerCode)) {
            toast({
                title: 'Customer Already Exists',
                description: 'This customer is already in the target list. Please choose another.',
                variant: 'destructive',
            });
            return prev;
        }

        newData[customerIndex] = {
            ...currentCustomer,
            id: selectedCustomer.value,
            customerName: selectedCustomer.label,
            isNew: false, // It's no longer 'new' once selected
        };
        return newData;
    });
  };
  
  const handleProductChange = (customerIndex: number, productIndex: number, newProductCode: string) => {
    const selectedProduct = allProducts.find(p => p.value === newProductCode);
    if (!selectedProduct) return;

    setCustomerData(prev => {
      const newData = [...prev];
      const customer = newData[customerIndex];
      const currentProduct = customer.products[productIndex];
      
      const customerInfo = allCustomers.find(c => c.value === customer.id);
      const grade = customerInfo?.grade || 'C';
      const discount = getDiscount(grade);
      const unitPrice = selectedProduct.basePrice * (1 - discount);
      const newTarget = currentProduct.quantity * unitPrice;

      customer.products[productIndex] = {
        ...currentProduct,
        id: selectedProduct.value,
        productName: selectedProduct.label,
        target: newTarget,
        isNew: false,
      };
      return newData;
    });
  };

  const handleQuantityChange = (customerIndex: number, productIndex: number, quantity: number) => {
    setCustomerData(prev => {
      const newData = [...prev];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];
      
      const selectedProduct = allProducts.find(p => p.value === product.id);
      if (selectedProduct) {
          const customerInfo = allCustomers.find(c => c.value === customer.id);
          const grade = customerInfo?.grade || 'C';
          const discount = getDiscount(grade);
          const unitPrice = selectedProduct.basePrice * (1 - discount);
          product.quantity = quantity;
          product.target = quantity * unitPrice;
      }

      return newData;
    });
  };


  const handleAddProduct = (customerIndex: number) => {
    setCustomerData(prev => {
      const newData = [...prev];
      newData[customerIndex].products.push({
        id: `new-prod-${Date.now()}`,
        productName: '',
        quantity: 0,
        target: 0,
        isNew: true,
        sales: { june: 0, july: 0, august: 0 }
      });
      return newData;
    });
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    setCustomerData(prev => {
      const newData = [...prev];
      // If it's the last product for a customer, remove the customer
      if (newData[customerIndex].products.length === 1) {
        return newData.filter((_, idx) => idx !== customerIndex);
      }
      // Otherwise, just remove the product
      newData[customerIndex].products = newData[customerIndex].products.filter((_, idx) => idx !== productIndex);
      return newData;
    });
  };

  const handleAddCustomer = useCallback(() => {
    setCustomerData(prev => [
        ...prev,
        {
            id: `new-${prev.length + 1}`,
            customerName: '',
            isNew: true,
            products: [
                {
                    id: `new-prod-${Date.now()}`,
                    productName: '',
                    quantity: 0,
                    target: 0,
                    isNew: true,
                    sales: { june: 0, july: 0, august: 0 }
                }
            ]
        }
    ]);
  }, []);
  
  const handleCancel = () => {
    router.back();
  };

  if (!role) {
    return (
        <SidebarProvider>
            <AppSidebar role={'employee'} />
             <SidebarInset>
                <Header />
                <main className="flex flex-1 items-center justify-center">
                    <p>Loading...</p>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
            <div />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                고객 및 제품별 매출 목표를 설정합니다. 6, 7, 8월 실적을 참고하여 9월 목표를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품</TableHead>
                    <TableHead className="text-right w-[100px]">6월 매출</TableHead>
                    <TableHead className="text-right w-[100px]">7월 매출</TableHead>
                    <TableHead className="text-right w-[100px]">8월 매출</TableHead>
                    <TableHead className="text-right w-[100px]">수량</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <React.Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length} className="font-medium align-top border-b">
                               {customer.isNew ? (
                                    <Combobox
                                        items={customerOptions}
                                        value={customer.id}
                                        onValueChange={(newCustomerCode) => handleCustomerChange(customerIndex, newCustomerCode)}
                                        placeholder="고객 선택..."
                                        searchPlaceholder="고객 검색..."
                                        noResultsMessage="고객을 찾을 수 없습니다."
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
                                    value={product.id}
                                    onValueChange={(newProductCode) => handleProductChange(customerIndex, productIndex, newProductCode)}
                                    placeholder="제품 선택..."
                                    searchPlaceholder="제품 검색..."
                                    noResultsMessage="제품을 찾을 수 없습니다."
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
                              className="h-8 text-right"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {`$${product.target.toLocaleString()}`}
                          </TableCell>
                          <TableCell>
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
                          <TableCell colSpan={8} className="py-2 px-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddProduct(customerIndex)}
                                    className="flex items-center gap-1 text-sm"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    Add Product
                                </Button>
                          </TableCell>
                      </TableRow>
                       {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={8} className='p-0 h-4'>
                                <div className="border-t"></div>
                            </TableCell>
                          </TableRow>
                       )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t pt-6">
                <Button variant="outline" onClick={handleAddCustomer}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={() => {
                        toast({
                        title: 'Changes Saved',
                        description: 'Your sales targets have been updated.',
                        });
                    }}>Save Changes</Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
