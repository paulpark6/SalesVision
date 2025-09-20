
import Link from 'next/link';
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
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from './ui/sidebar';


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
                <Link
                href={dashboardUrl}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                    <Home className="h-4 w-4" />
                    Dashboard
                </Link>
                <Link
                    href="/sales/new"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                    <ShoppingCart className="h-4 w-4" />
                    Sales
                </Link>
                <Link
                    href="/products"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                    <Package className="h-4 w-4" />
                    Products
                </Link>
                {(role === 'admin' || role === 'manager') && (
                     <Link
                        href="/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Boxes className="h-4 w-4" />
                        Inventory
                    </Link>
                )}
                {(role === 'admin' || role === 'manager') && (
                     <Link
                        href="/imports/new"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Truck className="h-4 w-4" />
                        Imports
                    </Link>
                )}
                {role === 'admin' && (
                    <>
                        <Link
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Users className="h-4 w-4" />
                            Customers
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <CreditCard className="h-4 w-4" />
                            Credit Sales
                        </Link>
                    </>
                )}
                {(role === 'admin' || role === 'manager') && (
                     <Link
                        href="/commissions"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <BadgePercent className="h-4 w-4" />
                        Commissions
                    </Link>
                )}
                 {role === 'admin' && (
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <LineChart className="h-4 w-4" />
                        Analytics
                    </Link>
                )}
            </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
