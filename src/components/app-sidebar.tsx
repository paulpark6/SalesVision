
import Link from 'next/link';
import * as React from 'react';
import {
  Bell,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  BadgePercent,
  Boxes,
  ChevronDown,
  UserPlus,
  User,
  Target,
  PlusCircle,
  FileText,
  AreaChart,
  BarChart,
  DollarSign,
  Landmark,
  FileClock,
  ShoppingBasket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

function NavLink({ href, children, icon, className }: { href: string; children: React.ReactNode, icon: React.ReactNode, className?: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary",
                className
            )}
            >
            {icon}
            {children}
        </Link>
    )
}

function NavCollapsible({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    const pathname = usePathname();
    const childHrefs = React.Children.toArray(children).map((child: any) => child.props.href);
    const isActive = childHrefs.some(href => pathname.startsWith(href));

    return (
        <Collapsible defaultOpen={isActive}>
            <CollapsibleTrigger asChild>
                <div className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer",
                    isActive && "text-primary"
                    )}>
                    <div className="flex items-center gap-3">
                        {icon}
                        {title}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 space-y-1 mt-1">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}


export function AppSidebar({ role }: { role: 'admin' | 'employee' | 'manager' }) {
  const dashboardUrl = role === 'admin' ? '/dashboard' : '/admin';

  return (
    <Sidebar>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href={dashboardUrl} className="flex items-center gap-2 font-semibold">
                <LineChart className="h-6 w-6" />
                <span className="">SalesVision</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
        </div>
        <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink href={dashboardUrl} icon={<Home className="h-4 w-4" />}>
                    Dashboard
                </NavLink>
                <NavLink href="/sales/new" icon={<ShoppingCart className="h-4 w-4" />}>
                    Add Sale
                </NavLink>
                 <NavCollapsible title="Customers" icon={<Users className="h-4 w-4" />}>
                     <NavLink href="/customers" icon={<User className="h-4 w-4" />}>
                        Customer List
                    </NavLink>
                     <NavLink href="/customers/new" icon={<UserPlus className="h-4 w-4" />}>
                        Add Customer
                    </NavLink>
                </NavCollapsible>
                
                <NavLink href="/sales/target" icon={<Target className="h-4 w-4" />}>
                    매출 목표
                </NavLink>

                 <NavCollapsible title="Reports" icon={<FileText className="h-4 w-4" />}>
                     <NavLink href="/sales/report" icon={<BarChart className="h-4 w-4" />}>
                        Sales Report
                    </NavLink>
                     <NavLink href="/sales/cumulative-report" icon={<AreaChart className="h-4 w-4" />}>
                        Cumulative Report
                    </NavLink>
                    <NavLink href="/credit" icon={<CreditCard className="h-4 w-4" />}>
                        Credit Report
                    </NavLink>
                    <NavLink href="/reports/cash" icon={<DollarSign className="h-4 w-4" />}>
                        Cash Report
                    </NavLink>
                    <NavLink href="/reports/checks" icon={<Landmark className="h-4 w-4" />}>
                        Check Report
                    </NavLink>
                </NavCollapsible>
                 
                 {(role === 'admin' || role === 'manager') && (
                    <NavCollapsible title="Purchases" icon={<ShoppingBasket className="h-4 w-4" />}>
                        {role === 'manager' && (
                            <NavLink href="/purchases/new" icon={<PlusCircle className="h-4 w-4" />}>
                                Register Local Purchase
                            </NavLink>
                        )}
                        {role === 'admin' && (
                            <NavLink href="/imports/new" icon={<Truck className="h-4 w-4" />}>
                                Register Product Import
                            </NavLink>
                        )}
                    </NavCollapsible>
                 )}

                {(role === 'admin' || role === 'manager') && (
                    <>
                        <NavLink href="/inventory" icon={<Boxes className="h-4 w-4" />}>
                            Inventory
                        </NavLink>
                        <NavLink href="/commissions" icon={<BadgePercent className="h-4 w-4" />}>
                            Commissions
                        </NavLink>
                    </>
                )}
                {role === 'admin' && (
                    <>
                        <NavLink href="/products" icon={<Package className="h-4 w-4" />}>
                            Products
                        </NavLink>
                        <NavLink href="#" icon={<LineChart className="h-4 w-4" />}>
                            Analytics
                        </NavLink>
                    </>
                )}
            </nav>
        </div>
      </div>
    </Sidebar>
  );
}
