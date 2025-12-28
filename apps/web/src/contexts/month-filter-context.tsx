'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonthFilterContextType {
    selectedMonths: string[];
    setSelectedMonths: (months: string[]) => void;
}

const MonthFilterContext = createContext<MonthFilterContextType | undefined>(undefined);

export function MonthFilterProvider({ children }: { children: ReactNode }) {
    const [selectedMonths, setSelectedMonths] = useState<string[]>(() => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return [currentMonth];
    });

    return (
        <MonthFilterContext.Provider value={{ selectedMonths, setSelectedMonths }}>
            {children}
        </MonthFilterContext.Provider>
    );
}

export function useMonthFilter() {
    const context = useContext(MonthFilterContext);
    if (context === undefined) {
        throw new Error('useMonthFilter must be used within a MonthFilterProvider');
    }
    return context;
}
