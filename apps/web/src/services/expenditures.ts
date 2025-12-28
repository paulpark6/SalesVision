
import { apiClient } from '@/lib/api-client';

export interface Expenditure {
    id: number;
    date: string;
    payment_method?: string;
    payment_amount: number;
    expenditure_description?: string;
    receipt_availability: boolean;
}

export interface ExpenditureCreate {
    date: string;
    payment_method?: string;
    payment_amount: number;
    expenditure_description?: string;
    receipt_availability: boolean;
}

export const expendituresService = {
    getExpenditures: async () => {
        return apiClient<Expenditure[]>('/expenditures/');
    },

    createExpenditure: async (data: ExpenditureCreate) => {
        return apiClient<Expenditure>('/expenditures/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateExpenditure: async (id: number, data: Partial<ExpenditureCreate>) => {
        return apiClient<Expenditure>(`/expenditures/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteExpenditure: async (id: number) => {
        return apiClient<void>(`/expenditures/${id}`, {
            method: 'DELETE',
        });
    }
};
