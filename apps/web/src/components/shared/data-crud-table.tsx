'use client';

import * as React from 'react';
import {
    Column,
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
    HeaderGroup,
    Header,
    Row,
    Cell,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pencil, Trash, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface DataCrudTableProps<TData, TValue> {
    title: string;
    description: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAdd?: () => void;
    onEdit?: (item: TData) => void;
    onDelete?: (item: TData) => void;
    searchKey: keyof TData;
}

export function DataCrudTable<TData, TValue>({
    title,
    description,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    searchKey,
}: DataCrudTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const tableColumns = React.useMemo(() => {
        const cols = [...columns];

        if (onEdit || onDelete) {
            cols.push({
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const item = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(item)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            });
        }
        return cols;
    }, [columns, onEdit, onDelete]);

    const table = useReactTable({
        data,
        columns: tableColumns,
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

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {onAdd && (
                    <Button onClick={onAdd} className="gap-1 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 gap-2">
                    <Input
                        placeholder={`Filter ${String(searchKey)}...`}
                        value={(table.getColumn(String(searchKey))?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(String(searchKey))?.setFilterValue(event.target.value)
                        }
                        className="w-full sm:max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column: Column<TData>) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header: Header<TData, any>) => {
                                            return (
                                                <TableHead key={header.id}>
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
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row: Row<TData>) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell: Cell<TData, any>) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                    <div className="text-sm text-muted-foreground order-2 sm:order-1">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex items-center space-x-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="flex-1 sm:flex-none"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="flex-1 sm:flex-none"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
