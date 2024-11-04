import xlsx, { IJsonSheet } from "json-as-xlsx";
import { people } from "@/people";

export function downloadToExcel(people: any) {
  // Calculate total number of records
  const totalRecords = people.length;

  // Calculate the total amount by summing the `amount` field in each record
  const totalAmount = people.reduce((sum: number, person: any) => sum + (person.amount || 0), 0);

  // Create a summary row to display the total count and total amount
  const summaryRow = {
    transactionId: `Total Records: ${totalRecords}`, // Display total count
    "user.username": "", 
    amount: `Total Amount: ${totalAmount}`, // Display total amount
    transactionDate: "",
    createdAt: "",
    transactionType: "",
  };

  let columns: IJsonSheet[] = [
    {
      sheet: "Persons",
      columns: [
        { label: "Transaction ID", value: "transactionId" },
        { label: "User Name", value: "user.username" },
        { label: "Amount", value: "amount" },
        { label: "Transaction Date", value: "transactionDate" },
        { label: "Created Date", value: "createdAt" },
        { label: "Transaction Type", value: "transactionType" },
      ],
      content: [summaryRow, ...people], // Add summary row before the main data
    },
  ];

  let settings = {
    fileName: "People Excel",
  };

  xlsx(columns, settings);
}
