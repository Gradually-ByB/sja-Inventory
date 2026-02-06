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
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto custom-scrollbar">
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

            {/* Mobile Card List View */}
            <div className="block md:hidden space-y-4 px-4 pb-4">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className="bg-card rounded-xl border border-border/50 p-4 space-y-3 premium-shadow transition-all active:scale-[0.98]"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                {row.getVisibleCells().map((cell, index) => {
                                    // Identify columns by their accessor or ID (based on columns.tsx)
                                    const columnId = cell.column.id;
                                    const isActions = columnId === "actions";
                                    const isImage = columnId === "image" || columnId.includes("img");
                                    const isItemName = index === 1;

                                    const labelMap: { [key: string]: string } = {
                                        image: "이미지",
                                        imageUrl: "이미지",
                                        "item.imageUrl": "이미지",
                                        item_imageUrl: "이미지",
                                        name: "품명",
                                        "item.name": "품명",
                                        item_name: "품명",
                                        category: "카테고리",
                                        "item.category": "카테고리",
                                        unit: "단위",
                                        "item.unit": "단위",
                                        currentStock: "재고",
                                        currentStock_unit: "재고/단위",
                                        location: "위치",
                                        createdAt: "날짜",
                                        quantity: "수량",
                                        quantity_unit: "수량/단위",
                                        totalStockOutQty: "출고량/단위",
                                        description: "비고",
                                        actions: "관리/수정"
                                    };

                                    const label = typeof cell.column.columnDef.header === "string"
                                        ? cell.column.columnDef.header
                                        : (labelMap[columnId] || columnId);

                                    if (isImage) {
                                        return (
                                            <div key={cell.id} className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        );
                                    }

                                    if (isActions) {
                                        return (
                                            <div key={cell.id} className="w-full pt-2 flex items-center justify-center border-t border-border/50 mt-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={cell.id} className="flex-1 min-w-[120px] flex flex-col items-center text-center">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">
                                                {label}
                                            </span>
                                            <div className="text-sm font-medium">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                        데이터 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}
