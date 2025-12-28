import { apiClient } from '@/lib/api-client';

export interface Sale {
    sale_num: number;
    inventory_status?: string;
    product_id: number;
    product_code?: string;
    invoice_num?: string;
    sale_date: string;
    quantity: number;
    client_id: number;
    client_number?: string;
    employee_id?: number;
    staff_number?: string;
    unit_price: number;
    sale_amount: number;
    payment_type?: string;
    created_at: string;
    updated_at: string;
}

export interface SaleCreate {
    client_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    sale_date: string;
    employee_id?: number;
}

export const salesService = {
    getSales: async () => {
        return apiClient<Sale[]>('/sales/');
    },

    getSale: async (sale_num: number) => {
        return apiClient<Sale>(`/sales/${sale_num}`);
    },

    createSale: async (data: SaleCreate) => {
        return apiClient<Sale>('/sales/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateSale: async (sale_num: number, data: Partial<SaleCreate>) => {
        return apiClient<Sale>(`/sales/${sale_num}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteSale: async (sale_num: number) => {
        return apiClient<void>(`/sales/${sale_num}`, {
            method: 'DELETE',
        });
    }
};
