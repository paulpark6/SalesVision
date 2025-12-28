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

interface Sale {
    sale_num: number;
    inventory_status?: string;
    product_code: string;
    invoice_num?: string;
    sale_date: string;
    quantity: number;
    client_number?: string;
    staff_number: string;
    unit_price: number;
    sale_amount: number;
    payment_type?: string;
}

export default function SalesPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [sales, setSales] = useState<Sale[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    const loadData = async () => {
        setLoading(true);
        try {
            const monthsParam = selectedMonths.length > 0
                ? `?months=${selectedMonths.join(',')}`
                : '';

            // Parallel fetch for all required data
            const [salesData, productsData, clientsData, employeesData] = await Promise.all([
                apiClient<Sale[]>(`/sales/${monthsParam}`),
                apiClient<any[]>('/products/'),
                apiClient<any[]>('/clients/'),
                apiClient<any[]>('/employees/')
            ]);

            setSales(salesData);
            setProducts(productsData);
            setClients(clientsData);
            setEmployees(employeesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedMonths]);

    const handleAdd = async (newData: Partial<Sale>) => {
        try {
            await apiClient('/sales/', {
                method: 'POST',
                body: JSON.stringify(newData),
            });
            await loadData();
        } catch (error) {
            console.error('Failed to add sale:', error);
            throw error;
        }
    };

    const productOptions = useMemo(() => products.map(p => ({
        value: p.product_code,
        label: `${p.product_code} - ${p.product_name}`
    })), [products]);

    const clientOptions = useMemo(() => clients.map(c => ({
        value: c.client_number,
        label: `${c.client_number} - ${c.client_name}`
    })), [clients]);

    const staffOptions = useMemo(() => employees.map(e => ({
        value: e.staff_number,
        label: `${e.staff_number} - ${e.first_name} ${e.last_name}`
    })), [employees]);

    const columns = useMemo<ColumnDef<Sale, any>[]>(() => [
        {
            accessorKey: 'invoice_num',
            header: 'Invoice',
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('invoice_num')}</span>,
        },
        {
            accessorKey: 'sale_date',
            header: 'Date',
            cell: ({ row }) => <span className="text-xs whitespace-nowrap">{row.getValue('sale_date')}</span>,
            meta: { type: 'date' },
        },
        {
            accessorKey: 'inventory_status',
            header: 'Status',
            cell: ({ row }) => <span className="text-xs uppercase">{row.getValue('inventory_status')}</span>,
        },
        {
            accessorKey: 'product_code',
            header: 'Product',
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('product_code')}</span>,
            meta: {
                type: 'select',
                options: productOptions
            },
        },
        {
            accessorKey: 'client_number',
            header: 'Client #',
            meta: {
                type: 'select',
                options: clientOptions
            },
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-right">Qty</div>,
            cell: ({ row }) => <div className="text-right">{row.getValue('quantity')}</div>,
            meta: { type: 'number' },
        },
        {
            accessorKey: 'unit_price',
            header: () => <div className="text-right">Unit Price</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('unit_price'));
                return <div className="text-right">{amount?.toLocaleString() || '0'}</div>;
            },
            meta: { type: 'number' },
        },
        {
            accessorKey: 'sale_amount',
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('sale_amount'));
                return <div className="text-right font-bold">{amount?.toLocaleString() || '0'}</div>;
            },
            meta: { type: 'number' },
        },
        {
            accessorKey: 'payment_type',
            header: 'Payment',
            cell: ({ row }) => <span className="text-xs">{row.getValue('payment_type')}</span>,
        },
        {
            accessorKey: 'staff_number',
            header: 'Staff',
            meta: {
                type: 'select',
                options: staffOptions
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {canEdit && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-primary">
                            <Link href={`/sales/${row.original.sale_num}`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            ),
        }
    ], [canEdit, productOptions, clientOptions, staffOptions]);

    const defaultValues = useMemo(() => {
        if (!auth?.employeeId || employees.length === 0) return {};
        const myEmployee = employees.find(e => e.id === auth.employeeId);
        return myEmployee ? { staff_number: myEmployee.staff_number } : {};
    }, [auth, employees]);

    return (
        <div className="p-6 space-y-6">
            <ExcelGrid
                title="Sales Transactions"
                description={auth?.role === 'admin' ? 'Managed all sales' : auth?.role === 'manager' ? 'Team sales' : 'Your sales'}
                columns={columns}
                data={sales}
                searchKey="invoice_num"
                isLoading={loading}
                onAdd={handleAdd}
                defaultValues={defaultValues}
            />
        </div>
    );
}
