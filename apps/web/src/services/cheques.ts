
import { apiClient } from '@/lib/api-client';

export interface Cheque {
    id: number;
    receipt_date: string;
    due_date?: string;
    client_id: string;
    staff_id: string;
    issue_bank?: string;
    number_of_cheque: string;
    deposit_bank?: string;
    deposit_date?: string;
    cheque_amount: number;
    approval_status?: string;
    weekly_review?: string;
    sale_num?: number;
}

export interface ChequeCreate {
    receipt_date: string;
    due_date?: string;
    client_id: string;
    staff_id: string;
    issue_bank?: string;
    number_of_cheque: string;
    deposit_bank?: string;
    deposit_date?: string;
    cheque_amount: number;
    approval_status?: string;
    weekly_review?: string;
    sale_num?: number;
}

export const chequesService = {
    getCheques: async () => {
        return apiClient<Cheque[]>('/cheques/');
    },

    createCheque: async (data: ChequeCreate) => {
        return apiClient<Cheque>('/cheques/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCheque: async (id: number, data: Partial<ChequeCreate>) => {
        return apiClient<Cheque>(`/cheques/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCheque: async (id: number) => {
        return apiClient<void>(`/cheques/${id}`, {
            method: 'DELETE',
        });
    }
};
