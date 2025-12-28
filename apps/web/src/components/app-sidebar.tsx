import Link from 'next/link';
import * as React from 'react';
import {
    LayoutDashboard,
    Bell,
    LineChart,
    Package,
    ShoppingCart,
    Users,
    CreditCard,
    BadgePercent,
    Boxes,
    ChevronDown,
    User,
    Target,
    FileText,
    DollarSign,
    Landmark,
    FileClock,
    Clock,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Sidebar, SidebarHeader, SidebarContent } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode, icon: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + '/');

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            {icon}
            {children}
        </Link>
    )
}

function NavCollapsible({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <div className="flex items-center gap-3">
                        {icon}
                        {title}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}

export function AppSidebar({ role }: { role: 'admin' | 'employee' | 'manager' }) {
    // const dashboardUrl = role === 'admin' ? '/admin' : role === 'manager' ? '/manager' : '/staff';

    return (
        <Sidebar>
            <SidebarHeader className="border-b h-14 lg:h-[60px] px-4 lg:px-6 flex flex-row items-center">
                <Link href="/sales" className="flex items-center gap-2 font-semibold">
                    <LineChart className="h-6 w-6" />
                    <span>SalesVision</span>
                </Link>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                    <Bell className="h-4 w-4" />
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
                    <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                        Dashboard
                    </NavLink>

                    <NavLink href="/sales" icon={<ShoppingCart className="h-4 w-4" />}>
                        Sales
                    </NavLink>

                    <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Data Tables
                    </div>

                    {/* Admin & Manager: Employees */}
                    {(role === 'admin' || role === 'manager') && (
                        <NavLink href="/employees" icon={<User className="h-4 w-4" />}>
                            Employees
                        </NavLink>
                    )}

                    {/* All roles: Customers */}
                    <NavLink href="/customers" icon={<Users className="h-4 w-4" />}>
                        Customers
                    </NavLink>

                    {/* All roles: Products */}
                    <NavLink href="/products" icon={<Package className="h-4 w-4" />}>
                        Products
                    </NavLink>


                    {/* All roles: Cash */}
                    <NavLink href="/cash" icon={<Landmark className="h-4 w-4" />}>
                        Cash
                    </NavLink>

                    {/* All roles: Cheques */}
                    <NavLink href="/cheques" icon={<FileClock className="h-4 w-4" />}>
                        Cheques
                    </NavLink>

                    {/* All roles: Commissions */}
                    <NavLink href="/commissions" icon={<BadgePercent className="h-4 w-4" />}>
                        Commissions
                    </NavLink>

                    {/* All roles: Credits */}
                    <NavLink href="/credits" icon={<CreditCard className="h-4 w-4" />}>
                        Credits
                    </NavLink>

                    {/* Admin only: Expenditures */}
                    {role === 'admin' && (
                        <NavLink href="/expenditures" icon={<DollarSign className="h-4 w-4" />}>
                            Expenditures
                        </NavLink>
                    )}

                    {/* All roles: Stocks */}
                    <NavLink href="/stocks" icon={<Boxes className="h-4 w-4" />}>
                        Stocks
                    </NavLink>

                    {/* Admin only: Price Lists */}
                    {role === 'admin' && (
                        <NavLink href="/price-lists" icon={<FileText className="h-4 w-4" />}>
                            Price Lists
                        </NavLink>
                    )}

                    {/* All roles: Sales Targets */}
                    <NavLink href="/targets" icon={<Target className="h-4 w-4" />}>
                        Sales Targets
                    </NavLink>

                    {/* All roles: Overdue */}
                    <NavLink href="/overdue" icon={<Clock className="h-4 w-4" />}>
                        Overdue
                    </NavLink>

                    {/* Admin & Manager: Inspection Tool */}
                    {(role === 'admin' || role === 'manager') && (
                        <>
                            <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Admin Tools
                            </div>
                            <NavLink href="/inspection" icon={<Search className="h-4 w-4" />}>
                                Database Inspection
                            </NavLink>
                        </>
                    )}
                </nav>
            </SidebarContent>
        </Sidebar>
    );
}
