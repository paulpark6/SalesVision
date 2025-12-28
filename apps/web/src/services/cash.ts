
import { apiClient } from '@/lib/api-client';

export interface CashRecord {
    id: number;
    date: string;
    client_id: number;
    client_number?: string;
    employee_id: number;
    staff_id?: string;
    cash_origin?: string;
    cash_amount: number;
    weekly_review?: string;
    sale_num?: number;
}

export interface CashRecordCreate {
    date: string;
    client_id: number;
    employee_id: number;
    cash_origin?: string;
    cash_amount: number;
    weekly_review?: string;
    sale_num?: number;
}

export const cashService = {
    getCashRecords: async () => {
        return apiClient<CashRecord[]>('/cash/');
    },

    createCashRecord: async (data: CashRecordCreate) => {
        return apiClient<CashRecord>('/cash/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCashRecord: async (id: number, data: Partial<CashRecordCreate>) => {
        return apiClient<CashRecord>(`/cash/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCashRecord: async (id: number) => {
        return apiClient<void>(`/cash/${id}`, {
            method: 'DELETE',
        });
    }
};
