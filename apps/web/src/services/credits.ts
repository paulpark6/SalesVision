
import { apiClient } from '@/lib/api-client';

export interface CreditRecord {
    credit_id: number;
    date: string;
    client_id: number;
    client_number?: string;
    employee_id: number;
    staff_number?: string;
    sale_num?: number;
    payment_status?: string;
    credit_amount: number;
    credit_payment_type?: string;
    credit_due_date?: string;
}

export interface CreditRecordCreate {
    date: string;
    client_id: number;
    employee_id: number;
    credit_amount: number;
    sale_num?: number;
    payment_status?: string;
    credit_payment_type?: string;
    credit_due_date?: string;
}

export const creditsService = {
    getCreditRecords: async () => {
        return apiClient<CreditRecord[]>('/credits/');
    },

    createCreditRecord: async (data: CreditRecordCreate) => {
        return apiClient<CreditRecord>('/credits/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCreditRecord: async (credit_id: number, data: Partial<CreditRecordCreate>) => {
        return apiClient<CreditRecord>(`/credits/${credit_id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCreditRecord: async (credit_id: number) => {
        return apiClient<void>(`/credits/${credit_id}`, {
            method: 'DELETE',
        });
    }
};
