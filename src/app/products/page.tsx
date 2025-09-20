
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
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { products as initialProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AddProductDialog } from '@/components/products/add-product-dialog';

type Product = typeof initialProducts[0];

export default function ProductsPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    if (auth === undefined) return;

    if (!auth || (role !== 'admin' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const canEditImportPrice = role === 'admin';
  const canEditLocalPrice = role === 'manager';
  const canEditCategory = role === 'admin' || role === 'manager';

  if (!role || (role !== 'admin' && role !== 'manager')) {
    return null; // or a loading component
  }

  return (
    <>
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold">Products</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Import/Export
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddProductDialogOpen(true)}>
                <span>Add Product</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>
                Manage your products here. Owners (Admins) can edit Import
                Prices, and Managers can edit Local Purchase Prices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Import Price</TableHead>
                    <TableHead>Local Purchase Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.value}>
                      <TableCell>
                        {canEditCategory ? (
                           <Input defaultValue="Electronics" className="h-8" />
                        ) : (
                           <Badge variant="outline">Electronics</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.value.toUpperCase()}
                      </TableCell>
                      <TableCell>{product.label}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={product.basePrice}
                          disabled={!canEditImportPrice}
                          className="h-8"
                        />
                      </TableCell>
                       <TableCell>
                        <Input
                          type="number"
                          defaultValue={product.basePrice * 0.8}
                          disabled={!canEditLocalPrice}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
    <AddProductDialog 
        isOpen={isAddProductDialogOpen} 
        onOpenChange={setIsAddProductDialogOpen}
        onProductAdded={handleProductAdded}
    />
    </>
  );
}
