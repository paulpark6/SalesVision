'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/forms/product-form';

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                } else {
                    console.error('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [params.id]);

    if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
    if (!product) return <p className="p-8 text-destructive">Product not found</p>;

    return <ProductForm initialData={product} isEdit={true} />;
}
