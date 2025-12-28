'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

interface Product {
    product_code: string;
    product_description: string;
    product_category?: string;
    unit_cost: number;
    classification?: string;
    credit_or_cash?: string;
    amount?: number;
    upload_date?: string;
}

export default function ProductsPage() {
    const { auth } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await apiClient<Product[]>('/products/');
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (newData: Partial<Product>) => {
        try {
            await apiClient('/products/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add product:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<Product, any>[]>(() => [
        {
            accessorKey: 'product_code',
            header: 'Code',
            cell: ({ row }) => <span className="font-bold font-mono text-xs">{row.getValue('product_code')}</span>,
        },
        {
            accessorKey: 'product_description',
            header: 'Description',
            cell: ({ row }) => <span className="font-medium text-sm">{row.getValue('product_description')}</span>,
        },
        {
            accessorKey: 'product_category',
            header: 'Category',
        },
        {
            accessorKey: 'unit_cost',
            header: () => <div className="text-right">Unit Cost</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('unit_cost'));
                return <div className="text-right font-medium">{amount?.toLocaleString() || '0'}</div>;
            },
        },
        {
            accessorKey: 'classification',
            header: 'Classification',
        },
        {
            accessorKey: 'credit_or_cash',
            header: 'Pricing',
            cell: ({ row }) => <span className="text-xs uppercase">{row.getValue('credit_or_cash')}</span>,
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                return <div className="text-right font-medium">{amount?.toLocaleString() || '0'}</div>;
            },
        },
        {
            accessorKey: 'upload_date',
            header: 'Upload Date',
            meta: { type: 'date' },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/products/${row.original.product_code}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Products"
                description="Manage your product catalog with Excel-like controls."
                columns={columns}
                data={products}
                searchKey="product_description"
                isLoading={loading}
                onAdd={canEdit ? handleAdd : undefined}
            />
        </div>
    );
}
