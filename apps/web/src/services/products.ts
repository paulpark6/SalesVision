import { apiClient } from '@/lib/api-client';

export interface Product {
    id: number;
    product_code?: string;
    product_description: string;
    product_category?: string;
    unit_cost: number;
    classification?: string;
    credit_or_cash?: string;
    amount?: number;
    upload_date?: string;
}

export interface ProductCreate {
    product_code?: string;
    product_description: string;
    unit_cost: number;
    product_category?: string;
}

export const productsService = {
    getProducts: async () => {
        return apiClient<Product[]>('/products/');
    },

    createProduct: async (data: ProductCreate) => {
        return apiClient<Product>('/products/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateProduct: async (id: number, data: Partial<ProductCreate>) => {
        return apiClient<Product>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteProduct: async (id: number) => {
        return apiClient<void>(`/products/${id}`, {
            method: 'DELETE',
        });
    }
};
