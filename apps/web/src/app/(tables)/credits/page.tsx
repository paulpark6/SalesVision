'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMonthFilter } from '@/contexts/month-filter-context';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

interface Credit {
    credit_id: number;
    date: string;
    client_number: string;
    staff_number?: string;
    payment_status?: string;
    credit_amount: number;
    payment_type?: string;
    due_date?: string;
}

export default function CreditsPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [credits, setCredits] = useState<Credit[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin' || auth?.role === 'manager';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<Credit[]>(`/credits/${monthsParam}`);
            setCredits(data);
        } catch (error) {
            console.error('Failed to load credits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<Credit>) => {
        try {
            await apiClient('/credits/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add credit:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Credit, any>[]>(() => [
        {
            accessorKey: 'date',
            header: 'Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('date')}</span>,
        },
        {
            accessorKey: 'client_number',
            header: 'Client #',
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('client_number')}</span>,
        },
        {
            accessorKey: 'staff_number',
            header: 'Staff #',
        },
        {
            accessorKey: 'payment_status',
            header: 'Status',
            cell: ({ row }) => <span className="text-xs uppercase font-medium">{row.getValue('payment_status')}</span>,
        },
        {
            accessorKey: 'credit_amount',
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('credit_amount'));
                return <div className="text-right font-bold text-sm">{amount?.toLocaleString() || '0'}</div>;
            },
        },
        {
            accessorKey: 'payment_type',
            header: 'Payment',
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('due_date')}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/credits/${row.original.credit_id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Credit Records"
                description="Outstanding customer credits"
                columns={columns}
                data={credits}
                searchKey="client_number"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
