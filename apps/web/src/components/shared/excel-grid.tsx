'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Search,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Check,
    X,
    Loader2
} from 'lucide-react';

import { format, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ExcelGridProps<TData> {
    title: string;
    description: string;
    columns: ColumnDef<TData, any>[];
    data: TData[];
    onAdd?: (newData: Partial<TData>) => Promise<void>;
    onDelete?: (item: TData) => Promise<void>;
    searchKey: keyof TData;
    isLoading?: boolean;
    defaultValues?: Partial<TData>;
}

export function ExcelGrid<TData>({
    title,
    description,
    columns,
    data,
    onAdd,
    onDelete,
    searchKey,
    isLoading = false,
    defaultValues = {},
}: ExcelGridProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [zoom, setZoom] = React.useState(100);
    const [isAddingMode, setIsAddingMode] = React.useState(false);
    const [newRowData, setNewRowData] = React.useState<Partial<TData>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
    const handleResetZoom = () => setZoom(100);

    const handleAddNewClick = () => {
        setIsAddingMode(true);
        setNewRowData(defaultValues);
    };

    const handleCancelAdd = () => {
        setIsAddingMode(false);
        setNewRowData({});
    };

    const handleSaveNew = async () => {
        if (!onAdd) return;

        // Date validation check
        const dateColumns = table.getAllColumns().filter(col => (col.columnDef as any).meta?.type === 'date');
        for (const col of dateColumns) {
            const accessorKey = (col.columnDef as any).accessorKey || col.id;
            const val = (newRowData as any)[accessorKey];
            if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                alert(`Invalid date format for ${col.id}. Please use yyyy-mm-dd`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onAdd(newRowData);
            setIsAddingMode(false);
            setNewRowData({});
        } catch (error) {
            console.error('Failed to add new row:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setNewRowData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card className="w-full shadow-lg border-muted/40 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-background rounded-lg border px-3 py-1.5 shadow-sm">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={zoom <= 50} title="Zoom Out">
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium w-12 text-center select-none">{zoom}%</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={zoom >= 150} title="Zoom In">
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <div className="w-[1px] h-4 bg-muted mx-2" />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetZoom} title="Reset Zoom">
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                        {onAdd && !isAddingMode && (
                            <Button onClick={handleAddNewClick} className="shadow-sm hover:shadow-md transition-shadow">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Row
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center p-4 gap-4 bg-muted/10 border-b">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search by ${String(searchKey)}...`}
                            value={(table.getColumn(String(searchKey))?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(String(searchKey))?.setFilterValue(event.target.value)
                            }
                            className="bg-background pl-8 h-9 ring-offset-background border-muted/60 focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto h-9 font-normal">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id.replace(/_/g, ' ')}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-auto relative" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                    <div
                        style={{
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top left',
                            width: `${10000 / zoom}%`,
                            transition: 'transform 0.2s ease-in-out'
                        }}
                    >
                        <Table className="border-separate border-spacing-0">
                            <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        <TableHead className="w-10 border-b border-r bg-muted/20 text-center font-bold text-[10px] text-muted-foreground uppercase selection:bg-transparent">
                                            #
                                        </TableHead>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    className="border-b border-r px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider last:border-r-0"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                <span className="text-muted-foreground">Loading data...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, idx) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="group hover:bg-muted/40 transition-colors"
                                        >
                                            <TableCell className="w-10 border-b border-r bg-muted/5 text-center text-[10px] font-mono font-bold text-muted-foreground/60 select-none">
                                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + idx + 1}
                                            </TableCell>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="border-b border-r h-10 px-4 py-2 text-sm last:border-r-0 group-hover:border-r-muted group-last:border-b-0"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} className="h-32 text-center text-muted-foreground">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {isAddingMode && (
                                    <TableRow className="bg-primary/5 animate-in fade-in duration-300">
                                        <TableCell className="w-10 border-b border-r bg-primary/10 text-center text-[10px] font-mono font-bold text-primary select-none">
                                            +
                                        </TableCell>
                                        {table.getVisibleFlatColumns().map((column) => {
                                            const columnDef = column.columnDef;
                                            const accessorKey = (columnDef as any).accessorKey;
                                            const headerLabel = typeof columnDef.header === 'string' ? columnDef.header : column.id;
                                            const columnType = (columnDef as any).meta?.type || 'text';

                                            // Handle special actions column or read-only/ID columns
                                            if (column.id === 'actions') {
                                                return (
                                                    <TableCell key={column.id} className="border-b px-4 py-2">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="default"
                                                                className="h-8 w-8"
                                                                onClick={handleSaveNew}
                                                                disabled={isSubmitting}
                                                            >
                                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-8 w-8"
                                                                onClick={handleCancelAdd}
                                                                disabled={isSubmitting}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                );
                                            }

                                            const isReadOnly = column.id === 'id' || (column.columnDef.meta as any)?.readOnly;

                                            return (
                                                <TableCell key={column.id} className="border-b border-r px-2 py-1 last:border-r-0">
                                                    {isReadOnly ? (
                                                        <div className="px-2 text-xs font-mono text-muted-foreground italic">
                                                            Auto-gen
                                                        </div>
                                                    ) : columnType === 'date' ? (
                                                        <div className="flex flex-col gap-1 min-w-[140px]">
                                                            <DatePicker
                                                                value={(newRowData as any)[accessorKey || column.id] ? parse((newRowData as any)[accessorKey || column.id], 'yyyy-MM-dd', new Date()) : undefined}
                                                                onSelect={(date) => {
                                                                    if (date && isValid(date)) {
                                                                        handleInputChange(accessorKey || column.id, format(date, 'yyyy-MM-dd'));
                                                                    } else {
                                                                        handleInputChange(accessorKey || column.id, '');
                                                                    }
                                                                }}
                                                            />
                                                            {(newRowData as any)[accessorKey || column.id] && (
                                                                <div className={cn(
                                                                    "text-[10px] px-1",
                                                                    /^\d{4}-\d{2}-\d{2}$/.test((newRowData as any)[accessorKey || column.id])
                                                                        ? "text-green-600"
                                                                        : "text-red-500"
                                                                )}>
                                                                    {/^\d{4}-\d{2}-\d{2}$/.test((newRowData as any)[accessorKey || column.id]) ? "Valid format" : "Format: yyyy-mm-dd"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : columnType === 'number' ? (
                                                        <Input
                                                            type="text" // Use text to allow strict control over input
                                                            className={cn(
                                                                "h-8 bg-background focus:ring-1 focus:ring-primary border-transparent hover:border-muted-foreground/30 text-right"
                                                            )}
                                                            placeholder={headerLabel}
                                                            value={(newRowData as any)[accessorKey || column.id] || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                // Allow empty string
                                                                if (val === '') {
                                                                    handleInputChange(accessorKey || column.id, '');
                                                                    return;
                                                                }
                                                                // Strict regex for decimal/integer
                                                                // Matches: 123, 123., 123.45, .45, -123
                                                                if (/^-?\d*\.?\d*$/.test(val)) {
                                                                    // It's a valid number part, update state
                                                                    // We store as string in state to allow typing "1." without it becoming "1" instantly
                                                                    // But we might need to cast to number on save.
                                                                    // However, for controlled input to work well with partial numbers, we often keep as string.
                                                                    // For now, let's keep as string in newRowData and cast on save if needed, 
                                                                    // OR just rely on APIClient/JSON.stringify handling it (which might send string).
                                                                    // The previous implementation used parseFloat, let's try to be consistent but allow intermediate states.
                                                                    handleInputChange(accessorKey || column.id, val);
                                                                }
                                                            }}
                                                        />
                                                    ) : columnType === 'select' ? (
                                                        <Select
                                                            value={(newRowData as any)[accessorKey || column.id] || ''}
                                                            onValueChange={(value) => handleInputChange(accessorKey || column.id, value)}
                                                        >
                                                            <SelectTrigger className="h-8 w-full border-transparent hover:border-muted-foreground/30 focus:ring-1 focus:ring-primary bg-background">
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {((columnDef as any).meta?.options || []).map((opt: any) => (
                                                                    <SelectItem key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            className={cn(
                                                                "h-8 bg-background focus:ring-1 focus:ring-primary border-transparent hover:border-muted-foreground/30"
                                                            )}
                                                            placeholder={headerLabel}
                                                            value={(newRowData as any)[accessorKey || column.id] || ''}
                                                            onChange={(e) => handleInputChange(accessorKey || column.id, e.target.value)}
                                                        />
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 border-t">
                    <div className="text-xs text-muted-foreground">
                        Showing {table.getRowModel().rows.length} of {data.length} records
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="bg-background h-8 w-8 p-0"
                        >
                            <span className="sr-only">Previous Page</span>
                            &lt;
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                                .filter(i => {
                                    const curr = table.getState().pagination.pageIndex + 1;
                                    return i === 1 || i === table.getPageCount() || (i >= curr - 1 && i <= curr + 1);
                                })
                                .map((page, idx, arr) => (
                                    <React.Fragment key={page}>
                                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-muted-foreground px-1">...</span>}
                                        <Button
                                            variant={table.getState().pagination.pageIndex + 1 === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => table.setPageIndex(page - 1)}
                                            className="h-8 w-8 p-0 text-xs"
                                        >
                                            {page}
                                        </Button>
                                    </React.Fragment>
                                ))
                            }
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="bg-background h-8 w-8 p-0"
                        >
                            <span className="sr-only">Next Page</span>
                            &gt;
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
