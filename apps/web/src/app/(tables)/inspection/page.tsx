'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { employeesService } from "@/services/employees";
import { customersService } from "@/services/customers";
import { productsService } from "@/services/products";
import { salesService } from "@/services/sales";

export default function InspectionPage() {
    const [activeTab, setActiveTab] = useState("employees");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (tab: string) => {
        setLoading(true);
        setError(null);
        try {
            let result: any[] = [];
            switch (tab) {
                case "employees":
                    result = await employeesService.getEmployees();
                    break;
                case "clients":
                    result = await customersService.getCustomers();
                    break;
                case "products":
                    result = await productsService.getProducts();
                    break;
                case "sales":
                    result = await salesService.getSales();
                    break;
            }
            setData(result);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    const getColumns = (tab: string) => {
        if (data.length === 0) return [];
        return Object.keys(data[0]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Database Inspection</h1>
                    <p className="text-muted-foreground">
                        Raw data view for verifying Primary Keys and Foreign Keys.
                    </p>
                </div>
                <Button onClick={() => fetchData(activeTab)} disabled={loading} variant="outline" className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Tabs defaultValue="employees" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                </TabsList>

                {["employees", "clients", "products", "sales"].map((tab) => (
                    <TabsContent key={tab} value={tab} className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="capitalize">{tab} Data</CardTitle>
                                <CardDescription>
                                    All available fields from the {tab} table.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                                        Error: {error}
                                    </div>
                                )}

                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {getColumns(tab).map((col) => (
                                                    <TableHead key={col} className="bg-muted font-bold">
                                                        {col}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.length > 0 ? (
                                                data.map((row, i) => (
                                                    <TableRow key={i}>
                                                        {getColumns(tab).map((col) => (
                                                            <TableCell key={col}>
                                                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={10} className="h-24 text-center">
                                                        {loading ? "Loading..." : "No records found."}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
