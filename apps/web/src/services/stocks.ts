
import { apiClient } from '@/lib/api-client';

export interface Stock {
    product_code: string;
    avg_sales_qty?: number;
    avg_sales_price?: number;
    stock_qty: number;
    check_date?: string;
    monthly_review_date?: string;
    monthly_review_desc?: string;
    stock_status?: string;
    created_at: string;
    updated_at: string;
}

export interface StockCreate {
    product_code: string;
    avg_sales_qty?: number;
    avg_sales_price?: number;
    stock_qty: number;
    check_date?: string;
    monthly_review_date?: string;
    monthly_review_desc?: string;
    stock_status?: string;
}

export const stocksService = {
    getStocks: async () => {
        return apiClient<Stock[]>('/stocks/');
    },

    createStock: async (data: StockCreate) => {
        return apiClient<Stock>('/stocks/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateStock: async (product_code: string, data: Partial<StockCreate>) => {
        return apiClient<Stock>(`/stocks/${product_code}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteStock: async (product_code: string) => {
        return apiClient<void>(`/stocks/${product_code}`, {
            method: 'DELETE',
        });
    }
};
