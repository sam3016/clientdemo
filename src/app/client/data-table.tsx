"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFn,
  SortingFn,
  sortingFns,
  ColumnFiltersState,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

declare module '@tanstack/react-table' {
  interface FilterFns {
      fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
      itemRank: RankingInfo
  }
}

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
          rowA.columnFiltersMeta[columnId]?.itemRank!,
          rowB.columnFiltersMeta[columnId]?.itemRank!
      )
  }
  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
});

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
        state: {
            pagination,
            globalFilter,
            columnFilters,
        },
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'firstName') {
        if (table.getState().sorting[0]?.id !== 'firstName') {
            table.setSorting([{ id: 'firstName', desc: false }])
        }
    }
}, [table.getState().columnFilters[0]?.id])

  return (
    <div className="rounded-md border pt-5">
        <Input
            value={globalFilter ?? ""}
            onChange={
                value => {
                    setGlobalFilter(String(value.target.value))
                }}
            placeholder="Search..."
        />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}
                    {...{
                        className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                        onClick: header.column.getToggleSortingHandler(),
                    }}
                    >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                            asc: " 🔼",
                            desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Clients.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-row justify-center">
            <Button
            variant={"ghost"}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            >
            {'<<'}
            </Button>
            <Button
            variant={"ghost"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            {'<'}
            </Button>
            <Select 
                value={String(table.getState().pagination.pageSize)}
                onValueChange={e => {
                table.setPageSize(Number(e))
            }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Page" />
                </SelectTrigger>
                <SelectContent
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem 
                        key={pageSize} 
                        value={String(pageSize)}
                    >{pageSize}</SelectItem>
                ))}
            </SelectContent>
            </Select>
            <Button
            variant={"ghost"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            {'>'}
            </Button>
            <Button
            variant={"ghost"}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            >
            {'>>'}
            </Button>
        </div>
    </div>
  )
}
