'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMonthFilter } from '@/contexts/month-filter-context';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Commission {
    id: number;
    staff_number: string;
    staff_name?: string;
    position?: string;
    division?: string;
    commission?: number;
    monthly_review?: number;
    classification?: string;
    clients_type?: string;
    import_product?: number;
    local_product?: number;
    client_transfer_calculation?: number;
}

export default function CommissionsPage() {
    const { auth } = useAuth();
    const { selectedMonths } = useMonthFilter();
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);

    const canEdit = auth?.role === 'admin';

    useEffect(() => {
        async function loadData() {
            try {
                const monthsParam = selectedMonths.length > 0
                    ? `?months=${selectedMonths.join(',')}`
                    : '';
                const data = await apiClient<Commission[]>(`/commissions${monthsParam}`);
                setCommissions(data);
            } catch (error) {
                console.error('Failed to load commissions:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [selectedMonths]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this commission record?')) return;

        try {
            await apiClient(`/commissions/${id}/`, { method: 'DELETE' });
            setCommissions(commissions.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete commission:', error);
            alert('Failed to delete commission');
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Commissions</h1>
                {canEdit && (
                    <Button asChild>
                        <Link href="/commissions/new"><Plus className="mr-2 h-4 w-4" />Add Commission</Link>
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Commission Records</CardTitle>
                    <CardDescription>
                        {auth?.role === 'admin' ? 'All commissions' : auth?.role === 'manager' ? 'Team commissions' : 'Your commissions'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? <p className="text-muted-foreground">Loading...</p> : (
                        <ScrollArea className="h-[600px] w-full rounded-md border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10 text-xs uppercase tracking-wider">
                                    <TableRow>
                                        <TableHead>Staff</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Division</TableHead>
                                        <TableHead className="text-right">Commission</TableHead>
                                        <TableHead className="text-right">Review</TableHead>
                                        <TableHead>Type/Client</TableHead>
                                        <TableHead className="text-right">Import/Local</TableHead>
                                        <TableHead className="text-right">Transfer</TableHead>
                                        {canEdit && <TableHead className="w-[80px]">Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commissions.map((c: Commission) => (
                                        <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <span className="font-mono text-xs font-bold block">{c.staff_number}</span>
                                                <span className="text-[10px] text-muted-foreground">{c.staff_name}</span>
                                            </TableCell>
                                            <TableCell className="text-xs">{c.position}</TableCell>
                                            <TableCell className="text-xs uppercase">{c.division}</TableCell>
                                            <TableCell className="text-right font-bold text-sm text-primary">{c.commission?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-xs">{c.monthly_review?.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs">
                                                <div className="font-medium">{c.classification}</div>
                                                <div className="text-muted-foreground">{c.clients_type}</div>
                                            </TableCell>
                                            <TableCell className="text-right text-xs">
                                                <div>{c.import_product?.toLocaleString()}</div>
                                                <div className="text-muted-foreground">{c.local_product?.toLocaleString()}</div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm">{c.client_transfer_calculation?.toLocaleString()}</TableCell>
                                            {canEdit && (
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                                                            <Link href={`/commissions/${c.id}`}><Pencil className="h-4 w-4" /></Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(c.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
