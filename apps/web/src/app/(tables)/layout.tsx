'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MonthFilterProvider } from '@/contexts/month-filter-context';

export default function TablesLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { auth } = useAuth();

    useEffect(() => {
        if (auth === undefined) return;
        if (!auth) {
            router.replace('/login');
        }
    }, [auth, router]);

    if (!auth) {
        return null;
    }

    return (
        <MonthFilterProvider>
            <SidebarProvider>
                <AppSidebar role={auth.role} />
                <SidebarInset className="min-w-0 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 w-full gap-6 p-6 min-w-0">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </MonthFilterProvider>
    );
}
