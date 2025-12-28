
import { apiClient } from '@/lib/api-client';

export interface Employee {
    id: number;
    staff_number?: string;
    manager_id?: number;
    name: string;
    division?: string;
    position?: string;
    phone_number?: string;
    email?: string;
    working_start?: string;
    status?: string;
    whatsapp?: string;
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_number?: string;
}

export interface EmployeeCreate {
    staff_number?: string;
    name: string;
    division?: string;
    position?: string;
    phone_number?: string;
    email?: string;
    working_start?: string;
    manager_id?: number;
}

export const employeesService = {
    getEmployees: async () => {
        return apiClient<Employee[]>('/employees/');
    },

    createEmployee: async (data: EmployeeCreate) => {
        return apiClient<Employee>('/employees/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateEmployee: async (id: number, data: Partial<EmployeeCreate>) => {
        return apiClient<Employee>(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteEmployee: async (id: number) => {
        return apiClient<void>(`/employees/${id}`, {
            method: 'DELETE',
        });
    }
};
