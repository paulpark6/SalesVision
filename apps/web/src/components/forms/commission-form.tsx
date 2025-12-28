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

interface CommissionFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function CommissionForm({ initialData, isEdit = false }: CommissionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        staff_number: '',
        staff: '',
        position: '',
        division: '',
        commission: '',
        monthly_review: '',
        classification: '',
        clients_type: '',
        import_product: '',
        local_product: '',
        client_transfer_calculation: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                staff_number: initialData.staff_number || '',
                staff: initialData.staff || '',
                position: initialData.position || '',
                division: initialData.division || '',
                commission: initialData.commission?.toString() || '',
                monthly_review: initialData.monthly_review?.toString() || '',
                classification: initialData.classification || '',
                clients_type: initialData.clients_type || '',
                import_product: initialData.import_product?.toString() || '',
                local_product: initialData.local_product?.toString() || '',
                client_transfer_calculation: initialData.client_transfer_calculation?.toString() || '',
                date: initialData.date || new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/commissions/${initialData.id}/` : '/commissions/';
            const method = isEdit ? 'PUT' : 'POST';

            // Parse numbers
            const body = {
                ...formData,
                commission: formData.commission === '' ? null : parseFloat(formData.commission),
                monthly_review: formData.monthly_review === '' ? null : parseFloat(formData.monthly_review),
                import_product: formData.import_product === '' ? null : parseFloat(formData.import_product),
                local_product: formData.local_product === '' ? null : parseFloat(formData.local_product),
                client_transfer_calculation: formData.client_transfer_calculation === '' ? null : parseFloat(formData.client_transfer_calculation),
            };

            await apiClient(url, {
                method,
                body: JSON.stringify(body),
            });

            router.push('/commissions');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} commission:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} commission`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/commissions"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Commission' : 'Add New Commission'}</h1>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle>Commission Details</CardTitle>
                    <CardDescription>Enter the commission record information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="staff_number">Staff Number</Label>
                                <Input
                                    id="staff_number"
                                    value={formData.staff_number}
                                    onChange={(e) => setFormData({ ...formData, staff_number: e.target.value })}
                                    placeholder="STA-001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff">Staff Name</Label>
                                <Input
                                    id="staff"
                                    value={formData.staff}
                                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="division">Division</Label>
                                <Input
                                    id="division"
                                    value={formData.division}
                                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="commission">Commission Amount</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    step="0.01"
                                    value={formData.commission}
                                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monthly_review">Monthly Review</Label>
                                <Input
                                    id="monthly_review"
                                    type="number"
                                    step="0.01"
                                    value={formData.monthly_review}
                                    onChange={(e) => setFormData({ ...formData, monthly_review: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Record Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="classification">Classification</Label>
                                <Input
                                    id="classification"
                                    value={formData.classification}
                                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                                    placeholder="e.g. Import"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clients_type">Clients Type</Label>
                                <Input
                                    id="clients_type"
                                    value={formData.clients_type}
                                    onChange={(e) => setFormData({ ...formData, clients_type: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="import_product">Import Product</Label>
                                <Input
                                    id="import_product"
                                    type="number"
                                    step="0.01"
                                    value={formData.import_product}
                                    onChange={(e) => setFormData({ ...formData, import_product: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="local_product">Local Product</Label>
                                <Input
                                    id="local_product"
                                    type="number"
                                    step="0.01"
                                    value={formData.local_product}
                                    onChange={(e) => setFormData({ ...formData, local_product: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_transfer_calculation">Transfer Calculation</Label>
                                <Input
                                    id="client_transfer_calculation"
                                    type="number"
                                    step="0.01"
                                    value={formData.client_transfer_calculation}
                                    onChange={(e) => setFormData({ ...formData, client_transfer_calculation: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Commission' : 'Create Commission')}
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
