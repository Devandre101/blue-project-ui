import xlsx, { IJsonSheet } from "json-as-xlsx";
import { people } from "@/people";

export function downloadToExcel(people: any) {
  // Calculate total number of records
  const totalRecords = people.length;

  // Calculate the total amount by summing the `amount` field in each record
  const totalAmount = people.reduce((sum: number, person: any) => sum + (person.amount || 0), 0);

  // Count occurrences of each transaction type (e.g., deposit, withdrawal)
  const transactionTypeCounts = people.reduce((counts: { [key: string]: number }, person: any) => {
    const type = person.transactionType || "Unknown";
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});

  // Format the transaction type counts as a readable string
  const transactionTypeSummary = Object.entries(transactionTypeCounts)
    .map(([type, count]) => `Total ${type}(s): ${count}`)
    .join(", ");

  // Create a summary row to display the total count, total amount, and transaction type counts
  const summaryRow = {
    transactionId: `Total Records: ${totalRecords}`, // Display total count
    "user.username": "===",
    amount: `Total Amount: ${totalAmount}`, // Display total amount
    transactionDate: "===",
    createdAt: "===",
    transactionType: transactionTypeSummary, // Display transaction type counts
  };

  // Set up columns and data
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
      content: [...people, summaryRow], // Add summary row after the main data
    },
  ];

  let settings = {
    fileName: "People Excel",
  };

  xlsx(columns, settings);
}
