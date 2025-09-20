

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

export default function NewImportPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  // Form state
  const [products, setProducts] = useState(initialProducts);
  const [productDescription, setProductDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [importPrice, setImportPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');


  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || role !== 'admin') {
      router.push('/login');
    }
  }, [auth, router, role]);

  useEffect(() => {
    const total = quantity * importPrice;
    setTotalPrice(total);
  }, [quantity, importPrice]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setImportPrice(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    toast({
      title: 'Import Recorded',
      description: 'The new import has been successfully recorded.',
    });
    router.push('/dashboard'); 
  };
  
  const handleCancel = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  const handleAddNewProduct = (newProductLabel: string) => {
    setNewProductName(newProductLabel);
    setIsAddProductDialogOpen(true);
  };
  
  const handleProductAdded = (newProduct: {label: string, value: string, basePrice: number}) => {
    setProducts(prev => [...prev, newProduct]);
    setProductDescription(newProduct.label);
    setProductCode(newProduct.value);
    setImportPrice(newProduct.basePrice);
  };

  if (!role || role !== 'admin') {
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
                <h1 className="text-2xl font-semibold">Register New Import</h1>
              <Button type="button" variant="outline" onClick={handleCancel}>
                  Back to Dashboard
              </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Import Details</CardTitle>
              <CardDescription>Fill out the form to add a new imported product batch.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input id="supplier" placeholder="e.g., Overseas Supplier Co." required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Product Category</Label>
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
                    <Label htmlFor="productCode">Product Code</Label>
                    <Input id="productCode" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="e.g., E-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description</Label>
                    <Combobox
                        items={products}
                        placeholder="Select or type product..."
                        searchPlaceholder="Search products..."
                        noResultsMessage="Product not found."
                        value={productDescription}
                        onValueChange={(value) => {
                            const selectedProduct = products.find(p => p.label.toLowerCase() === value.toLowerCase());
                            if (selectedProduct) {
                                setProductDescription(selectedProduct.label);
                                setProductCode(selectedProduct.value);
                                setImportPrice(selectedProduct.basePrice);
                            } else {
                                setProductDescription(value);
                                setProductCode('');
                                setImportPrice(0);
                            }
                        }}
                        onAddNew={handleAddNewProduct}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="e.g., 100" required min="1" onChange={handleQuantityChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importPrice">Unit Price (Import)</Label>
                    <Input id="importPrice" type="number" value={importPrice} placeholder="e.g., 850" required min="0" step="0.01" onChange={handlePriceChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">Total Price</Label>
                    <Input id="totalPrice" type="text" value={`$${totalPrice.toFixed(2)}`} readOnly className="bg-muted" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button type="submit">Save Import</Button>
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
