
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
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
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type ProductEntry = {
  id: string;
  name: string;
  isNew: boolean;
  sales: {
    june: number;
    july: number;
    august: number;
  };
  september_target: number;
  quantity: number;
};

type CustomerEntry = {
  id: string;
  name: string;
  grade: string;
  isNew: boolean;
  products: ProductEntry[];
};

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
}

const historicalSalesData: { [customerCode: string]: { [productCode: string]: { june: number; july: number; august: number } } } = {
    'C-101': { // Cybernetics Inc.
      'P-001': { june: 28000, july: 32000, august: 30000 },
      'P-002': { june: 14000, july: 15000, august: 16000 },
    },
    'C-102': { // Stellar Solutions
      'P-003': { june: 40000, july: 42000, august: 45000 },
    },
    'C-103': { // Galaxy Goods
      'P-004': { june: 18000, july: 20000, august: 22000 },
    },
    'C-104': { // Nebula Supplies
        'P-001': { june: 0, july: 0, august: 30000 },
    }
};

const getInitialData = (): CustomerEntry[] => {
  const customerMap: { [key: string]: CustomerEntry } = {};

  salesReportData.forEach(reportItem => {
    if (!customerMap[reportItem.customerCode]) {
      customerMap[reportItem.customerCode] = {
        id: reportItem.customerCode,
        name: reportItem.customerName,
        grade: reportItem.customerGrade,
        isNew: false,
        products: [],
      };
    }

    const historicalProductSales = historicalSalesData[reportItem.customerCode]?.[reportItem.productCode] || { june: 0, july: 0, august: 0 };
    
    customerMap[reportItem.customerCode].products.push({
      id: reportItem.productCode,
      name: reportItem.productName,
      september_target: reportItem.actual, // Default to actual for existing
      quantity: Math.floor(Math.random() * 5) + 1, // Mock quantity
      isNew: false,
      sales: historicalProductSales,
    });
  });

  return Object.values(customerMap);
};

export default function SalesTargetPage() {
  const [customerData, setCustomerData] = useState<CustomerEntry[]>([]);
  const { toast } = useToast();
  
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  
  const [customers, setCustomers] = useState(allCustomers.map(c => ({value: c.value, label: c.label})));

  useEffect(() => {
    setCustomerData(getInitialData());
  }, []);

  const handleAddCustomer = () => {
    const newCustomer: CustomerEntry = {
      id: uuidv4(),
      name: '',
      grade: 'C',
      isNew: true,
      products: [
        {
          id: uuidv4(),
          name: '',
          isNew: true,
          sales: { june: 0, july: 0, august: 0 },
          september_target: 0,
          quantity: 1,
        },
      ],
    };
    setCustomerData(prev => [...prev, newCustomer]);
  };

  const handleAddProduct = (customerId: string) => {
    const newProduct: ProductEntry = {
      id: uuidv4(),
      name: '',
      isNew: true,
      sales: { june: 0, july: 0, august: 0 },
      september_target: 0,
      quantity: 1,
    };
    setCustomerData(prev =>
      prev.map(customer =>
        customer.id === customerId
          ? { ...customer, products: [...customer.products, newProduct] }
          : customer
      )
    );
  };
  
  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  const handleCustomerChange = (customerId: string, newCustomerValue: string) => {
    const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === newCustomerValue.toLowerCase());
    
    setCustomerData(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          if(selectedCustomer) {
            return {
              ...c,
              name: selectedCustomer.label,
              grade: selectedCustomer.grade,
            };
          } else {
             // Handle new customer typed in
             const newCustomer = {
                value: newCustomerValue.toLowerCase().replace(/\s+/g, '-'),
                label: newCustomerValue
             };
             if (!customers.some(c => c.label.toLowerCase() === newCustomer.label.toLowerCase())) {
                 setCustomers(prevCust => [...prevCust, newCustomer]);
                 allCustomers.push({
                     value: newCustomer.value,
                     label: newCustomer.label,
                     grade: 'C', // Default grade
                 })
             }
             return {
                 ...c,
                 name: newCustomerValue,
                 grade: 'C'
             }
          }
        }
        return c;
      })
    );
  };

  const handleProductChange = (customerId: string, productId: string, newProductValue: string) => {
    const selectedProduct = allProducts.find(p => p.label.toLowerCase() === newProductValue.toLowerCase());

    setCustomerData(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.map(p => {
            if (p.id === productId) {
              const newTarget = calculateTarget(selectedProduct?.basePrice || 0, customer.grade, p.quantity);
              return { ...p, name: selectedProduct?.label || '', id: selectedProduct?.value || p.id, september_target: newTarget };
            }
            return p;
          });
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  };
  
  const calculateTarget = (basePrice: number, grade: string, quantity: number) => {
      const discount = getDiscount(grade);
      const finalPrice = basePrice * (1 - discount);
      return finalPrice * quantity;
  }

  const handleQuantityChange = (customerId: string, productId: string, quantity: number) => {
     setCustomerData(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          const updatedProducts = customer.products.map(p => {
            if (p.id === productId) {
              const productInfo = allProducts.find(ap => ap.value === p.id || ap.label === p.name);
              const newTarget = calculateTarget(productInfo?.basePrice || 0, customer.grade, quantity);
              return { ...p, quantity, september_target: newTarget };
            }
            return p;
          });
          return { ...customer, products: updatedProducts };
        }
        return customer;
      })
    );
  };

  const handleRemoveProduct = (customerId: string, productId: string) => {
    setCustomerData(prev =>
      prev.map(customer => {
        if (customer.id === customerId) {
          // If it's the last product, remove the customer as well
          if (customer.products.length === 1) {
            return null;
          }
          return { ...customer, products: customer.products.filter(p => p.id !== productId) };
        }
        return customer;
      }).filter(Boolean) as CustomerEntry[]
    );
  };
  
  const handleRemoveCustomer = (customerId: string) => {
      setCustomerData(prev => prev.filter(c => c.id !== customerId));
  };

  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved",
        description: "Your sales targets have been successfully updated.",
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
          <Card>
            <CardHeader>
              <CardTitle>월별/제품별 매출 목표 설정</CardTitle>
              <CardDescription>
                고객 및 제품별로 월 매출 목표를 설정합니다. 수량 입력 시 목표 금액이 자동 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객</TableHead>
                    <TableHead className="w-[180px]">제품</TableHead>
                    <TableHead className="text-right">6월 매출</TableHead>
                    <TableHead className="text-right">7월 매출</TableHead>
                    <TableHead className="text-right">8월 매출</TableHead>
                    <TableHead className="w-[100px] text-right">수량</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, customerIndex) => (
                    <Fragment key={customer.id}>
                      {customer.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={customer.products.length + 1}>
                              {customer.isNew ? (
                                <Combobox
                                    items={customers}
                                    placeholder="Select customer..."
                                    searchPlaceholder="Search or add customer..."
                                    noResultsMessage="No customer found."
                                    value={customer.name}
                                    onValueChange={(value) => handleCustomerChange(customer.id, value)}
                                    onAddNew={(newCustomer) => handleCustomerChange(customer.id, newCustomer)}
                                />
                              ) : (
                                <div className="font-medium">{customer.name}</div>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {product.isNew ? (
                                <Combobox
                                    items={productOptions}
                                    placeholder="Select product..."
                                    searchPlaceholder="Search product..."
                                    noResultsMessage="No product found."
                                    value={product.name}
                                    onValueChange={(value) => handleProductChange(customer.id, product.id, value)}
                                />
                            ) : (
                              product.name
                            )}
                          </TableCell>
                          <TableCell className="text-right">${product.sales.june.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${product.sales.july.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${product.sales.august.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                              <Input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) => handleQuantityChange(customer.id, product.id, parseInt(e.target.value, 10) || 0)}
                                  className="h-8 text-right"
                                  min="0"
                              />
                          </TableCell>
                          <TableCell className="text-right font-medium">${product.september_target.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleAddProduct(customer.id)} className="w-full justify-start gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Product
                            </Button>
                          </TableCell>
                          <TableCell colSpan={6}></TableCell>
                      </TableRow>
                       {customerIndex < customerData.length - 1 && (
                          <TableRow>
                            <TableCell colSpan={8} className='p-0'>
                                <div className="border-t"></div>
                            </TableCell>
                          </TableRow>
                       )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-between border-t p-6">
                <Button variant="outline" onClick={handleAddCustomer}>Add Customer</Button>
                <div className="flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

