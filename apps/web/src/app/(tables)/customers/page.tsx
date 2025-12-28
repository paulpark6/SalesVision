'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Client {
    client_number: string;
    client_name: string;
    client_category?: string;
    client_grade?: string;
    client_type?: string;
    contact_name?: string;
    contact_phone?: string;
    address?: string;
    current_staff_id?: string;
    average_amount?: number;
    yearly_amount?: number;
}

export default function CustomersPage() {
    const { auth } = useAuth();
    const [customers, setCustomers] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin' || auth?.role === 'manager';

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await apiClient<Client[]>('/clients/');
            setCustomers(data);
        } catch (error) {
            console.error('Failed to load customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (clientNumber: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            await apiClient(`/clients/${clientNumber}/`, { method: 'DELETE' });
            setCustomers(customers.filter(cust => cust.client_number !== clientNumber));
        } catch (error) {
            console.error('Failed to delete customer:', error);
            alert('Failed to delete customer');
        }
    };

    const handleAdd = async (newData: Partial<Client>) => {
        try {
            await apiClient('/clients/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add customer:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Client, any>[]>(() => [
        {
            accessorKey: 'client_number',
            header: 'Client #',
            cell: ({ row }) => <span className="font-bold font-mono text-xs">{row.getValue('client_number')}</span>,
        },
        {
            accessorKey: 'client_name',
            header: 'Name',
            cell: ({ row }) => <span className="font-medium">{row.getValue('client_name')}</span>,
        },
        {
            accessorKey: 'client_category',
            header: 'Category',
        },
        {
            accessorKey: 'client_grade',
            header: 'Grade',
        },
        {
            accessorKey: 'client_type',
            header: 'Type',
        },
        {
            accessorKey: 'contact_name',
            header: 'Contact',
        },
        {
            accessorKey: 'contact_phone',
            header: 'Phone',
        },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('address')}</div>,
        },
        {
            accessorKey: 'current_staff_id',
            header: 'Staff',
        },
        {
            accessorKey: 'yearly_amount',
            header: () => <div className="text-right">Yearly Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('yearly_amount'));
                return <div className="text-right font-medium">{amount?.toLocaleString() || '0'}</div>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                        <Link href={`/customers/${row.original.client_number}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                            onClick={() => handleDelete(row.original.client_number)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit, customers]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Customers"
                description="Manage your customer database with Excel-like controls."
                columns={columns}
                data={customers}
                searchKey="client_name"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
