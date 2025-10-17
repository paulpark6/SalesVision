

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
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';
import { products as initialProducts } from '@/lib/mock-data';
import { AddProductDialog } from '@/components/products/add-product-dialog';

export default function NewPurchasePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  // Form state
  const [products, setProducts] = useState(initialProducts);
  const [productDescription, setProductDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');


  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || role !== 'manager') {
      router.push('/login');
    }
  }, [auth, router, role]);

  useEffect(() => {
    const total = quantity * purchasePrice;
    setTotalPurchasePrice(total);
  }, [quantity, purchasePrice]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setPurchasePrice(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    toast({
      title: 'Purchase Recorded',
      description: 'The new local purchase has been successfully recorded.',
    });
    router.push('/admin'); 
  };
  
  const handleCancel = () => {
    router.push('/admin');
  };

  const handleAddNewProduct = (newProductLabel: string) => {
    setNewProductName(newProductLabel);
    setIsAddProductDialogOpen(true);
  };
  
  const handleProductAdded = (newProduct: {label: string, value: string, basePrice: number}) => {
    setProducts(prev => [...prev, newProduct]);
    setProductDescription(newProduct.label);
    setProductCode(newProduct.value);
    setPurchasePrice(newProduct.basePrice);
  };

  if (!role || role !== 'manager') {
    return null;
  }

  return (
    <>
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Add New Local Purchase</h1>
              <Button type="button" variant="outline" onClick={handleCancel}>
                  Back to Dashboard
              </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>Fill out the form to add a new local purchase.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <DatePicker />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">구매처</Label>
                    <Input id="supplier" placeholder="e.g., Local Supplier Inc." required />
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
                    <Input id="productCode" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="e.g., E-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">제품 설명</Label>
                    <Combobox
                        items={products}
                        placeholder="Select or type product..."
                        searchPlaceholder="Search products..."
                        noResultsMessage="제품을 찾을 수 없습니다."
                        value={productDescription}
                        onValueChange={(value) => {
                            const selectedProduct = products.find(p => p.label.toLowerCase() === value.toLowerCase());
                            if (selectedProduct) {
                                setProductDescription(selectedProduct.label);
                                setProductCode(selectedProduct.value);
                                setPurchasePrice(selectedProduct.basePrice);
                            } else {
                                setProductDescription(value);
                                setProductCode('');
                                setPurchasePrice(0);
                            }
                        }}
                        onAddNew={handleAddNewProduct}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">수량</Label>
                    <Input id="quantity" type="number" placeholder="e.g., 10" required min="1" onChange={handleQuantityChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">구매액</Label>
                    <Input id="purchasePrice" type="number" value={purchasePrice} placeholder="e.g., 950" required min="0" step="0.01" onChange={handlePriceChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPurchasePrice">총 구매액</Label>
                    <Input id="totalPurchasePrice" type="text" value={`$${totalPurchasePrice.toFixed(2)}`} readOnly className="bg-muted" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button type="submit">Save Purchase</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
    <AddProductDialog 
        isOpen={isAddProductDialogOpen} 
        onOpenChange={setIsAddProductDialogOpen}
        defaultName={newProductName}
        onProductAdded={handleProductAdded}
    />
    </>
  );
}
