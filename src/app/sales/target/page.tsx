
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type ProductEntry = {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sales: {
    june: number;
    july: number;
    august: number;
  }
};

type CustomerData = {
  id: string;
  customerName: string;
  customerCode: string;
  customerGrade: string;
  isNew: boolean;
  products: ProductEntry[];
};

const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; 
      case 'B': return 0.05;
      default: return 0;
    }
};

// This function now just provides a placeholder structure
const getInitialData = (): CustomerData[] => {
    const customerCodesWithSales = [...new Set(salesReportData.map(item => item.customerCode))];
    const customersWithSales = allCustomers.filter(c => customerCodesWithSales.includes(c.value));
  
    return customersWithSales.map(customer => {
        const customerGrade = customer.grade;
        const discount = getDiscount(customerGrade);
        const product = allProducts[0]; // Default product for structure
        const unitPrice = product.basePrice * (1 - discount);
        
        return {
            id: uuidv4(),
            customerName: customer.label,
            customerCode: customer.value,
            customerGrade: customer.grade,
            isNew: false,
            products: [{
                id: uuidv4(),
                productName: product.label,
                productCode: product.value,
                quantity: 10,
                unitPrice: unitPrice,
                total: 10 * unitPrice,
                sales: { june: 12000, july: 13500, august: 14000 } // Example static data
            }]
        };
    });
};

export default function SalesTargetPage() {
  const { toast } = useToast();
  const [data, setData] = useState<CustomerData[]>([]);
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.value, label: c.label })), []);
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    const initialData = getInitialData();
    setData(initialData);
  }, []);

  const handleCustomerChange = (customerIndex: number, newCustomerCode: string) => {
    const selectedCustomer = allCustomers.find(c => c.value.toLowerCase() === newCustomerCode.toLowerCase());
    if (selectedCustomer) {
      setData(prevData => {
        const newData = [...prevData];
        const oldCustomerData = newData[customerIndex];
        newData[customerIndex] = {
            ...oldCustomerData,
            customerName: selectedCustomer.label,
            customerCode: selectedCustomer.value,
            customerGrade: selectedCustomer.grade,
        };
        // Recalculate prices for existing products for this customer
        newData[customerIndex].products = newData[customerIndex].products.map(p => {
            const productInfo = allProducts.find(ap => ap.value === p.productCode);
            if(productInfo) {
                const discount = getDiscount(selectedCustomer.grade);
                const newUnitPrice = productInfo.basePrice * (1 - discount);
                return {
                    ...p,
                    unitPrice: newUnitPrice,
                    total: p.quantity * newUnitPrice
                };
            }
            return p;
        });

        return newData;
      });
    }
  };

  const handleProductChange = (customerIndex: number, productIndex: number, newProductCode: string) => {
    const selectedProduct = allProducts.find(p => p.value.toLowerCase() === newProductCode.toLowerCase());
    if (selectedProduct) {
        setData(prevData => {
            const newData = [...prevData];
            const customer = newData[customerIndex];
            const discount = getDiscount(customer.customerGrade);
            const newUnitPrice = selectedProduct.basePrice * (1 - discount);

            customer.products[productIndex] = {
                ...customer.products[productIndex],
                productName: selectedProduct.label,
                productCode: selectedProduct.value,
                unitPrice: newUnitPrice,
                total: customer.products[productIndex].quantity * newUnitPrice,
            };
            return newData;
        });
    }
  };
  
    const handleQuantityChange = (customerIndex: number, productIndex: number, newQuantity: number) => {
      setData(prevData => {
        const newData = [...prevData];
        const product = newData[customerIndex].products[productIndex];
        if (product && !isNaN(newQuantity)) {
            product.quantity = newQuantity;
            product.total = newQuantity * product.unitPrice;
        }
        return newData;
      });
    };

  const handleAddProduct = (customerIndex: number) => {
    const customer = data[customerIndex];
    const discount = getDiscount(customer.customerGrade);
    const defaultProduct = allProducts[0];
    const unitPrice = defaultProduct.basePrice * (1-discount);

    const newProduct: ProductEntry = {
      id: uuidv4(),
      productName: defaultProduct.label,
      productCode: defaultProduct.value,
      quantity: 0,
      unitPrice: unitPrice,
      total: 0,
      sales: { june: 0, july: 0, august: 0 }
    };
    
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.push(newProduct);
      return newData;
    });
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    setData(prevData => {
        const newData = [...prevData];
        // If it's the last product for a customer, remove the customer
        if (newData[customerIndex].products.length === 1) {
            newData.splice(customerIndex, 1);
        } else {
            newData[customerIndex].products.splice(productIndex, 1);
        }
        return newData;
    });
  };
  
  const handleAddNewCustomer = () => {
    const defaultCustomer = allCustomers[0];
    const defaultProduct = allProducts[0];
    const discount = getDiscount(defaultCustomer.grade);
    const unitPrice = defaultProduct.basePrice * (1 - discount);

    const newCustomer: CustomerData = {
        id: uuidv4(),
        customerName: '',
        customerCode: '',
        customerGrade: '',
        isNew: true,
        products: [{
            id: uuidv4(),
            productName: defaultProduct.label,
            productCode: defaultProduct.value,
            quantity: 1,
            unitPrice: unitPrice,
            total: unitPrice,
            sales: { june: 0, july: 0, august: 0 }
        }]
    };
    setData(prevData => [...prevData, newCustomer]);
  };
  
  const handleAddNewCustomerOption = (newCustomerName: string) => {
        const newCustomerCode = newCustomerName.toLowerCase().replace(/\s+/g, '-').slice(0, 5) + Math.floor(Math.random() * 100);
        const newCustomer = { value: newCustomerCode, label: newCustomerName, grade: 'C' }; // Default grade C
        allCustomers.push(newCustomer);
        // Maybe update customerOptions state if it's not derived memo
        toast({
            title: "고객 추가됨",
            description: `${newCustomerName}님이 고객 리스트에 추가되었습니다.`,
        });
    };

  const handleSaveChanges = () => {
    toast({
      title: '변경 사항 저장됨',
      description: '매출 목표가 성공적으로 업데이트되었습니다.',
    });
  };

  const handleCancel = () => {
    router.back();
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
          <Card>
            <CardHeader>
              <CardTitle>월별/고객별/제품별 매출 목표 설정</CardTitle>
              <CardDescription>
                9월 매출 목표를 설정합니다. 단가는 고객 등급에 따라 자동 적용되며, 목표 수정 시 저장 버튼을 눌러주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객명</TableHead>
                    <TableHead className="w-[200px]">제품</TableHead>
                    <TableHead className="text-right">6월</TableHead>
                    <TableHead className="text-right">7월</TableHead>
                    <TableHead className="text-right">8월</TableHead>
                    <TableHead className="text-right w-[100px]">수량</TableHead>
                    <TableHead className="text-right">9월 목표</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, customerIndex) => (
                    <Fragment key={item.id}>
                      {item.products.map((product, productIndex) => (
                        <TableRow key={product.id}>
                          {productIndex === 0 && (
                            <TableCell rowSpan={item.products.length} className="align-top font-medium">
                               <Combobox
                                    items={customerOptions}
                                    placeholder="고객 선택..."
                                    searchPlaceholder="고객 검색..."
                                    noResultsMessage="고객을 찾을 수 없습니다."
                                    value={item.customerName || ''}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    onAddNew={handleAddNewCustomerOption}
                                />
                            </TableCell>
                          )}
                          <TableCell>
                            <Combobox
                                items={productOptions}
                                placeholder="제품 선택..."
                                searchPlaceholder="제품 검색..."
                                noResultsMessage="제품을 찾을 수 없습니다."
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, value)}
                            />
                          </TableCell>
                          <TableCell className="text-right">{product.sales.june.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{product.sales.july.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{product.sales.august.toLocaleString()}</TableCell>
                          <TableCell>
                            <Input 
                                type="number" 
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(customerIndex, productIndex, parseInt(e.target.value, 10))}
                                className="h-8 w-20 text-right"
                                min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                             <Input 
                                type="text"
                                value={product.total.toLocaleString()}
                                readOnly
                                className="h-8 w-24 text-right bg-muted"
                             />
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="flex items-center">
                                {productIndex === item.products.length -1 && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddProduct(customerIndex)}>
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveProduct(customerIndex, productIndex)}>
                                    <Trash2 className="h-4 w-4" />
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
                <Button variant="outline" onClick={handleAddNewCustomer}>Add Customer</Button>
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
