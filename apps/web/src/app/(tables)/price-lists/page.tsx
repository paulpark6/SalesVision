'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { ExcelGrid } from '@/components/shared/excel-grid';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

interface PriceList {
    id: number;
    product_code: string;
    product_description: string;
    client_grade: string;
    price: number;
}

export default function PriceListsPage() {
    const router = useRouter();
    const { auth } = useAuth();
    const [prices, setPrices] = useState<PriceList[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await apiClient<PriceList[]>('/price-lists/');
            setPrices(data);
        } catch (error) {
            console.error('Failed to load prices:', error);
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
    }, [auth, router]);

    const handleAdd = async (newData: Partial<PriceList>) => {
        try {
            await apiClient('/price-lists/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add price entry:', error);
            throw error;
        }
    };

    const columns = useMemo<ColumnDef<PriceList, any>[]>(() => [
        {
            accessorKey: 'product_code',
            header: 'Product',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold block">{row.getValue('product_code')}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[200px] block">{row.original.product_description}</span>
                </div>
            ),
        },
        {
            accessorKey: 'client_grade',
            header: 'Grade',
            cell: ({ row }) => <span className="text-xs font-medium uppercase">{row.getValue('client_grade')}</span>,
        },
        {
            accessorKey: 'price',
            header: () => <div className="text-right">Price</div>,
            cell: ({ row }) => <div className="text-right font-bold text-sm">{parseFloat(row.getValue('price'))?.toLocaleString() || '0'}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                        <Link href={`/price-lists/${row.original.id}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                </div>
            ),
        }
    ], []);

    if (!auth || auth.role !== 'admin') return null;

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Product Pricing"
                description="Price configurations by client grade (Admin only)"
                columns={columns}
                data={prices}
                searchKey="product_code"
                isLoading={loading}
                onAdd={handleAdd}
            />
        </div>
    );
}
