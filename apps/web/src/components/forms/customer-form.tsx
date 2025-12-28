'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface CustomerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function CustomerForm({ initialData, isEdit = false }: CustomerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        client_number: '',
        client_name: '',
        client_category: '',
        client_grade: 'C',
        client_type: '',
        contact_name: '',
        contact_position: '',
        contact_phone: '',
        address: '',
        current_staff_id: '',
        information: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                client_number: initialData.client_number || '',
                client_name: initialData.client_name || '',
                client_category: initialData.client_category || '',
                client_grade: initialData.client_grade || 'C',
                client_type: initialData.client_type || '',
                contact_name: initialData.contact_name || '',
                contact_position: initialData.contact_position || '',
                contact_phone: initialData.contact_phone || '',
                address: initialData.address || '',
                current_staff_id: initialData.current_staff_id || '',
                information: initialData.information || '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/clients/${initialData.client_number}/` : '/clients/';
            const method = isEdit ? 'PUT' : 'POST';

            await apiClient(url, {
                method,
                body: JSON.stringify(formData),
            });

            router.push('/customers');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} customer:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} customer`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/customers"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                    <CardDescription>Enter the customer profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_number">Client Number</Label>
                                <Input
                                    id="client_number"
                                    value={formData.client_number}
                                    onChange={(e) => setFormData({ ...formData, client_number: e.target.value })}
                                    placeholder="CLI-001"
                                    required
                                    disabled={isEdit} // Often cannot change ID/Code after creation
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_name">Client Name</Label>
                                <Input
                                    id="client_name"
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                    placeholder="Company Name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_category">Category</Label>
                                <Input
                                    id="client_category"
                                    value={formData.client_category}
                                    onChange={(e) => setFormData({ ...formData, client_category: e.target.value })}
                                    placeholder="e.g. Retail"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_grade">Grade</Label>
                                <select
                                    id="client_grade"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.client_grade}
                                    onChange={(e) => setFormData({ ...formData, client_grade: e.target.value })}
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_type">Type</Label>
                                <Input
                                    id="client_type"
                                    value={formData.client_type}
                                    onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="current_staff_id">Staff ID</Label>
                                <Input
                                    id="current_staff_id"
                                    value={formData.current_staff_id}
                                    onChange={(e) => setFormData({ ...formData, current_staff_id: e.target.value })}
                                    placeholder="STA-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_name">Contact Name</Label>
                                <Input
                                    id="contact_name"
                                    value={formData.contact_name}
                                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_position">Contact Position</Label>
                                <Input
                                    id="contact_position"
                                    value={formData.contact_position}
                                    onChange={(e) => setFormData({ ...formData, contact_position: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Contact Phone</Label>
                                <Input
                                    id="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="information">Additional Information</Label>
                            <Textarea
                                id="information"
                                value={formData.information}
                                onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
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
