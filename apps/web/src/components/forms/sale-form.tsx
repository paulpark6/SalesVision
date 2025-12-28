'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface SaleFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function SaleForm({ initialData, isEdit = false }: SaleFormProps) {
    const router = useRouter();
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sale_num: '',
        inventory_status: '',
        product_code: '',
        invoice_num: '',
        sale_date: new Date().toISOString().split('T')[0],
        quantity: '',
        client_number: '',
        staff_number: '',
        unit_price: '',
        sale_amount: '',
        payment_type: 'cash',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                sale_num: initialData.sale_num?.toString() || '',
                inventory_status: initialData.inventory_status || '',
                product_code: initialData.product_code || '',
                invoice_num: initialData.invoice_num || '',
                sale_date: initialData.sale_date || new Date().toISOString().split('T')[0],
                quantity: initialData.quantity?.toString() || '',
                client_number: initialData.client_number || '',
                staff_number: initialData.staff_number || '',
                unit_price: initialData.unit_price?.toString() || '',
                sale_amount: initialData.sale_amount?.toString() || '',
                payment_type: initialData.payment_type || 'cash',
            });
        }
    }, [initialData]);

    const dashboardUrl = auth?.role === 'admin' ? '/admin' : auth?.role === 'manager' ? '/manager' : '/staff';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/sales/${initialData.sale_num}/` : '/sales/';
            const method = isEdit ? 'PUT' : 'POST';

            // Align properties with API expectations
            const body = {
                ...formData,
                sale_num: formData.sale_num ? parseInt(formData.sale_num) : undefined,
                quantity: formData.quantity === '' ? null : parseInt(formData.quantity),
                unit_price: formData.unit_price === '' ? null : parseFloat(formData.unit_price),
                sale_amount: (parseInt(formData.quantity) || 0) * (parseFloat(formData.unit_price) || 0),
            };

            await apiClient(url, {
                method,
                body: JSON.stringify(body),
            });

            router.push('/sales');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} sale:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} sale`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/sales"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Sale' : 'Add New Sale'}</h1>
            </div>

            <Card className="max-w-3xl">
                <CardHeader>
                    <CardTitle>Sale Details</CardTitle>
                    <CardDescription>Enter the sale transaction information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="invoice_num">Invoice Number</Label>
                                <Input
                                    id="invoice_num"
                                    value={formData.invoice_num}
                                    onChange={(e) => setFormData({ ...formData, invoice_num: e.target.value })}
                                    placeholder="INV-001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sale_date">Date</Label>
                                <Input
                                    id="sale_date"
                                    type="date"
                                    value={formData.sale_date}
                                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inventory_status">Inventory Status</Label>
                                <Input
                                    id="inventory_status"
                                    value={formData.inventory_status}
                                    onChange={(e) => setFormData({ ...formData, inventory_status: e.target.value })}
                                    placeholder="e.g. Dispatched"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff_number">Staff Number</Label>
                                <Input
                                    id="staff_number"
                                    value={formData.staff_number}
                                    onChange={(e) => setFormData({ ...formData, staff_number: e.target.value })}
                                    placeholder="STA-001"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_number">Customer Number</Label>
                                <Input
                                    id="client_number"
                                    value={formData.client_number}
                                    onChange={(e) => setFormData({ ...formData, client_number: e.target.value })}
                                    placeholder="CLI-001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product_code">Product Code</Label>
                                <Input
                                    id="product_code"
                                    value={formData.product_code}
                                    onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                                    placeholder="PROD-001"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Unit Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.unit_price}
                                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                    placeholder="100.00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_type">Payment Type</Label>
                            <select
                                id="payment_type"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.payment_type}
                                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                            >
                                <option value="cash">Cash</option>
                                <option value="cheque">Cheque</option>
                                <option value="credit">Credit</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Sale' : 'Create Sale')}
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
