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

interface Cheque {
    id: number;
    receipt_date: string;
    due_date: string;
    client_number: string;
    staff_id?: string;
    issue_bank?: string;
    cheque_number: string;
    deposit_bank?: string;
    deposit_date?: string;
    cheque_amount: number;
    approval_status?: string;
    weekly_review?: string;
}

export default function ChequesPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [cheques, setCheques] = useState<Cheque[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin' || auth?.role === 'manager';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<Cheque[]>(`/cheques/${monthsParam}`);
            setCheques(data);
        } catch (error) {
            console.error('Failed to load cheques:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<Cheque>) => {
        try {
            await apiClient('/cheques/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add cheque:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Cheque, any>[]>(() => [
        {
            accessorKey: 'cheque_number',
            header: 'Cheque #',
            cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.getValue('cheque_number')}</span>,
        },
        {
            accessorKey: 'receipt_date',
            header: 'Receipt Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('receipt_date')}</span>,
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('due_date')}</span>,
        },
        {
            accessorKey: 'client_number',
            header: 'Client #',
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('client_number')}</span>,
        },
        {
            accessorKey: 'staff_id',
            header: 'Staff ID',
        },
        {
            accessorKey: 'issue_bank',
            header: 'Issue Bank',
        },
        {
            accessorKey: 'deposit_bank',
            header: 'Deposit Bank',
        },
        {
            accessorKey: 'deposit_date',
            header: 'Deposit Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('deposit_date')}</span>,
        },
        {
            accessorKey: 'cheque_amount',
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm">{parseFloat(row.getValue('cheque_amount'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'approval_status',
            header: 'Status',
            cell: ({ row }) => <span className="text-xs uppercase font-medium">{row.getValue('approval_status')}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/cheques/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Cheque Records"
                description="All cheque payments"
                columns={columns}
                data={cheques}
                searchKey="cheque_number"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
