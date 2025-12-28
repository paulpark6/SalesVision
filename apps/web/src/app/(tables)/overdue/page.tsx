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

interface OverdueCollection {
    id: string;
    date: string;
    client_number: string;
    staff_id?: string;
    credit_period?: number;
    credit_amount: number;
    action?: string;
}

export default function OverduePage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [overdue, setOverdue] = useState<OverdueCollection[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<OverdueCollection[]>(`/overdue-collections/${monthsParam}`);
            setOverdue(data);
        } catch (error) {
            console.error('Failed to load overdue:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<OverdueCollection>) => {
        try {
            await apiClient('/overdue-collections/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add overdue entry:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<OverdueCollection, any>[]>(() => [
        {
            accessorKey: 'date',
            header: 'Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('date')}</span>,
        },
        {
            accessorKey: 'client_number',
            header: 'Client #',
            cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.getValue('client_number')}</span>,
        },
        {
            accessorKey: 'staff_id',
            header: 'Staff ID',
        },
        {
            accessorKey: 'credit_period',
            header: () => <div className="text-right">Period</div>,
            cell: ({ row }) => <div className="text-right text-sm">{row.getValue('credit_period')}</div>,
        },
        {
            accessorKey: 'credit_amount',
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm">{parseFloat(row.getValue('credit_amount'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => <span className="text-xs italic text-muted-foreground truncate block max-w-[200px]">{row.getValue('action')}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/overdue/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Overdue Payments"
                description={auth?.role === 'admin' ? 'All overdue' : auth?.role === 'manager' ? 'Team overdue' : 'Your overdue'}
                columns={columns}
                data={overdue}
                searchKey="client_number"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
