import xlsx, { IJsonSheet } from "json-as-xlsx";
import { people } from "@/people";

export function downloadToExcel(people: any, fileName: string) {
  const totalRecords = people.length;
  const totalAmount = people.reduce((sum: number, person: any) => sum + (person.amount || 0), 0);
  const transactionTypeCounts = people.reduce((counts: { [key: string]: number }, person: any) => {
    const type = person.transactionType || "Unknown";
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
  const transactionTypeSummary = Object.entries(transactionTypeCounts)
    .map(([type, count]) => `Total ${type}(s): ${count}`)
    .join(", ");

  const summaryRow = {
    transactionId: `Total Records: ${totalRecords}`,
    "user.username": "===",
    amount: `Total Amount: ${totalAmount}`,
    transactionDate: "===",
    createdAt: "===",
    transactionType: transactionTypeSummary,
  };

  const columns: IJsonSheet[] = [
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
      content: [...people, summaryRow],
    },
  ];

  const settings = {
    fileName: fileName || "People Excel", // Use the provided file name, or default if none is provided
  };

  xlsx(columns, settings);
}

