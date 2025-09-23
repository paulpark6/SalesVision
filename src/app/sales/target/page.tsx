
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
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type SalesTargetItem = {
    id: string;
    customer: { name: string; code: string; grade: string; };
    products: { 
        id: string; 
        name: string; 
        code: string; 
        juneSales: number;
        julySales: number;
        augustSales: number;
        target: number;
        quantity: number;
    }[];
};

const getInitialData = (): SalesTargetItem[] => {
    const customerProductMap: { [key: string]: SalesTargetItem } = {};

    salesReportData.forEach(reportItem => {
        if (!customerProductMap[reportItem.customerCode]) {
            customerProductMap[reportItem.customerCode] = {
                id: uuidv4(),
                customer: {
                    name: reportItem.customerName,
                    code: reportItem.customerCode,
                    grade: 'A', // This should be looked up from customer data
                },
                products: [],
            };
        }

        // Find product details
        const productInfo = allProducts.find(p => p.label === reportItem.productName);

        customerProductMap[reportItem.customerCode].products.push({
            id: uuidv4(),
            name: reportItem.productName,
            code: productInfo?.value || 'N/A',
            // Simulate historical data - in real app, this would come from backend
            juneSales: Math.floor(reportItem.actual * (0.8 + Math.random() * 0.4)),
            julySales: Math.floor(reportItem.actual * (0.9 + Math.random() * 0.3)),
            augustSales: Math.floor(reportItem.actual * (0.85 + Math.random() * 0.35)),
            target: reportItem.actual, // Default target to last month's actual
            quantity: Math.max(1, Math.round(reportItem.actual / (productInfo?.basePrice || reportItem.actual))),
        });
    });

    return Object.values(customerProductMap);
};


export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();
  
  const [data, setData] = useState<SalesTargetItem[]>([]);
  const [customerOptions, setCustomerOptions] = useState(allCustomers.map(c => ({value: c.value, label: c.label})));

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
       setData(getInitialData());
    }
  }, [auth, router]);
  
  const handleAddCustomerRow = useCallback(() => {
    setData(prevData => [
        ...prevData,
        {
            id: uuidv4(),
            customer: { name: '', code: '', grade: '' },
            products: [{ 
                id: uuidv4(), 
                name: '', 
                code: '', 
                juneSales: 0, 
                julySales: 0, 
                augustSales: 0, 
                target: 0, 
                quantity: 0 
            }],
        }
    ]);
  }, []);

  const handleRemoveCustomer = (customerId: string) => {
    setData(prevData => prevData.filter(item => item.id !== customerId));
  };
  
  const handleCustomerChange = (customerId: string, newCustomerValue: string) => {
      const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerValue.toLowerCase());
      
      setData(prevData => prevData.map(item => {
          if (item.id === customerId) {
              if(selectedCustomer) {
                return { ...item, customer: { name: selectedCustomer.label, code: selectedCustomer.value, grade: selectedCustomer.grade } };
              } else {
                 // Handle adding a new customer
                const newCustomer = {
                    label: newCustomerValue,
                    value: newCustomerValue.toLowerCase().replace(/\s+/g, '-'),
                    grade: 'C' // Default grade
                };
                if (!customerOptions.some(c => c.label.toLowerCase() === newCustomer.label.toLowerCase())) {
                    setCustomerOptions(prev => [...prev, newCustomer]);
                }
                return { ...item, customer: { name: newCustomer.label, code: newCustomer.value, grade: newCustomer.grade } };
              }
          }
          return item;
      }));
  };

  const handleAddProduct = (customerId: string) => {
    setData(prevData => prevData.map(item => {
      if (item.id === customerId) {
        const newProducts = [...item.products, { id: uuidv4(), name: '', code: '', juneSales: 0, julySales: 0, augustSales: 0, target: 0, quantity: 0 }];
        return { ...item, products: newProducts };
      }
      return item;
    }));
  };
  
  const handleRemoveProduct = (customerId: string, productId: string) => {
    setData(prevData => prevData.map(item => {
      if (item.id === customerId) {
        const newProducts = item.products.filter(p => p.id !== productId);
        return { ...item, products: newProducts };
      }
      return item;
    }));
  };

  const handleProductChange = (customerId: string, productId: string, newProductValue: string) => {
      const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newProductValue.toLowerCase());
      if (selectedProduct) {
          setData(prevData => prevData.map(customer => {
              if (customer.id === customerId) {
                  const newProducts = customer.products.map(p => {
                      if (p.id === productId) {
                          const basePrice = selectedProduct.basePrice;
                          const discount = getDiscount(customer.customer.grade);
                          const finalPrice = basePrice * (1 - discount);
                          const newTarget = p.quantity * finalPrice;
                          return { ...p, name: selectedProduct.label, code: selectedProduct.value, target: newTarget };
                      }
                      return p;
                  });
                  return { ...customer, products: newProducts };
              }
              return customer;
          }));
      }
  };
  
  const handleQuantityChange = (customerId: string, productId: string, quantity: number) => {
      setData(prevData => prevData.map(customer => {
          if (customer.id === customerId) {
              const newProducts = customer.products.map(p => {
                  if (p.id === productId) {
                      const productInfo = allProducts.find(ap => ap.value === p.code);
                      if (productInfo) {
                           const basePrice = productInfo.basePrice;
                           const discount = getDiscount(customer.customer.grade);
                           const finalPrice = basePrice * (1 - discount);
                           const newTarget = quantity * finalPrice;
                           return { ...p, quantity, target: newTarget };
                      }
                      return { ...p, quantity, target: 0 };
                  }
                  return p;
              });
              return { ...customer, products: newProducts };
          }
          return customer;
      }));
  };
  
  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };
  
  const handleSaveChanges = () => {
      toast({
          title: "Changes Saved",
          description: "Your new sales targets have been successfully saved."
      });
      const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
      router.push(dashboardPath);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
  }

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
            <h1 className="text-2xl font-semibold">월별/고객별 매출 목표 설정</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>9월 매출 목표</CardTitle>
              <CardDescription>
                고객별 3개월 매출 실적을 확인하고 9월 매출 목표를 설정합니다. 제품, 수량을 선택하면 9월 목표가 자동 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">고객명</TableHead>
                    <TableHead className="w-[250px]">제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[120px] text-right">수량</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length + 1} className="align-top pt-5">
                              {item.customer.name ? (
                                <div>
                                    <p className="font-medium">{item.customer.name}</p>
                                    <p className="text-sm text-muted-foreground"> 등급: {item.customer.grade}</p>
                                </div>
                              ) : (
                                <Combobox
                                    items={customerOptions}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search or add..."
                                    noResultsMessage="No customer found."
                                    value={item.customer.name}
                                    onValueChange={(value) => handleCustomerChange(item.id, value)}
                                    onAddNew={(newItem) => handleCustomerChange(item.id, newItem)}
                                />
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                             {product.name ? product.name : (
                                 <Combobox
                                    items={productOptions}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search products..."
                                    noResultsMessage="No product found."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(item.id, product.id, value)}
                                />
                             )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(product.juneSales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.julySales)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.augustSales)}</TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="number" 
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(item.id, product.id, parseInt(e.target.value))}
                                className="h-8 text-right"
                                min="0"
                                disabled={!product.name}
                             />
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(product.target)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(item.id, product.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                       <TableRow>
                            <TableCell colSpan={6} className="py-1 px-2">
                                <div className="flex items-center">
                                    <Button variant="ghost" size="sm" onClick={() => handleAddProduct(item.id)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Product
                                    </Button>
                                    <div className="flex-grow border-t border-dashed mx-4"></div>
                                </div>
                            </TableCell>
                             <TableCell className="py-1">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomer(item.id)} className="float-right">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleAddCustomerRow}>
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

const SalesTargetPageContainer = () => {
    return (
        <SidebarProvider>
            <SalesTargetPage />
        </SidebarProvider>
    );
}
