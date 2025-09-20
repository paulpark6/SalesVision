
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from '../ui/combobox';

type AddProductDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultName?: string;
  onProductAdded?: (newProduct: { label: string, value: string, basePrice: number }) => void;
};

const initialCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home-goods', label: 'Home Goods' },
];

export function AddProductDialog({ isOpen, onOpenChange, defaultName = '', onProductAdded }: AddProductDialogProps) {
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [categories, setCategories] = React.useState(initialCategories);

  React.useEffect(() => {
    if(isOpen) {
      setName(defaultName);
      setCategory('');
    }
  }, [isOpen, defaultName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProduct = {
      label: formData.get('productName') as string,
      value: (formData.get('productCode') as string).toLowerCase(),
      // Since local price is the only price, let's treat it as the base price
      basePrice: parseFloat(formData.get('localPrice') as string),
    };

    if (!newProduct.label || !newProduct.value || !category || isNaN(newProduct.basePrice)) {
       toast({
        title: 'Error',
        description: 'Please fill all fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Product Added',
      description: `The new product "${newProduct.label}" has been successfully added.`,
    });
    
    onProductAdded?.(newProduct);
    onOpenChange(false); // Close the dialog
  };

  const handleAddCategory = (newCategoryLabel: string) => {
    const newCategory = {
        value: newCategoryLabel.toLowerCase().replace(/\s+/g, '-'),
        label: newCategoryLabel
    };
    setCategories(prev => [...prev, newCategory]);
    setCategory(newCategory.label);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productName" className="text-right">
                Name
              </Label>
              <Input 
                id="productName" 
                name="productName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wireless Mouse" 
                className="col-span-3" 
                required 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Combobox
                    items={categories}
                    placeholder="Select or add category..."
                    searchPlaceholder="Search categories..."
                    noResultsMessage="No category found."
                    value={category}
                    onValueChange={setCategory}
                    onAddNew={handleAddCategory}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productCode" className="text-right">
                Product Code
              </Label>
              <Input id="productCode" name="productCode" placeholder="e.g., e-005" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="localPrice" className="text-right">
                구매가
              </Label>
              <Input id="localPrice" name="localPrice" type="number" placeholder="e.g., 22.00" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
