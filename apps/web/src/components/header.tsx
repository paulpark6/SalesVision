import Link from 'next/link';
import * as React from 'react';
import {
  Search,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';

import { UserNav } from '@/components/user-nav';
import { SidebarTrigger } from './ui/sidebar';
import { MonthFilter } from './month-filter';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/sales">SalesVision</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <MonthFilter />

        <div className="relative flex-1 max-w-md sm:grow-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-muted/50 pl-8 h-9 focus-visible:bg-background transition-colors w-[120px] sm:w-[200px] lg:w-[320px]"
          />
        </div>
      </div>
      <UserNav />
    </header>
  );
}
