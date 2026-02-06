"use client";

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ItemForm } from "@/components/item-form"
import { Plus, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    hideAddButton?: boolean
    hideFilter?: boolean
    filterColumn?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    hideAddButton = false,
    hideFilter = false,
    filterColumn = "name",
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    return (
        <div className="space-y-4">
            {(!hideFilter || !hideAddButton) && (
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
                    {!hideFilter && (
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="검색..."
                                value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                                }
                                className="pl-9 h-9 text-sm rounded-md border-border bg-background focus-visible:ring-primary/30"
                            />
                        </div>
                    )}
                    {!hideAddButton && (
                        <ItemForm trigger={
                            <Button size="sm" className="h-9 px-4 font-semibold">
                                <Plus className="mr-2 h-4 w-4" />품목 추가
                            </Button>
                        } />
                    )}
                </div>
            )}
            <div className="w-full">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center font-bold text-muted-foreground text-[13px] uppercase tracking-wider py-4 px-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                    className="group hover:bg-muted/50 transition-colors border-b last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6">
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
                                    className="h-32 text-center text-muted-foreground text-sm"
                                >
                                    데이터 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
