import { apiClient } from '@/lib/api-client';

export interface EmployeeTarget {
    employee_id: number;
    employee_name: string;
    current_sales: number;
    target_sales: number;
    achievement_rate: number;
}

export interface TeamEmployee {
    name: string;
    target: number;
    actual: number;
    prior_year: number;
}

export interface TeamPerformance {
    month: string;
    year: number;
    employees: TeamEmployee[];
    total_target: number;
    total_actual: number;
    total_prior_year: number;
    achievement_rate: number;
    yoy_growth: number;
}

export interface CustomerCredit {
    customer_id: number;
    customer_name: string;
    employee_name: string;
    nearing: number;
    due: number;
    overdue: number;
    total: number;
}

export interface SalesTrendDataPoint {
    date: string;
    sales_amount: number;
}

export interface SalesTrends {
    data_points: SalesTrendDataPoint[];
    total_sales: number;
    start_date: string;
    end_date: string;
}

export const analyticsService = {
    async getEmployeeTargets(month?: number, year?: number): Promise<EmployeeTarget[]> {
        const params = new URLSearchParams();
        if (month) params.append('month', month.toString());
        if (year) params.append('year', year.toString());

        const queryString = params.toString();
        const url = queryString ? `/analytics/employee-targets?${queryString}` : '/analytics/employee-targets';

        return apiClient<EmployeeTarget[]>(url);
    },

    async getTeamPerformance(month?: number, year?: number): Promise<TeamPerformance> {
        const params = new URLSearchParams();
        if (month) params.append('month', month.toString());
        if (year) params.append('year', year.toString());

        const queryString = params.toString();
        const url = queryString ? `/analytics/team-performance?${queryString}` : '/analytics/team-performance';

        return apiClient<TeamPerformance>(url);
    },

    async getCustomerCredit(): Promise<CustomerCredit[]> {
        return apiClient<CustomerCredit[]>('/analytics/customer-credit');
    },

    async getSalesTrends(startDate?: string, endDate?: string): Promise<SalesTrends> {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const queryString = params.toString();
        const url = queryString ? `/analytics/sales-trends?${queryString}` : '/analytics/sales-trends';

        return apiClient<SalesTrends>(url);
    },
};
