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

interface EmployeeFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function EmployeeForm({ initialData, isEdit = false }: EmployeeFormProps) {
    const router = useRouter();
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        staff_number: '',
        name: '',
        position: '',
        division: '',
        manager_id: '',
        working_start: '',
        phone_number: '',
        whatsapp: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_number: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                staff_number: initialData.staff_number || '',
                name: initialData.name || '',
                position: initialData.position || '',
                division: initialData.division || '',
                manager_id: initialData.manager_id || '',
                working_start: initialData.working_start || '',
                phone_number: initialData.phone_number || '',
                whatsapp: initialData.whatsapp || '',
                emergency_contact_name: initialData.emergency_contact_name || '',
                emergency_contact_relationship: initialData.emergency_contact_relationship || '',
                emergency_contact_number: initialData.emergency_contact_number || '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/employees/${initialData.staff_number}/` : '/employees/';
            const method = isEdit ? 'PUT' : 'POST';

            // Convert empty strings to null for optional fields
            const body = Object.entries(formData).reduce((acc: any, [key, value]) => {
                acc[key] = value === '' ? null : value;
                return acc;
            }, {});

            await apiClient(url, {
                method,
                body: JSON.stringify(body),
            });

            router.push('/employees');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} employee:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} employee`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/employees"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Employee Details</CardTitle>
                    <CardDescription>Enter the employee information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="staff_number">Staff Number</Label>
                                <Input
                                    id="staff_number"
                                    value={formData.staff_number}
                                    onChange={(e) => setFormData({ ...formData, staff_number: e.target.value })}
                                    placeholder="STAFF-001"
                                    required
                                    disabled={isEdit} // Usually primary keys shouldn't change
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="division">Division</Label>
                                <Input
                                    id="division"
                                    value={formData.division}
                                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                    placeholder="Sales"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager_id">Manager Staff #</Label>
                                <Input
                                    id="manager_id"
                                    value={formData.manager_id}
                                    onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                                    placeholder="MGR-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="working_start">Start Date</Label>
                                <Input
                                    id="working_start"
                                    type="date"
                                    value={formData.working_start}
                                    onChange={(e) => setFormData({ ...formData, working_start: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    placeholder="+1234567890"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                                <Input
                                    id="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                                <Input
                                    id="emergency_contact_relationship"
                                    value={formData.emergency_contact_relationship}
                                    onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                                    placeholder="Spouse"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact_number">Emergency Phone</Label>
                                <Input
                                    id="emergency_contact_number"
                                    value={formData.emergency_contact_number}
                                    onChange={(e) => setFormData({ ...formData, emergency_contact_number: e.target.value })}
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
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
