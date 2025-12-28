'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Users, TrendingUp, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
    const { auth } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        activeClients: 0,
        inventoryValue: 0,
        commissionDue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            setLoading(true);
            try {
                // Fetch real data from Cloud SQL via /analytics/summary
                const data = await apiClient<{
                    total_sales: number;
                    active_clients: number;
                    inventory_value: number;
                    commission_due: number;
                    sales_growth_percent?: number;
                }>('/analytics/summary');

                setStats({
                    totalSales: data.total_sales,
                    activeClients: data.active_clients,
                    inventoryValue: data.inventory_value,
                    commissionDue: data.commission_due
                });
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
                // Keep stats at 0 on error
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {auth?.name || 'User'}</h1>
                <p className="text-muted-foreground">
                    Here's what's happening with your sales pipeline today.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">฿{stats.totalSales.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeClients}</div>
                        <p className="text-xs text-muted-foreground">+4 new this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Val.</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">฿{stats.inventoryValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">12 items low stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Commission</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">฿{stats.commissionDue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Payable next Friday</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        Chart placeholder - will implement with Recharts
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
