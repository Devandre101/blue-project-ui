"use client";

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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { downloadToExcel } from "@/lib/xlsx";
import { ArrowUpDown } from "lucide-react";
import DateRangePicker from "./DateRangePicker";


var dateFilterOn : boolean;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDateRangeChange: (data: TData[]) => void; // Ensure the prop is defined here
}

export function PeopleDataTable<TData, TValue>({
  columns,
  data,
  onDateRangeChange, // Accept the prop here
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedType, setSelectedType] = useState("Transaction Type");

  const [tableData, setTableData] = useState(data);

  const handleExportSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
  
    // Export selectedRows to CSV or Excel
    downloadToExcel(selectedRows);
  };

  const handleExportRows = () => {
    const rowsToExport =
      table.getSelectedRowModel().rows.length > 0
        ? table.getSelectedRowModel().rows.map((row) => row.original) // Export selected rows if any
        : table.getFilteredRowModel().rows.map((row) => row.original); // Otherwise, export filtered rows
  
    // Export rowsToExport to CSV or Excel
    downloadToExcel(rowsToExport);
  };

  // This function will be called when the date range changes
  const handleDateRangeChange = (data: TData[]) => {
    dateFilterOn = true;
    setTableData(data); // Update the table data with the fetched data
    onDateRangeChange(data); // Call the prop function to notify the parent
    
  };

  const handleSelect = async (type: string) => {
    setSelectedType(type);
    try {

      // var response = null;
    
      // if(dateFilterOn){
      //   response = await fetch (`https://localhost:7232/api/Transactions/filter?startDate=2025-02-01%2000%3A00%3A00.000&endDate=2025-03-31%2023%3A59%3A59.999&transactionType=withdrawal`);
       
      //   console.log("dateFilterOn");
      // }else{
      //  response = await fetch(`https://localhost:7232/api/Transactions/type/${type}`);
      // }

      const response = await fetch(`https://localhost:7232/api/Transactions/type/${type}`);

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const fetchedData = await response.json();
      setTableData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch transaction type data:", error);
    }
  };

  const handleReset = () => {
    setSelectedType("Transaction Type");
    setTableData(data);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Transaction Type"
          value={(table.getColumn("transactionType")?.getFilterValue() as string) || ""}
          onChange={(e) => table.getColumn("transactionType")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        
        <DateRangePicker onDateRangeChange={handleDateRangeChange} /> {/* Pass the handler as prop */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {selectedType}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleSelect("deposit")}>Deposit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelect("withdrawal")}>Withdrawal</DropdownMenuItem>
            <DropdownMenuItem onClick={handleReset}>Reset</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleExportRows} className="ml-4">
  Export to Excel
</Button>

        <ThemeToggle className="ml-4" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="ml-4">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No results</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}

export default PeopleDataTable;
