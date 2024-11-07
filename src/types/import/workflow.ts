// types/import/workflow.ts

export type WorkflowStageStatus = 'pending' | 'in_progress' | 'partial' | 'complete';
export type DocumentStatus = 'not_uploaded' | 'draft' | 'final' | 'verified';

export interface ShipmentData {
  id: string;
  referenceNumber: string;
  status: string;
  userID?: string;
  consignee: ConsigneeDetails | null;
  exporter: ExporterDetails;
  shipmentDetails: ShipmentDetails;
  documents: Array<{
    name: string;
    status: DocumentStatus;
    isVerified: boolean;
    isRequired: boolean;
    files?: string[];
  }>;
  timeline: Array<{
    stage: string;
    status: WorkflowStageStatus;
    timestamp: string;
  }>;
  notes: Array<{
    content: string;
    timestamp: string;
    author: string;
  }>;
  computations?: {
    dutiable_value: number;
    customs_duty: number;
    vat: number;
    other_charges: number;
    total_payable: number;
  } | null;
  cargo: CargoItem[];
  statementOfFacts: StatementOfFactEvent[];
}

export interface ConsigneeDetails {
  id?: string;
  name: string;
  address: string;
  tin?: string;
  brn?: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
}

export interface ExporterDetails {
  id?: string;
  name: string;
  address: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
}

export interface ShipmentDetails {
  bl_number: string;
  vessel_name: string;
  flight_number: string;
  registry_number: string;
  voyage_number: string;
  container_number: string;
  port_of_origin: string;
  port_of_discharge: string;
  eta: string;
  ata: string;
  description_of_goods: string;
  volume: string;
  final_destination?: string;
  contact_person?: string;
  contact_number?: string;
  terms_of_delivery?: string;
  markings_and_numbers?: string;
  packaging_code?: string;
  packaging_details?: string;
}

export interface DocumentData {
  name: string;
  status: DocumentStatus;
  url?: string;
  isVerified: boolean;
  isRequired: boolean;
  files?: string[];
}

export interface ComputationDetails {
  dutiable_value: number;
  customs_duty: number;
  vat: number;
  other_charges: number;
  total_payable: number;
}

export interface TimelineEvent {
  stage: string;
  status: WorkflowStageStatus;
  timestamp: string;
}

export interface CargoItem {
  id: string;
  description: string;
  invoiceValue: number;
  grossWeight: number;
  netWeight: number;
  quantity: number;
  hsCode: string;
}

export interface StatementOfFactEvent {
  id: string;
  timestamp: string;
  description: string;
  createdBy: {
    id: string;
    name: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

