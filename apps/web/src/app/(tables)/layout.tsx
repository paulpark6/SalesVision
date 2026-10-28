'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldX } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

type Role = 'admin' | 'manager' | 'employee';

// Mirrors the API's role checks (the API still enforces them). First match wins; unlisted routes are open to all roles.
const ACCESS: [RegExp, Role[]][] = [
    [/^\/(dashboard|expenditures|price-lists)(\/|$)/, ['admin']],
    [/^\/(products|employees)\/.+/, ['admin']],
    [/^\/commissions\/new/, ['admin']],
    [/^\/(employees|inspection)(\/|$)/, ['admin', 'manager']],
    [/^\/customers\/.+/, ['admin', 'manager']],
];

function canAccess(path: string, role: Role) {
    const rule = ACCESS.find(([re]) => re.test(path));
    return !rule || rule[1].includes(role);
}

function NoAccess() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <ShieldX className="h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">You do not have access to this page</h1>
            <p className="text-muted-foreground">Ask an admin if you think you should.</p>
            <Button asChild>
                <Link href="/sales">Go to Sales</Link>
            </Button>
        </div>
    );
}

export default function TablesLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
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
        <SidebarProvider>
            <AppSidebar role={auth.role} />
            <SidebarInset className="min-w-0 flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 w-full gap-6 p-6 min-w-0">
                        {canAccess(pathname, auth.role) ? children : <NoAccess />}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
