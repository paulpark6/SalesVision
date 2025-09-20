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
import { customers, products } from '@/lib/mock-data';

export default function NewSalePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productDescription, setProductDescription] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    // If auth is still loading, do nothing.
    if (auth === undefined) return;
    
    // Anyone logged in can record a sale. If not logged in, redirect.
    if (!auth) {
      router.push('/login');
    }
  }, [auth, router]);
  
  useEffect(() => {
    const total = quantity * price;
    setTotalPrice(total);
  }, [quantity, price]);

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
    toast({
      title: 'Sale Recorded',
      description: 'The new sale has been successfully recorded.',
    });
    // Redirect based on the user's role.
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath); 
  };
  
  const handleCancel = () => {
    const redirectPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(redirectPath);
  };
  
  // Render nothing or a loading spinner while checking auth
  if (!role) {
    return null; // or a loading component
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
                    <Input id="productCode" placeholder="e.g., E-001" required />
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
                        <Input id="customerCode" placeholder="e.g., C-101" required />
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
                        <Select name="customerGrade" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">수량</Label>
                    <Input id="quantity" type="number" placeholder="e.g., 2" required min="1" onChange={handleQuantityChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input id="price" type="number" placeholder="e.g., 1200" required min="0" step="0.01" onChange={handlePriceChange} />
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
                        <Select name="employee" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="emp-01">John Doe (Admin)</SelectItem>
                                <SelectItem value="emp-02">Jane Smith (Employee)</SelectItem>
                                <SelectItem value="emp-03">Peter Jones (Employee)</SelectItem>
                                <SelectItem value="emp-04">Alex Ray (Manager)</SelectItem>
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
