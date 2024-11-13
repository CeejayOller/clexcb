// src/lib/pdf/statement-of-facts.ts
import { format } from "date-fns";
import type {
  StatementOfFactEvent,
  ShipmentData,
} from "@/types/import/workflow";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateStatementOfFactsPDF = (data: ShipmentData) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(18);
  doc.text("Statement of Facts", 14, 20);

  doc.setFontSize(12);
  doc.text(`Reference No: ${data.referenceNumber}`, 14, 30);
  doc.text(`Consignee: ${data.consignee?.name || "N/A"}`, 14, 40);
  doc.text(`Generated on: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 50);

  // Add events table
  const tableData = data.statementOfFacts.map((event) => [
    format(new Date(event.timestamp), "MMM dd, yyyy HH:mm"),
    event.description,
    event.createdBy.name,
    event.documents?.map((doc) => doc.name).join(", ") || "",
  ]);

  (doc as any).autoTable({
    startY: 60,
    head: [["Date & Time", "Event Description", "Created By", "Documents"]],
    body: tableData,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 80 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
    },
  });

  // Save the PDF
  doc.save(`SOF-${data.referenceNumber}.pdf`);
};
