
import { apiClient } from '@/lib/api-client';

export interface PriceListItem {
    id: number;
    product_code: string;
    product_description?: string;
    client_grade?: string;
    price: number;
}

export interface PriceListItemCreate {
    product_code: string;
    product_description?: string;
    client_grade?: string;
    price: number;
}

export const priceListService = {
    getPriceList: async () => {
        return apiClient<PriceListItem[]>('/price-lists/');
    },

    createPriceListItem: async (data: PriceListItemCreate) => {
        return apiClient<PriceListItem>('/price-lists/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updatePriceListItem: async (id: number, data: Partial<PriceListItemCreate>) => {
        return apiClient<PriceListItem>(`/price-lists/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deletePriceListItem: async (id: number) => {
        return apiClient<void>(`/price-lists/${id}`, {
            method: 'DELETE',
        });
    }
};
