'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EmployeeForm } from '@/components/forms/employee-form';

export default function EditEmployeePage() {
    const params = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEmployee() {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/employees/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEmployee(data);
                } else {
                    console.error('Failed to fetch employee');
                }
            } catch (error) {
                console.error('Error loading employee:', error);
            } finally {
                setLoading(false);
            }
        }
        loadEmployee();
    }, [params.id]);

    if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;
    if (!employee) return <p className="p-8 text-destructive">Employee not found</p>;

    return <EmployeeForm initialData={employee} isEdit={true} />;
}
