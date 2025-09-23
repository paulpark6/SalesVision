
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { salesReportData as initialReportData, products as allProducts } from '@/lib/mock-data';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

type ProductSale = {
  productId: string;
  productName: string;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  isNew: boolean;
  targetQuantity: number;
  basePrice: number;
};

type CustomerSalesData = {
  id: string;
  customerCode: string;
  customerName: string;
  customerGrade: string;
  products: ProductSale[];
  isNew: boolean;
};

const historicalData = [
    { customerCode: "C-101", customerName: "Cybernetics Inc.", customerGrade: "A", products: [
        { productId: 'p-001', productName: 'Quantum Drive', sales: { june: 12000, july: 15000, august: 13500 }, basePrice: 1500 },
        { productId: 'p-002', productName: 'Nano Bots', sales: { june: 8000, july: 9500, august: 8700 }, basePrice: 500 },
    ]},
    { customerCode: "C-102", customerName: "Stellar Solutions", customerGrade: "B", products: [
        { productId: 'p-003', productName: 'Fusion Core', sales: { june: 22000, july: 25000, august: 23000 }, basePrice: 4500 },
    ]},
    { customerCode: "C-103", customerName: "Galaxy Goods", customerGrade: "A", products: [
        { productId: 'p-004', productName: 'Plasma Rifle', sales: { june: 18000, july: 21000, august: 19500 }, basePrice: 2500 },
        { productId: 'p-001', productName: 'Quantum Drive', sales: { june: 5000, july: 6000, august: 5500 }, basePrice: 1500 },
    ]},
    { customerCode: "C-104", customerName: "Nebula Supplies", customerGrade: "C", products: [
        { productId: 'p-005', productName: 'Ion Thruster', sales: { june: 30000, july: 32000, august: 31000 }, basePrice: 7500 },
    ]},
];

const getInitialData = (): CustomerSalesData[] => {
    const data: CustomerSalesData[] = [];
    const customerMap: { [key: string]: CustomerSalesData } = {};

    historicalData.forEach(item => {
        if (!customerMap[item.customerCode]) {
            customerMap[item.customerCode] = {
                id: uuidv4(),
                customerCode: item.customerCode,
                customerName: item.customerName,
                customerGrade: item.customerGrade,
                products: [],
                isNew: false,
            };
            data.push(customerMap[item.customerCode]);
        }
        
        item.products.forEach(p => {
             customerMap[item.customerCode].products.push({
                productId: p.productId,
                productName: p.productName,
                isNew: false,
                sales: {
                    june: p.sales.june,
                    july: p.sales.july,
                    august: p.sales.august,
                },
                targetQuantity: 0,
                basePrice: p.basePrice
            });
        });
    });

    return data;
};

const getDiscount = (grade: string) => {
    switch (grade) {
        case 'A': return 0.1; // 10%
        case 'B': return 0.05; // 5%
        default: return 0;
    }
}

export default function SalesTargetPage() {
  const { toast } = useToast();
  const [salesData, setSalesData] = useState<CustomerSalesData[]>([]);
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    setSalesData(getInitialData());
  }, []);

  const handleAddCustomer = () => {
    const newCustomer: CustomerSalesData = {
      id: uuidv4(),
      customerCode: '',
      customerName: '',
      customerGrade: '',
      products: [{
        productId: '',
        productName: '',
        sales: { june: 0, july: 0, august: 0 },
        isNew: true,
        targetQuantity: 0,
        basePrice: 0
      }],
      isNew: true,
    };
    setSalesData(prevData => [...prevData, newCustomer]);
  };

  const handleAddProduct = (customerId: string) => {
    setSalesData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const newProduct: ProductSale = {
            productId: '',
            productName: '',
            sales: { june: 0, july: 0, august: 0 },
            isNew: true,
            targetQuantity: 0,
            basePrice: 0,
          };
          return { ...customer, products: [...customer.products, newProduct] };
        }
        return customer;
      })
    );
  };
  
  const handleCustomerChange = useCallback((customerId: string, newCustomerCode: string, newCustomerName: string, isNewCustomer: boolean = false) => {
    setSalesData(prevData => {
        const customerOptions = [...new Map(historicalData.map(item => [item.customerCode, item])).values()];
        const selectedCustomer = isNewCustomer ? null : customerOptions.find(c => c.customerCode === newCustomerCode);
        
        return prevData.map(customer => {
            if (customer.id === customerId) {
                return {
                    ...customer,
                    customerCode: newCustomerCode,
                    customerName: newCustomerName,
                    customerGrade: selectedCustomer ? selectedCustomer.customerGrade : (isNewCustomer ? 'C' : ''), // Default new customers to grade C
                };
            }
            return customer;
        });
    });
}, []);

  const handleProductChange = (customerId: string, productIndex: number, newProductId: string) => {
    const selectedProduct = allProducts.find(p => p.value === newProductId);
    if (!selectedProduct) return;

    setSalesData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = [...customer.products];
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            productId: newProductId,
            productName: selectedProduct.label,
            basePrice: selectedProduct.basePrice,
          };
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  };
  
  const handleQuantityChange = (customerId: string, productIndex: number, quantity: number) => {
    setSalesData(prevData =>
      prevData.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = [...customer.products];
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            targetQuantity: quantity,
          };
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  };

  const handleSaveChanges = () => {
    // Here you would typically send the data to your backend
    console.log('Saving data:', salesData);
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated.',
    });
  };

  const handleCancel = () => {
    router.push('/admin');
  };
  
  const customerOptions = useMemo(() => {
    const uniqueCustomers = [...new Map(historicalData.map(item => [item.customerCode, { value: item.customerCode, label: item.customerName }])).values()];
    return uniqueCustomers;
  }, []);

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
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                월간 고객 및 제품별 매출 목표를 설정합니다. 과거 3개월 매출 실적을 참고하여 목표를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">고객</TableHead>
                    <TableHead className="w-[200px]">제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="text-right w-[100px]">수량</TableHead>
                    <TableHead className="text-right w-[150px]">9월 목표</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((customer, customerIndex) => (
                    <>
                      {customer.products.map((product, productIndex) => {
                          const discount = getDiscount(customer.customerGrade);
                          const finalPrice = product.basePrice * (1 - discount);
                          const targetAmount = product.targetQuantity * finalPrice;
                          return(
                            <TableRow key={`${customer.id}-${productIndex}`}>
                                {productIndex === 0 && (
                                <TableCell rowSpan={customer.products.length} className="align-top font-medium">
                                    {customer.isNew ? (
                                      <Combobox
                                          items={customerOptions}
                                          value={customer.customerName}
                                          onValueChange={(newValue) => {
                                              const selected = customerOptions.find(c => c.label.toLowerCase() === newValue.toLowerCase());
                                              handleCustomerChange(customer.id, selected ? selected.value : '', newValue);
                                          }}
                                          placeholder="Select customer..."
                                          searchPlaceholder="Search or add customer..."
                                          noResultsMessage="No customer found."
                                          onAddNew={(newCustomerName) => {
                                              const newCustomerCode = `new-${newCustomerName.toLowerCase().replace(/\s+/g, '-')}`;
                                              handleCustomerChange(customer.id, newCustomerCode, newCustomerName, true);
                                          }}
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
                                        onValueChange={(newValue) => {
                                            const selected = productOptions.find(p => p.label.toLowerCase() === newValue.toLowerCase());
                                            handleProductChange(customer.id, productIndex, selected ? selected.value : '');
                                        }}
                                        placeholder="Select product..."
                                        searchPlaceholder="Search product..."
                                        noResultsMessage="No product found."
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
                                      placeholder="0"
                                      value={product.targetQuantity || ''}
                                      onChange={(e) => handleQuantityChange(customer.id, productIndex, parseInt(e.target.value) || 0)}
                                  />
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {targetAmount > 0 ? `$${targetAmount.toLocaleString()}` : '-'}
                                </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow>
                          <TableCell colSpan={7} className="py-2 px-4">
                             <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)} className="text-sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                          </TableCell>
                      </TableRow>
                      {customerIndex < salesData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={7} className='p-0'>
                                <div className="border-t"></div>
                            </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button variant="outline" onClick={handleAddCustomer}>Add Customer</Button>
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

    