"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemForm } from "@/components/item-form";
import { Plus, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    hideAddButton?: boolean;
    hideFilter?: boolean;
    filterColumn?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    hideAddButton = false,
    hideFilter = false,
    filterColumn = "name",
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <div>
            {(!hideFilter || !hideAddButton) && (
                <div className="flex items-center py-6 justify-between gap-4">
                    {!hideFilter && (
                        <div className="relative w-full max-w-sm">
                            <Input
                                placeholder={`${filterColumn === "name" ? "품명" : "필터"}으로 검색...`}
                                value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                                }
                                className="pl-10 h-11 rounded-xl shadow-sm border-slate-200/60 focus-visible:ring-primary/20 transition-all transition-all duration-200"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    )}
                    {!hideAddButton && (
                        <ItemForm trigger={
                            <Button className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                                <Plus className="mr-0 h-4 w-4" />품목 추가
                            </Button>
                        } />
                    )}
                </div>
            )}
            <div className="rounded-2xl border border-slate-200/50 overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm transition-all duration-300">
                <Table>
                    <TableHeader className="bg-emerald-50/80 dark:bg-emerald-900/20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-200/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight text-sm lg:text-base h-14">
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="group hover:bg-primary/5 transition-colors duration-200 border-slate-200/40"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center py-4 font-medium">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                        </div>
                                        <p className="font-bold">데이터가 없습니다.</p>
                                        <p className="text-xs">목록이 비어있거나 필터링 결과가 없습니다.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
