'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMonthFilter } from '@/contexts/month-filter-context';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface Cash {
    date: string;
    client_number?: string;
    staff_id?: string;
    cash_origin?: string;
    cash_amount?: number;
    payment?: string;
    payment_product?: number;
    payment_expenditure?: number;
    weekly_review?: string;
}

export default function CashPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [cash, setCash] = useState<Cash[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin' || auth?.role === 'manager';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<Cash[]>(`/cash/${monthsParam}`);
            setCash(data);
        } catch (error) {
            console.error('Failed to load cash:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<Cash>) => {
        try {
            await apiClient('/cash/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add cash entry:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Cash, any>[]>(() => [
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
            accessorKey: 'staff_id',
            header: 'Staff ID',
            cell: ({ row }) => <span className="text-xs">{row.getValue('staff_id')}</span>,
        },
        {
            accessorKey: 'cash_origin',
            header: 'Origin',
            cell: ({ row }) => <span className="text-sm">{row.getValue('cash_origin')}</span>,
        },
        {
            accessorKey: 'cash_amount',
            header: () => <div className="text-right">Cash Amount</div>,
            cell: ({ row }) => <div className="text-right font-medium text-sm">{parseFloat(row.getValue('cash_amount'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'payment',
            header: 'Payment',
            cell: ({ row }) => <span className="text-xs uppercase">{row.getValue('payment')}</span>,
        },
        {
            accessorKey: 'payment_product',
            header: () => <div className="text-right">Product Payment</div>,
            cell: ({ row }) => <div className="text-right text-sm">{parseFloat(row.getValue('payment_product'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'payment_expenditure',
            header: () => <div className="text-right">Expenditure</div>,
            cell: ({ row }) => <div className="text-right text-sm">{parseFloat(row.getValue('payment_expenditure'))?.toLocaleString() || '0'}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" disabled className="h-8 w-8 opacity-50 cursor-not-allowed">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Cash Transactions"
                description="Cash inflows and outflows"
                columns={columns}
                data={cash}
                searchKey="client_number"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
