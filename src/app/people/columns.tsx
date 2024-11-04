"use client"; // Ensure this is marked as a client component

import { Button } from "@/components/ui/button";
import { Person } from "@/people"; // Update this import based on your data type
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = (fetchPeopleByType: (type: string) => void): ColumnDef<Person>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Transaction ID",
    accessorKey: "transactionId", // Adjust this based on your data structure
  },
  {
    header: "User Name",
    accessorKey: "user.username", // Adjust this based on your data structure
  },
  {
    header: "Amount",
    accessorKey: "amount", // Adjust this based on your data structure
  },
  {
    header: "Transaction Date",
    accessorKey: "transactionDate", // Adjust based on your data structure
  },
  {
    header: "Created Date",
    accessorKey: "createdAt", // Adjust based on your data structure
  },
  {
    header: ({ column }) => {
      const handleTransactionTypeClick = (transactionType: string) => {
        fetchPeopleByType(transactionType); // Call the passed function to fetch data
      };
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Transaction Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleTransactionTypeClick("deposit")}>
              Deposit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTransactionTypeClick("withdrawal")}>
              Withdrawal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTransactionTypeClick("transfer")}>
              Transfer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    accessorKey: "transactionType", // This should match the key for your data
  },

  // {
  //   header: "Date of Birth",
  //   accessorKey: "date_of_birth", // Adjust based on your data structure
  //   cell: ({ row }) => {
  //     const date_of_birth = row.getValue("date_of_birth");
  //     const formatted = new Date(date_of_birth as string).toLocaleDateString();
  //     return <div className="font-medium">{formatted}</div>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(person.first_name.toString());
              }}
            >
              Copy person name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
