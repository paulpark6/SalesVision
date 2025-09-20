
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { DatePicker } from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Combobox } from '@/components/ui/combobox';
import { customers, products, employees } from '@/lib/mock-data';

export default function NewSalePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  // Form state
  const [productDescription, setProductDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerGrade, setCustomerGrade] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [autoCalculatedPrice, setAutoCalculatedPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [employee, setEmployee] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
      const loggedInEmployee = employees.find(e => e.role === auth.role);
      if (loggedInEmployee) {
          setEmployee(loggedInEmployee.value);
      }
    }
  }, [auth, router]);

  const getDiscount = (grade: string) => {
    switch (grade) {
      case 'A': return 0.1; // 10%
      case 'B': return 0.05; // 5%
      default: return 0;
    }
  }

  useEffect(() => {
    const selectedProduct = products.find(p => p.value === productCode);
    if (selectedProduct && customerGrade) {
      const basePrice = selectedProduct.basePrice;
      const discount = getDiscount(customerGrade);
      const finalPrice = basePrice * (1 - discount);
      setAutoCalculatedPrice(finalPrice);
      setPrice(finalPrice); // Set initial price
    } else {
        setAutoCalculatedPrice(0);
        setPrice(0);
    }
  }, [productCode, customerGrade]);
  
  useEffect(() => {
    const total = quantity * price;
    setTotalPrice(total);
    if (autoCalculatedPrice > 0 && price < autoCalculatedPrice) {
        setNeedsApproval(true);
    } else {
        setNeedsApproval(false);
    }
  }, [quantity, price, autoCalculatedPrice]);

  useEffect(() => {
    if (productDescription) {
        const selectedProduct = products.find(p => p.value.toLowerCase() === productDescription.toLowerCase());
        setProductCode(selectedProduct ? selectedProduct.value : '');
    } else {
        setProductCode('');
    }
  }, [productDescription]);

  useEffect(() => {
    if (customerName) {
        const selectedCustomer = customers.find(c => c.value.toLowerCase() === customerName.toLowerCase());
        if (selectedCustomer) {
            setCustomerCode(selectedCustomer.value);
            setCustomerGrade(selectedCustomer.grade);
        }
    } else {
        setCustomerCode('');
        setCustomerGrade('');
    }
  }, [customerName]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setPrice(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (needsApproval) {
        toast({
          title: '승인 필요',
          description: '특별 할인이 적용되어 관리자 승인이 필요합니다.',
          variant: 'destructive'
        });
        return;
    }

    toast({
      title: 'Sale Recorded',
      description: 'The new sale has been successfully recorded.',
    });
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath); 
  };
  
  const handleCancel = () => {
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath);
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Record a New Sale</h1>
              <Button type="button" variant="outline" onClick={handleCancel}>
                  Back to Dashboard
              </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sale Details</CardTitle>
              <CardDescription>Fill out the form to add a new sale.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <DatePicker />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="saleOrReturn">매출/리턴</Label>
                    <RadioGroup defaultValue="sale" id="saleOrReturn" className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sale" id="sale" />
                            <Label htmlFor="sale">매출</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="return" id="return" />
                            <Label htmlFor="return">리턴</Label>
                        </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">인보이스 넘버</Label>
                    <Input id="invoiceNumber" placeholder="Optional"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">제품 구분</Label>
                    <Select name="productCategory" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="home-goods">Home Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="productCode">제품 코드</Label>
                    <Input id="productCode" value={productCode} readOnly placeholder="e.g., E-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">제품 설명</Label>
                    <Combobox
                        items={products}
                        placeholder="Select product..."
                        searchPlaceholder="Search products..."
                        noResultsMessage="No product found."
                        value={productDescription}
                        onValueChange={setProductDescription}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="customerCode">고객 코드</Label>
                        <Input id="customerCode" value={customerCode} readOnly placeholder="e.g., C-101" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customerName">고객명</Label>
                        <Combobox
                            items={customers}
                            placeholder="Select customer..."
                            searchPlaceholder="Search customers..."
                            noResultsMessage="No customer found."
                            value={customerName}
                            onValueChange={setCustomerName}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customerGrade">고객 등급</Label>
                        <Input id="customerGrade" value={customerGrade} readOnly required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">수량</Label>
                    <Input id="quantity" type="number" placeholder="e.g., 2" required min="1" onChange={handleQuantityChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input id="price" type="number" value={price} placeholder="e.g., 1200" required min="0" step="0.01" onChange={handlePriceChange} />
                     {needsApproval && (
                      <p className="text-sm text-destructive font-medium pt-1">
                        관리자 승인이 필요합니다.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">총 가격</Label>
                    <Input id="totalPrice" type="text" value={`$${totalPrice.toFixed(2)}`} readOnly className="bg-muted" />
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">결제방법</Label>
                        <Select name="paymentMethod" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="credit">Credit</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                                <SelectItem value="prepayment">Prepayment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employee">직원</Label>
                        <Select name="employee" value={employee} onValueChange={setEmployee} required disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                  <SelectItem key={emp.value} value={emp.value}>
                                    {emp.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button type="submit">Save Sale</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
