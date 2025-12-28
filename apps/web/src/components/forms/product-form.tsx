'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_code: '',
        product_description: '',
        product_category: '',
        unit_cost: '',
        classification: '',
        credit_or_cash: '',
        amount: '',
        upload_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                product_code: initialData.product_code || '',
                product_description: initialData.product_description || '',
                product_category: initialData.product_category || '',
                unit_cost: initialData.unit_cost?.toString() || '',
                classification: initialData.classification || '',
                credit_or_cash: initialData.credit_or_cash || '',
                amount: initialData.amount?.toString() || '',
                upload_date: initialData.upload_date || new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/products/${initialData.product_code}/` : '/products/';
            const method = isEdit ? 'PUT' : 'POST';

            // Parse numbers
            const body = {
                ...formData,
                unit_cost: formData.unit_cost === '' ? null : parseFloat(formData.unit_cost),
                amount: formData.amount === '' ? null : parseFloat(formData.amount),
            };

            await apiClient(url, {
                method,
                body: JSON.stringify(body),
            });

            router.push('/products');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} product:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} product`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/products"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <Card className="max-w-3xl">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Enter the product information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_code">Product Code</Label>
                                <Input
                                    id="product_code"
                                    value={formData.product_code}
                                    onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                                    placeholder="SKU-001"
                                    required
                                    disabled={isEdit}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product_category">Category</Label>
                                <Input
                                    id="product_category"
                                    value={formData.product_category}
                                    onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                                    placeholder="e.g. Tires"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="product_description">Description</Label>
                                <Input
                                    id="product_description"
                                    value={formData.product_description}
                                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                                    placeholder="Product name/desc"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit_cost">Unit Cost</Label>
                                <Input
                                    id="unit_cost"
                                    type="number"
                                    step="0.01"
                                    value={formData.unit_cost}
                                    onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="classification">Classification</Label>
                                <Input
                                    id="classification"
                                    value={formData.classification}
                                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                                    placeholder="e.g. Import"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="credit_or_cash">Credit/Cash</Label>
                                <Input
                                    id="credit_or_cash"
                                    value={formData.credit_or_cash}
                                    onChange={(e) => setFormData({ ...formData, credit_or_cash: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="upload_date">Upload Date</Label>
                                <Input
                                    id="upload_date"
                                    type="date"
                                    value={formData.upload_date}
                                    onChange={(e) => setFormData({ ...formData, upload_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
