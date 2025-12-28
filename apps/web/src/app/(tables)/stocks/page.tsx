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

interface Stock {
    id: number;
    product_category: string;
    product_code: string;
    product_description: string;
    average_sales_quantity: number;
    stock_quantity: number;
    duration_period: number;
    check_date: string;
    monthly_review: string;
}

export default function StocksPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';
            const data = await apiClient<Stock[]>(`/stocks/${monthsParam}`);
            setStocks(data);
        } catch (error) {
            console.error('Failed to load stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<Stock>) => {
        try {
            await apiClient('/stocks/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add stock:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Stock, any>[]>(() => [
        {
            accessorKey: 'product_code',
            header: 'Product',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold">{row.getValue('product_code')}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{row.original.product_description}</span>
                </div>
            ),
        },
        {
            accessorKey: 'product_category',
            header: 'Category',
        },
        {
            accessorKey: 'average_sales_quantity',
            header: () => <div className="text-right">Avg Sales</div>,
            cell: ({ row }) => <div className="text-right text-sm">{parseFloat(row.getValue('average_sales_quantity'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'stock_quantity',
            header: () => <div className="text-right">Stock Qty</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm">{parseFloat(row.getValue('stock_quantity'))?.toLocaleString() || '0'}</div>,
        },
        {
            accessorKey: 'duration_period',
            header: () => <div className="text-right">Duration</div>,
            cell: ({ row }) => <div className="text-right text-sm">{row.getValue('duration_period')}</div>,
        },
        {
            accessorKey: 'check_date',
            header: 'Check Date',
            meta: { type: 'date' },
            cell: ({ row }) => <span className="text-sm whitespace-nowrap">{row.getValue('check_date')}</span>,
        },
        {
            accessorKey: 'monthly_review',
            header: 'Review',
            cell: ({ row }) => <span className="text-xs italic text-muted-foreground truncate block max-w-[150px]">{row.getValue('monthly_review')}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/stocks/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Inventory Levels"
                description="Current stock quantities"
                columns={columns}
                data={stocks}
                searchKey="product_code"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
