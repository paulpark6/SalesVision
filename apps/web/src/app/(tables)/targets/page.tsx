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

interface MonthlySalesTarget {
    id: number;
    product_code: string;
    product_description?: string;
    staff_id: string;
    sales_amount_minus_3_month?: number;
    sales_amount_minus_2_month?: number;
    sales_amount_minus_1_month?: number;
    sales_monthly_target: number;
    company_target?: number;
    target_date?: string;
}

export default function TargetsPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [targets, setTargets] = useState<MonthlySalesTarget[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<MonthlySalesTarget[]>(`/monthly-sales-targets/${monthsParam}`);
            setTargets(data);
        } catch (error) {
            console.error('Failed to load targets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<MonthlySalesTarget>) => {
        try {
            await apiClient('/monthly-sales-targets/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add target:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<MonthlySalesTarget, any>[]>(() => [
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
            accessorKey: 'staff_id',
            header: 'Staff ID',
            cell: ({ row }) => <span className="text-xs font-medium">{row.getValue('staff_id')}</span>,
        },
        {
            accessorKey: 'target_date',
            header: 'Target Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('target_date')}</span>,
        },
        {
            accessorKey: 'sales_amount_minus_3_month',
            header: () => <div className="text-right">-3M Sales</div>,
            cell: ({ row }) => <div className="text-right text-xs">{parseFloat(row.getValue('sales_amount_minus_3_month'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'sales_amount_minus_2_month',
            header: () => <div className="text-right">-2M Sales</div>,
            cell: ({ row }) => <div className="text-right text-xs">{parseFloat(row.getValue('sales_amount_minus_2_month'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'sales_amount_minus_1_month',
            header: () => <div className="text-right">-1M Sales</div>,
            cell: ({ row }) => <div className="text-right text-xs">{parseFloat(row.getValue('sales_amount_minus_1_month'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'sales_monthly_target',
            header: () => <div className="text-right text-primary">Target</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm text-primary">{parseFloat(row.getValue('sales_monthly_target'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'company_target',
            header: () => <div className="text-right text-muted-foreground">Co. Target</div>,
            cell: ({ row }) => <div className="text-right text-xs text-muted-foreground">{parseFloat(row.getValue('company_target'))?.toLocaleString() || '0'}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/targets/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Sales Targets"
                description="Performance goals by product and staff"
                columns={columns}
                data={targets}
                searchKey="product_code"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
