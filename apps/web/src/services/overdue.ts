
import { apiClient } from '@/lib/api-client';

export interface OverdueCollection {
    id: string;
    date: string;
    client_id: string;
    staff_id: string;
    credit_due_date: string;
    credit_amount: number;
    action?: string;
    credit_id?: number;
}

export interface OverdueCollectionCreate {
    date: string;
    client_id: string;
    staff_id: string;
    credit_due_date: string;
    credit_amount: number;
    action?: string;
    credit_id?: number;
}

export const overdueService = {
    getOverdueCollections: async () => {
        return apiClient<OverdueCollection[]>('/overdue-collections/');
    },

    createOverdueCollection: async (data: OverdueCollectionCreate) => {
        return apiClient<OverdueCollection>('/overdue-collections/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateOverdueCollection: async (id: string, data: Partial<OverdueCollectionCreate>) => {
        return apiClient<OverdueCollection>(`/overdue-collections/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteOverdueCollection: async (id: string) => {
        return apiClient<void>(`/overdue-collections/${id}`, {
            method: 'DELETE',
        });
    }
};
