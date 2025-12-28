'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useMonthFilter } from '@/contexts/month-filter-context';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

interface Expenditure {
    id: number;
    date: string;
    payment_way: string;
    staff_id?: string;
    product_code: string;
    product_description?: string;
    expenditure_category?: string;
    receipt_availability?: string;
    cost: number;
}

export default function ExpendituresPage() {
    const router = useRouter();
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<Expenditure[]>(`/expenditures/${monthsParam}`);
            setExpenditures(data);
        } catch (error) {
            console.error('Failed to load expenditures:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth && auth.role !== 'admin') {
            router.replace(auth.role === 'manager' ? '/manager' : '/staff');
            return;
        }
        if (auth?.role === 'admin') loadData();
    }, [auth, router, selectedMonths]);

    const handleAdd = async (newData: Partial<Expenditure>) => {
        try {
            await apiClient('/expenditures/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add expenditure:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Expenditure, any>[]>(() => [
        {
            accessorKey: 'date',
            header: 'Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('date')}</span>,
        },
        {
            accessorKey: 'payment_way',
            header: 'Payment',
            cell: ({ row }) => <span className="text-xs uppercase font-medium">{row.getValue('payment_way')}</span>,
        },
        {
            accessorKey: 'staff_id',
            header: 'Staff ID',
        },
        {
            accessorKey: 'product_code',
            header: 'Product',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold block">{row.getValue('product_code')}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{row.original.product_description}</span>
                </div>
            ),
        },
        {
            accessorKey: 'expenditure_category',
            header: 'Category',
        },
        {
            accessorKey: 'receipt_availability',
            header: 'Receipt',
        },
        {
            accessorKey: 'cost',
            header: () => <div className="text-right">Cost</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm">{parseFloat(row.getValue('cost'))?.toLocaleString() || '0'}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                        <Link href={`/expenditures/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                </div>
            ),
        }
    ], []);

    if (!auth || auth.role !== 'admin') return null;

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Expenditure Records"
                description="Company expenses (Admin only)"
                columns={columns}
                data={expenditures}
                searchKey="product_code"
                isLoading={loading}
                onAdd={handleAdd}
            />
        </div>
    );
}
