'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SaleForm } from '@/components/forms/sale-form';

export default function EditSalePage() {
    const params = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSale() {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/sales/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSale(data);
                } else {
                    console.error('Failed to fetch sale');
                }
            } catch (error) {
                console.error('Error loading sale:', error);
            } finally {
                setLoading(false);
            }
        }
        loadSale();
    }, [params.id]);

    if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
    if (!sale) return <p className="p-8 text-destructive">Sale not found</p>;

    return <SaleForm initialData={sale} isEdit={true} />;
}
