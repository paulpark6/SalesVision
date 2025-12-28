import { apiClient } from '@/lib/api-client';

export interface Client {
    id: number;
    client_number?: string;
    client_name: string;
    client_category?: string;
    client_grade?: string;
    client_type?: string;
    contact_name?: string;
    contact_position?: string;
    contact_phone?: string;
    contact_name2?: string;
    contact_position2?: string;
    contact_phone2?: string;
    address?: string;
    og_employee_id?: number;
    current_employee_id?: number;
    average_amount?: number;
    yearly_amount?: number;
    information?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClientCreate {
    client_number?: string;
    client_name: string;
    client_grade?: string;
    client_type?: string;
    contact_name?: string;
    contact_phone?: string;
    address?: string;
    og_employee_id?: number;
    current_employee_id?: number;
}

export const customersService = {
    getCustomers: async () => {
        return apiClient<Client[]>('/clients/');
    },

    createCustomer: async (data: ClientCreate) => {
        return apiClient<Client>('/clients/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCustomer: async (id: number, data: Partial<ClientCreate>) => {
        return apiClient<Client>(`/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCustomer: async (id: number) => {
        return apiClient<void>(`/clients/${id}`, {
            method: 'DELETE',
        });
    }
};
