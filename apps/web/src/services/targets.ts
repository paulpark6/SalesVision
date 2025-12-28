
import { apiClient } from '@/lib/api-client';

export interface MonthlySalesTarget {
    id: number;
    staff_id: string;
    product_code: string;
    target_date?: string;
    sales_amount?: number;
    monthly_sales_target: number;
    input_date?: string;
}

export interface MonthlySalesTargetCreate {
    staff_id: string;
    product_code: string;
    target_date?: string;
    sales_amount?: number;
    monthly_sales_target: number;
    input_date?: string;
}

export const targetsService = {
    getTargets: async () => {
        return apiClient<MonthlySalesTarget[]>('/monthly-sales-targets/');
    },

    createTarget: async (data: MonthlySalesTargetCreate) => {
        return apiClient<MonthlySalesTarget>('/monthly-sales-targets/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateTarget: async (id: number, data: Partial<MonthlySalesTargetCreate>) => {
        return apiClient<MonthlySalesTarget>(`/monthly-sales-targets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteTarget: async (id: number) => {
        return apiClient<void>(`/monthly-sales-targets/${id}`, {
            method: 'DELETE',
        });
    }
};
