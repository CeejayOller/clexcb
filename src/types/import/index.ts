// src/types/import/index.ts
import { LucideIcon } from 'lucide-react';
import { type ImportTransactionType } from '@/lib/utils/reference-number';


// Core types
export type DocumentType = 'bill_of_lading' | 'commercial_invoice' | 'packing_list' | 'other';
export type WorkflowStageStatus = 'pending' | 'partial' | 'complete';
export type DocumentStatus = 'not_uploaded' | 'draft' | 'final';

// Base interfaces
export interface NewImportFormProps {
  onComplete: () => void;
}

export interface PackageCode {
  code: string;
  description: string;
}

export interface CustomEntity {
  id: string;
  name: string;
  address?: string;
  tin?: string;
  brn?: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
    isVerified: boolean;
  }>;
}

export interface ShipmentForm {
  id: string;
  consignee: string;
  consigneeId?: string;
  contactPerson: string;
  exporter: string;
  exporterId?: string;
  exporterAddress: string;
  portOfOrigin: string;
  countryOfExport: string;
  countryOfOrigin: string;
  portOfDischarge: string;
  termsOfDelivery: string;
  markingsAndNumbers: string;
  packagingCode: string;
  
  // Sea freight fields
  blNumber: string;
  isMultipleBL: boolean;
  vesselName: string;
  registryNo: string;
  voyageNo: string;
  containerNo: string;
  
  // Air freight fields
  awbNumber: string;
  aircraftName: string;
  flightNo: string;
  
  // Common arrays
  goods: Array<{
    id: string;
    description: string;
    invoiceValue: number;
    grossWeight: number;
    netWeight: number;
    quantity: number;
    hsCode: string;
  }>;
  documents: Record<string, string[]>;
}

export interface PackageCode {
  code: string;
  description: string;
}

export interface GoodsItem {
  id: string;
  description: string;
  invoiceValue: number;
  grossWeight: number;
  netWeight: number;
  quantity: number;
  hsCode: string;
  autoHsCode?: string;
}

export interface ClientActionResponse<T> {
  success?: boolean;
  error?: string;
  data?: T[];
}

// Form related
export interface ValidationErrors {
  [key: string]: string;
}


export interface ShipmentFormFieldsProps {
  formIndex: number;
  form: ShipmentForm;
  shipmentType: 'sea' | 'air';
  onChange: (index: number, field: string, value: any) => void;
  onGoodsChange: (formIndex: number, goodsIndex: number, field: string, value: any) => void;
  onGoodsRemove: (formIndex: number, goodsIndex: number) => void;
  onGoodsAdd: (formIndex: number) => void;
  onDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, docType: string, formIndex: number) => void;
  savedConsignees: CustomEntity[];
  savedExporters: CustomEntity[];
}


// Workflow related
export interface WorkflowStateBase {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Shipment data interface
export interface ShipmentData {
  consignee: {
    name: string;
    address: string;
    tin?: string;
    brn?: string;
  } | null;
  exporter: {
    name: string;
    address: string;
  };
  shipmentDetails: {
    bl_number: string;
    vessel_name: string;
    flight_number: string;
    registry_number: string;
    voyage_number: string;
    container_number: string;
    port_of_origin: string;
    port_of_discharge: string;
    country_of_origin: string;
    country_of_export: string;
    terms_of_delivery: string;
    markings_and_numbers: string;
    packaging_code: string;
    eta: string;
    ata: string;
    description_of_goods: string;
    volume: string;
    goods: {
      description: string;
      invoice_value: number;
      gross_weight: number;
      net_weight: number;
      quantity: number;
      hs_code: string;
    }[];
  };
  documents: Record<string, string[]>;
}

// List view
export interface ShipmentListItem {
  id: string;
  referenceNumber: string;
  consignee: string;
  type: 'sea' | 'air';
  blNumber?: string;
  awbNumber?: string;
  status: string;
  eta?: string | null;
  completionDate?: string | null;
  lastUpdate: string;
  isLocked: boolean;
  userId: string;
  createdBy?: {     // Changed to an inline type that matches your needs
    id: string;
    name: string;
    email: string;
  };
}

// API responses
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Constants
export const MOCK_CLIENTS = [
  { id: '1', name: 'ABC Company', address: 'Manila, Philippines' },
  { id: '2', name: 'XYZ Corporation', address: 'Cebu, Philippines' },
  { id: '3', name: 'Global Trading Co.', address: 'Davao, Philippines' },
];

export const MOCK_EXPORTERS = [
  { id: '1', name: 'China Exports Ltd.', address: 'Shanghai, China' },
  { id: '2', name: 'Korea Trade Co.', address: 'Seoul, South Korea' },
  { id: '3', name: 'Japan Suppliers Inc.', address: 'Tokyo, Japan' },
];

export const INCOTERMS = [
  'EXW - Ex Works',
  'FCA - Free Carrier',
  'CPT - Carriage Paid To',
  'CIP - Carriage and Insurance Paid To',
  'DAP - Delivered at Place',
  'DPU - Delivered at Place Unloaded',
  'DDP - Delivered Duty Paid',
  'FAS - Free Alongside Ship',
  'FOB - Free on Board',
  'CFR - Cost and Freight',
  'CIF - Cost, Insurance and Freight',
];

export const REQUIRED_DOCUMENTS = [
  { type: 'bl', name: 'Bill of Lading', required: true, forType: 'sea' },
  { type: 'awb', name: 'Air Way Bill', required: true, forType: 'air' },
  { type: 'invoice', name: 'Commercial Invoice', required: true, forType: 'both' },
  { type: 'packing', name: 'Packing List', required: true, forType: 'both' },
  { type: 'certificate', name: 'Certificate of Origin', required: false, forType: 'both' },
] as const;

export const PACKAGE_CODES: PackageCode[] = [
  { code: 'PKG', description: 'Package' },
  { code: 'CTN', description: 'Carton' },
  { code: 'PLT', description: 'Pallet' },
];

export interface SavedEntityInput {
  name: string;
  address: string;  // Make this required
  tin?: string | null;
  brn?: string | null;
  type?: string;
}
