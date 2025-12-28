'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Employee {
    staff_number: string;
    name: string;
    position?: string;
    division?: string;
    manager_id?: string;
    working_start?: string;
    phone_number?: string;
    whatsapp?: string;
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_number?: string;
}

export default function EmployeesPage() {
    const router = useRouter();
    const { auth } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const canView = auth?.role === 'admin' || auth?.role === 'manager';
    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await apiClient<Employee[]>('/employees/');
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth && auth.role === 'employee') {
            router.replace('/staff');
            return;
        }
        if (canView) loadData();
    }, [auth, canView, router]);

    const handleDelete = async (staffNumber: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;

        try {
            await apiClient(`/employees/${staffNumber}/`, { method: 'DELETE' });
            setEmployees(employees.filter(emp => emp.staff_number !== staffNumber));
        } catch (error) {
            console.error('Failed to delete employee:', error);
            alert('Failed to delete employee');
        }
    };

    const handleAdd = async (newData: Partial<Employee>) => {
        try {
            await apiClient('/employees/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add employee:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Employee, any>[]>(() => [
        {
            accessorKey: 'staff_number',
            header: 'Staff #',
            cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.getValue('staff_number')}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
        },
        {
            accessorKey: 'position',
            header: 'Position',
        },
        {
            accessorKey: 'division',
            header: 'Division',
        },
        {
            accessorKey: 'manager_id',
            header: 'Manager',
        },
        {
            accessorKey: 'working_start',
            header: 'Start Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue('working_start')}</span>,
        },
        {
            accessorKey: 'phone_number',
            header: 'Phone',
        },
        {
            accessorKey: 'whatsapp',
            header: 'WhatsApp',
        },
        {
            accessorKey: 'emergency_contact_name',
            header: 'Emergency Contact',
            cell: ({ row }) => {
                const name = row.original.emergency_contact_name;
                const rel = row.original.emergency_contact_relationship;
                return name ? `${name}${rel ? ` (${rel})` : ''}` : '-';
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                                <Link href={`/employees/${row.original.staff_number}`}><Pencil className="h-4 w-4" /></Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(row.original.staff_number)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        }
    ], [canEdit, employees]);

    if (!canView) return null;

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Employees"
                description={auth?.role === 'admin' ? 'Manage all employees' : 'Your team members'}
                columns={columns}
                data={employees}
                searchKey="name"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
