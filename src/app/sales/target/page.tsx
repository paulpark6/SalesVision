
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { salesReportData, products as allProducts, customers as allCustomers } from '@/lib/mock-data';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { v4 as uuidv4 } from 'uuid';

type ProductEntry = {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  targetAmount: number;
};

type SalesTargetData = {
  id: string; // Use customerCode as the ID for existing, uuid for new
  customerName: string;
  customerCode: string;
  isNew: boolean;
  products: ProductEntry[];
  sales: {
    june: number;
    july: number;
    august: number;
  };
};

const getInitialData = (): SalesTargetData[] => {
  const customerSalesData: { [key: string]: SalesTargetData } = {};

  salesReportData.forEach(reportItem => {
    if (!customerSalesData[reportItem.customerCode]) {
      customerSalesData[reportItem.customerCode] = {
        id: reportItem.customerCode,
        customerName: reportItem.customerName,
        customerCode: reportItem.customerCode,
        isNew: false,
        products: [],
        sales: {
          june: 0,
          july: 0,
          august: 0,
        },
      };
    }
    
    // Simulate historical data if it doesn't exist on the report item
    const juneSales = reportItem.actual * (Math.random() * 0.2 + 0.9); // +/- 10%
    const julySales = reportItem.actual * (Math.random() * 0.2 + 1.0); // +/- 10%
    const augustSales = reportItem.actual * (Math.random() * 0.2 + 0.95); // +/- 10%

    customerSalesData[reportItem.customerCode].sales.june += juneSales;
    customerSalesData[reportItem.customerCode].sales.july += julySales;
    customerSalesData[reportItem.customerCode].sales.august += augustSales;


    const productInfo = allProducts.find(p => p.label.toLowerCase().includes(reportItem.productName?.toLowerCase() || ''));
    
    const quantity = Math.round(reportItem.actual / (productInfo?.basePrice || reportItem.actual || 1)) || 1;
    const unitPrice = productInfo?.basePrice || (reportItem.actual / quantity) || 0;

    customerSalesData[reportItem.customerCode].products.push({
      id: uuidv4(),
      productName: reportItem.productName,
      productCode: productInfo?.value || '',
      quantity: quantity,
      unitPrice: unitPrice,
      targetAmount: unitPrice * quantity,
    });

  });

  return Object.values(customerSalesData);
};


const calculateTarget = (quantity: number, unitPrice: number) => {
  return quantity * unitPrice;
};

export default function SalesTargetPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const { toast } = useToast();

  const [data, setData] = useState<SalesTargetData[]>([]);
  const [customers, setCustomers] = useState(allCustomers);
  const [products, setProducts] = useState(allProducts);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    setData(getInitialData());
  }, []);

  const handleProductChange = useCallback((customerIndex: number, productIndex: number, field: keyof ProductEntry, value: string | number) => {
    setData(prevData => {
      const newData = [...prevData];
      const customer = newData[customerIndex];
      const product = customer.products[productIndex];
      
      let newQuantity = product.quantity;
      let newUnitPrice = product.unitPrice;

      if (field === 'productName') {
        const selectedProduct = allProducts.find(p => p.label.toLowerCase() === (value as string).toLowerCase());
        if (selectedProduct) {
          product.productName = selectedProduct.label;
          product.productCode = selectedProduct.value;
          const customerGrade = allCustomers.find(c => c.value === customer.customerCode)?.grade || 'C';
          const discount = getDiscount(customerGrade);
          newUnitPrice = selectedProduct.basePrice * (1 - discount);
          product.unitPrice = newUnitPrice;
        } else {
          product.productName = value as string;
          product.productCode = '';
          newUnitPrice = 0;
          product.unitPrice = newUnitPrice;
        }
      } else if (field === 'quantity') {
        newQuantity = typeof value === 'number' ? value : parseInt(value, 10) || 0;
        product.quantity = newQuantity;
      }
      
      product.targetAmount = calculateTarget(newQuantity, newUnitPrice);

      return newData;
    });
  }, []);

  const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1;
      case 'B': return 0.05;
      default: return 0;
    }
  };

  const handleCustomerChange = useCallback((customerIndex: number, value: string) => {
    setData(prevData => {
      const newData = [...prevData];
      const selectedCustomer = allCustomers.find(c => c.label.toLowerCase() === value.toLowerCase());

      if (selectedCustomer) {
        newData[customerIndex].customerName = selectedCustomer.label;
        newData[customerIndex].customerCode = selectedCustomer.value;
        
        // When customer changes, re-calculate prices for their products
        newData[customerIndex].products.forEach(p => {
          const productInfo = allProducts.find(prod => prod.value === p.productCode);
          if (productInfo) {
            const discount = getDiscount(selectedCustomer.grade);
            p.unitPrice = productInfo.basePrice * (1 - discount);
            p.targetAmount = calculateTarget(p.quantity, p.unitPrice);
          }
        });

      } else {
        // New customer being added
        newData[customerIndex].customerName = value;
        newData[customerIndex].customerCode = `NEW-${uuidv4().slice(0,4)}`;
      }
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
        quantity: 1,
        unitPrice: 0,
        targetAmount: 0,
      });
      return newData;
    });
  };

  const handleRemoveProduct = (customerIndex: number, productIndex: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[customerIndex].products.splice(productIndex, 1);
      // If last product for a customer is removed, remove customer if they are new
      if (newData[customerIndex].products.length === 0 && newData[customerIndex].isNew) {
        newData.splice(customerIndex, 1);
      }
      return newData;
    });
  };
  
  const handleAddNewCustomer = () => {
    const newCustomerRow: SalesTargetData = {
        id: uuidv4(),
        customerName: '',
        customerCode: '',
        isNew: true,
        products: [{
            id: uuidv4(),
            productName: '',
            productCode: '',
            quantity: 1,
            unitPrice: 0,
            targetAmount: 0,
        }],
        sales: { june: 0, july: 0, august: 0 }
    };
    setData(prevData => [...prevData, newCustomerRow]);
  };
  
  const handleCustomerAdded = (newCustomer: { label: string, value: string, grade: string }) => {
    if (!customers.some(c => c.value === newCustomer.value)) {
        setCustomers(prev => [...prev, newCustomer]);
    }
  };


  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved',
      description: 'Your sales targets have been updated successfully.',
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.value, label: p.label })), []);
  const customerOptions = useMemo(() => customers.map(c => ({ value: c.value, label: c.label })), [customers]);

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <h1 className="text-2xl font-semibold">9월 매출 목표 설정</h1>
          <Card>
            <CardHeader>
              <CardTitle>고객별, 제품별 목표 설정</CardTitle>
              <CardDescription>
                6, 7, 8월 평균 실적을 바탕으로 9월 매출 목표를 설정합니다. 수량을 조절하여 목표를 수정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">6월 실적</TableHead>
                    <TableHead className="text-right">7월 실적</TableHead>
                    <TableHead className="text-right">8월 실적</TableHead>
                    <TableHead className="w-[100px]">수량</TableHead>
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
                                    value={item.customerName}
                                    onValueChange={(value) => handleCustomerChange(customerIndex, value)}
                                    onAddNew={(newLabel) => {
                                        const newCustomer = { label: newLabel, value: newLabel.toLowerCase().replace(/\s/g, '-'), grade: 'C' };
                                        handleCustomerAdded(newCustomer);
                                        handleCustomerChange(customerIndex, newLabel);
                                    }}
                                    placeholder="Select customer"
                                    searchPlaceholder="Search customers..."
                                    noResultsMessage="No customer found."
                                    disabled={!item.isNew}
                                />
                            </TableCell>
                          )}
                          <TableCell>
                             <Combobox
                                items={productOptions}
                                value={product.productName}
                                onValueChange={(value) => handleProductChange(customerIndex, productIndex, 'productName', value)}
                                placeholder="Select product"
                                searchPlaceholder="Search products..."
                                noResultsMessage="No product found."
                                disabled={!item.isNew}
                             />
                          </TableCell>
                          
                          {productIndex === 0 && (
                            <>
                              <TableCell rowSpan={item.products.length} className="text-right align-top">
                                {item.sales.june.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </TableCell>
                              <TableCell rowSpan={item.products.length} className="text-right align-top">
                                {item.sales.july.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </TableCell>
                              <TableCell rowSpan={item.products.length} className="text-right align-top">
                                {item.sales.august.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </TableCell>
                            </>
                          )}
                          
                          <TableCell>
                             <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(customerIndex, productIndex, 'quantity', parseInt(e.target.value, 10))}
                                className="h-8 text-right"
                                min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {product.targetAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </TableCell>
                          <TableCell>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveProduct(customerIndex, productIndex)}
                              >
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
            <CardFooter className="flex justify-between border-t px-6 py-4">
               <Button variant="outline" onClick={handleAddNewCustomer}>
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
