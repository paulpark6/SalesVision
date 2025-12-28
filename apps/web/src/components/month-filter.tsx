'use client';

import * as React from 'react';
import { Check, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useMonthFilter } from '@/contexts/month-filter-context';

// Generate last 24 months
function generateMonthOptions() {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        months.push({ value: yearMonth, label });
    }

    return months;
}

export function MonthFilter() {
    const { selectedMonths, setSelectedMonths } = useMonthFilter();
    const [open, setOpen] = React.useState(false);
    const monthOptions = generateMonthOptions();

    const toggleMonth = (monthValue: string) => {
        setSelectedMonths(
            selectedMonths.includes(monthValue)
                ? selectedMonths.filter((m) => m !== monthValue)
                : [...selectedMonths, monthValue]
        );
    };

    const selectAll = () => {
        setSelectedMonths(monthOptions.map((m) => m.value));
    };

    const clearAll = () => {
        setSelectedMonths([]);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between min-w-[200px]"
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">
                        {selectedMonths.length === 0
                            ? 'Filter by month'
                            : `${selectedMonths.length} month${selectedMonths.length > 1 ? 's' : ''}`}
                    </span>
                    <span className="sm:hidden">
                        {selectedMonths.length === 0 ? 'Month' : selectedMonths.length}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-medium">Filter by Month</span>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={selectAll}
                        >
                            Select All
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={clearAll}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {monthOptions.map((month) => (
                        <div
                            key={month.value}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                            onClick={() => toggleMonth(month.value)}
                        >
                            <Checkbox
                                id={month.value}
                                checked={selectedMonths.includes(month.value)}
                                onCheckedChange={() => toggleMonth(month.value)}
                            />
                            <label
                                htmlFor={month.value}
                                className="flex-1 text-sm cursor-pointer"
                            >
                                {month.label}
                            </label>
                            {selectedMonths.includes(month.value) && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
