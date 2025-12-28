'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CustomerForm } from '@/components/forms/customer-form';

export default function EditCustomerPage() {
    const params = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCustomer() {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/clients/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCustomer(data);
                } else {
                    console.error('Failed to fetch customer');
                }
            } catch (error) {
                console.error('Error loading customer:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCustomer();
    }, [params.id]);

    if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
    if (!customer) return <p className="p-8 text-destructive">Customer not found</p>;

    return <CustomerForm initialData={customer} isEdit={true} />;
}
