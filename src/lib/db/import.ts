// lib/db/import.ts
import { prisma } from "../prisma";
import type {
  ShipmentData,
  DocumentStatus,
  DocumentData,
} from "@/types/import/workflow";

interface UploadDocumentResponse {
  fileUrl: string;
  status: DocumentStatus;
}

export async function updateShipment(id: string, data: Partial<ShipmentData>) {
  try {
    const currentShipment = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!currentShipment) {
      throw new Error("Shipment not found");
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        consigneeData: data.consignee
          ? JSON.stringify(data.consignee)
          : undefined,
        exporterData: data.exporter ? JSON.stringify(data.exporter) : undefined,
        shipmentDetails: data.shipmentDetails
          ? JSON.stringify(data.shipmentDetails)
          : undefined,
        documentsData: data.documents
          ? JSON.stringify(data.documents)
          : undefined,
        timelineData: data.timeline ? JSON.stringify(data.timeline) : undefined,
        notesData: data.notes ? JSON.stringify(data.notes) : undefined,
        computations: data.computations
          ? JSON.stringify(data.computations)
          : undefined,
        cargoData: data.cargo ? JSON.stringify(data.cargo) : undefined,
        statementOfFactsData: data.statementOfFacts
          ? JSON.stringify(data.statementOfFacts)
          : undefined,
        status: data.status,
        updatedAt: new Date(),
      },
    });

    // Handle the parsing with proper error checking and defaults
    const parsedData = {
      id: updated.id,
      referenceNumber: updated.referenceNumber,
      status: updated.status,
      consignee: updated.consigneeData
        ? JSON.parse(updated.consigneeData)
        : null,
      exporter: JSON.parse(updated.exporterData),
      shipmentDetails: JSON.parse(updated.shipmentDetails),
      documents: JSON.parse(updated.documentsData),
      timeline: JSON.parse(updated.timelineData),
      notes: JSON.parse(updated.notesData),
      computations: updated.computations
        ? JSON.parse(updated.computations)
        : null,
      cargo: updated.cargoData ? JSON.parse(updated.cargoData) : [],
      statementOfFacts: updated.statementOfFactsData
        ? JSON.parse(updated.statementOfFactsData)
        : [],
    } as ShipmentData;

    return parsedData;
  } catch (error) {
    console.error("Error updating shipment:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update shipment: ${error.message}`);
    }
    throw new Error("Failed to update shipment");
  }
}

// Helper function to safely parse JSON with a default value
function safeJSONParse<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

export async function uploadDocument(
  formData: FormData
): Promise<UploadDocumentResponse> {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const shipmentId = formData.get("shipmentId") as string;

    // Create a simulated file URL
    const timestamp = new Date().getTime();
    const simulatedUrl = `/simulated-uploads/${shipmentId}/${documentType}-${timestamp}-${file.name}`;

    // Log the upload for debugging
    console.log("Document upload simulation:", {
      fileName: file.name,
      type: documentType,
      shipmentId: shipmentId,
      simulatedUrl,
    });

    return {
      fileUrl: simulatedUrl,
      status: "draft" as DocumentStatus,
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error("Failed to upload document");
  }
}
