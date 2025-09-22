
'use client';

import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { customers as allCustomers, products as allProducts } from '@/lib/mock-data';
import type { SalesTargetCustomer } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { X, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Combobox } from '@/components/ui/combobox';

const initialCustomerData: SalesTargetCustomer[] = [
    {
        id: 'cust-001',
        name: 'Acme Inc.',
        salesperson: 'Jane Smith',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 12000, july: 12500, august: 11800, target: 13000 },
            { id: 'prod-002', name: 'Wireless Mouse', june: 500, july: 550, august: 520, target: 600 },
        ]
    },
    {
        id: 'cust-002',
        name: 'Stark Industries',
        salesperson: 'Alex Ray',
        products: [
            { id: 'prod-003', name: 'Docking Station', june: 1500, july: 1600, august: 1550, target: 1700 },
        ]
    },
    {
        id: 'cust-003',
        name: 'Wayne Enterprises',
        salesperson: 'John Doe',
        products: [
            { id: 'prod-001', name: 'Laptop Model X', june: 24000, july: 25000, august: 23600, target: 26000 },
            { id: 'prod-004', name: 'Keyboard Pro', june: 600, july: 620, august: 650, target: 700 },
        ]
    },
];

export default function SalesTargetPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { auth } = useAuth();
    const role = auth?.role;

    const [isMounted, setIsMounted] = useState(false);
    const [customerData, setCustomerData] = useState<SalesTargetCustomer[]>(initialCustomerData);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [editingCell, setEditingCell] = useState<{ customerId: string; productId: string; month: 'june' | 'july' | 'august' | 'target' } | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (auth === undefined) return;
        if (!auth) {
            router.push('/login');
        }
    }, [auth, router]);

    const handleBack = useCallback(() => {
        const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
        router.push(dashboardPath);
    }, [role, router]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }, []);

    const handleAddCustomer = useCallback(() => {
        const newCustomerId = `cust-${Date.now()}`;
        setCustomerData(prev => [
            ...prev,
            {
                id: newCustomerId,
                name: '',
                salesperson: auth?.name || 'Unassigned',
                products: [],
            }
        ]);
    }, [auth?.name]);

    const handleAddProduct = useCallback((customerId: string) => {
        setCustomerData(prevData =>
            prevData.map(customer => {
                if (customer.id === customerId) {
                    const newProductId = `prod-${Date.now()}`;
                    const updatedProducts = [
                        ...customer.products,
                        { id: newProductId, name: '', june: 0, july: 0, august: 0, target: 0 }
                    ];
                    return { ...customer, products: updatedProducts };
                }
                return customer;
            })
        );
    }, []);

    const handleCustomerChange = useCallback((customerId: string, newName: string) => {
        setCustomerData(prevData =>
            prevData.map(customer =>
                customer.id === customerId ? { ...customer, name: newName } : customer
            )
        );
    }, []);

    const handleProductChange = useCallback((customerId: string, productId: string, newName: string) => {
        setCustomerData(prevData =>
            prevData.map(customer => {
                if (customer.id === customerId) {
                    const updatedProducts = customer.products.map(product =>
                        product.id === productId ? { ...product, name: newName } : product
                    );
                    return { ...customer, products: updatedProducts };
                }
                return customer;
            })
        );
    }, []);

    const handleNumericChange = useCallback((customerId: string, productId: string, month: 'june' | 'july' | 'august' | 'target', value: string) => {
        const numericValue = parseFloat(value) || 0;
        setCustomerData(prevData =>
            prevData.map(customer => {
                if (customer.id === customerId) {
                    const updatedProducts = customer.products.map(product =>
                        product.id === productId ? { ...product, [month]: numericValue } : product
                    );
                    return { ...customer, products: updatedProducts };
                }
                return customer;
            })
        );
    }, []);

    const handleRemoveCustomer = useCallback((customerId: string) => {
        setCustomerData(prevData => prevData.filter(customer => customer.id !== customerId));
    }, []);

    const handleRemoveProduct = useCallback((customerId: string, productId: string) => {
        setCustomerData(prevData =>
            prevData.map(customer => {
                if (customer.id === customerId) {
                    const updatedProducts = customer.products.filter(product => product.id !== productId);
                    return { ...customer, products: updatedProducts };
                }
                return customer;
            })
        );
    }, []);

    const handleSubmit = useCallback(() => {
        toast({
            title: 'Targets Submitted',
            description: 'The sales targets for September have been submitted for approval.',
        });
        handleBack();
    }, [toast, handleBack]);

    const employeeTotals = useMemo(() => {
        const totals: { [key: string]: { june: number, july: number, august: number, target: number } } = {};
        if (customerData) {
            customerData.forEach(customer => {
                if (!totals[customer.salesperson]) {
                    totals[customer.salesperson] = { june: 0, july: 0, august: 0, target: 0 };
                }
                customer.products.forEach(product => {
                    totals[customer.salesperson].june += product.june;
                    totals[customer.salesperson].july += product.july;
                    totals[customer.salesperson].august += product.august;
                    totals[customer.salesperson].target += product.target;
                });
            });
        }
        return totals;
    }, [customerData]);

    const grandTotal = useMemo(() => {
        return Object.values(employeeTotals).reduce(
            (acc, totals) => {
                acc.june += totals.june;
                acc.july += totals.july;
                acc.august += totals.august;
                acc.target += totals.target;
                return acc;
            },
            { june: 0, july: 0, august: 0, target: 0 }
        );
    }, [employeeTotals]);

    const customerOptions = useMemo(() => allCustomers.map(c => ({ value: c.label, label: c.label })), []);
    const productOptions = useMemo(() => allProducts.map(p => ({ value: p.label, label: p.label })), []);

    if (!role || !isMounted) {
        return null; // Or a loading spinner
    }

    return (
        <SidebarProvider>
            <AppSidebar role={role} />
            <SidebarInset>
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">월별 매출 목표 설정</h1>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={handleBack}>
                                Back to Dashboard
                            </Button>
                            <Button type="button" onClick={handleSubmit}>
                                Submit for Approval
                            </Button>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>9월 매출 목표</CardTitle>
                            <CardDescription>
                                6-8월 실적을 참고하여 9월 매출 목표를 설정합니다. 고객 또는 제품을 추가하여 목표를 관리하세요.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table className="min-w-max">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">고객명</TableHead>
                                            <TableHead className="w-[200px]">제품명</TableHead>
                                            <TableHead className="text-right w-[120px]">6월 실적</TableHead>
                                            <TableHead className="text-right w-[120px]">7월 실적</TableHead>
                                            <TableHead className="text-right w-[120px]">8월 실적</TableHead>
                                            <TableHead className="text-right w-[120px]">9월 목표</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerData.map((customer, custIndex) => (
                                            <Fragment key={customer.id}>
                                                {customer.products.map((product, prodIndex) => (
                                                    <TableRow key={product.id}>
                                                        {prodIndex === 0 && (
                                                            <TableCell rowSpan={customer.products.length || 1} className="align-top border-r">
                                                                <div className="flex items-start gap-2">
                                                                    <Combobox
                                                                        items={customerOptions}
                                                                        placeholder="고객 선택"
                                                                        searchPlaceholder="고객 검색..."
                                                                        noResultsMessage="고객을 찾을 수 없습니다."
                                                                        value={customer.name}
                                                                        onValueChange={(newValue) => handleCustomerChange(customer.id, newValue)}
                                                                    />
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 mt-0.5" onClick={() => handleRemoveCustomer(customer.id)}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                        <TableCell>
                                                            <Combobox
                                                                items={productOptions}
                                                                placeholder="제품 선택"
                                                                searchPlaceholder="제품 검색..."
                                                                noResultsMessage="제품을 찾을 수 없습니다."
                                                                value={product.name}
                                                                onValueChange={(newValue) => handleProductChange(customer.id, product.id, newValue)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(product.june)}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(product.july)}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(product.august)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Input
                                                                type="number"
                                                                value={product.target}
                                                                onChange={(e) => handleNumericChange(customer.id, product.id, 'target', e.target.value)}
                                                                className="h-8 text-right"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleRemoveProduct(customer.id, product.id)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell className={customer.products.length > 0 ? "border-r" : ""}></TableCell>
                                                    <TableCell colSpan={6}>
                                                        <Button variant="outline" size="sm" onClick={() => handleAddProduct(customer.id)}>
                                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Button variant="secondary" onClick={handleAddCustomer} className="mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
                                </Button>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-2">담당자별 요약</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>담당자</TableHead>
                                            <TableHead className="text-right">6월 합계</TableHead>
                                            <TableHead className="text-right">7월 합계</TableHead>
                                            <TableHead className="text-right">8월 합계</TableHead>
                                            <TableHead className="text-right">9월 목표 합계</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(employeeTotals).map(([name, totals]) => (
                                            <TableRow key={name}>
                                                <TableCell className="font-medium">{name}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(totals.june)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(totals.july)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(totals.august)}</TableCell>
                                                <TableCell className="text-right font-bold">{formatCurrency(totals.target)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-bold bg-muted/50">
                                            <TableCell>총계</TableCell>
                                            <TableCell className="text-right">{formatCurrency(grandTotal.june)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(grandTotal.july)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(grandTotal.august)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(grandTotal.target)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
