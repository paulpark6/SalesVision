
import { apiClient } from '@/lib/api-client';

export interface Commission {
    id: number;
    employee_id?: number;
    staff_number?: string;
    amount: number;
    date: string;
    classification?: string;
    clients_type?: string;
}

export interface CommissionCreate {
    employee_id?: number;
    staff_number?: string;
    amount: number;
    date: string;
}

export const commissionsService = {
    getCommissions: async () => {
        return apiClient<Commission[]>('/commissions/');
    },

    createCommission: async (data: CommissionCreate) => {
        return apiClient<Commission>('/commissions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCommission: async (id: number, data: Partial<CommissionCreate>) => {
        return apiClient<Commission>(`/commissions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCommission: async (id: number) => {
        return apiClient<void>(`/commissions/${id}`, {
            method: 'DELETE',
        });
    }
};
