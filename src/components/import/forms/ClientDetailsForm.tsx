// src/components/import/forms/ClientDetailsForm.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Building, 
  Globe, 
  Truck, 
  FileText,
  Ship,
  Plane,
  Package,
  Calendar,
  MapPin
} from 'lucide-react';
import type { ShipmentData } from '@/types/import/workflow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


interface ClientDetailsFormProps {
  data: ShipmentData;
  freightType: 'sea' | 'air';
  onEdit: (section: string) => void;
  onConfirm: () => void;
  isCompleteCheck: () => { isComplete: boolean; missingFields: string[] };
}
  
const ClientDetailsForm: React.FC<ClientDetailsFormProps> = ({
  data,
  freightType,
  onEdit,
  onConfirm,
  isCompleteCheck
}) => {
  const { isComplete, missingFields } = isCompleteCheck();

  const DetailsSection = ({ 
    title, 
    icon: Icon, 
    items, 
    section 
  }: { 
    title: string; 
    icon: any; 
    items: { label: string; value: string | undefined }[];
    section: string;
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => onEdit(section)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 pl-7">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-medium">
              {item.value || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/80">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Client & Shipment Information</CardTitle>
          <Button
            onClick={onConfirm}
            disabled={!isComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirm Details
          </Button>
        </div>
        {!isComplete && (
          <div className="flex items-center mt-2 text-amber-600 text-sm">
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
              Incomplete
            </Badge>
            <span className="ml-2">Please provide all required information</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Consignee Information */}
        <DetailsSection
          title="Consignee Details"
          icon={Building}
          section="consignee"
          items={[
            { label: "Company Name", value: data.consignee?.name },
            { label: "Address", value: data.consignee?.address },
            { label: "TIN", value: data.consignee?.tin },
            { label: "Business Registration", value: data.consignee?.brn },
            { label: "Contact Person", value: data.shipmentDetails.contact_person },
            { label: "Contact Number", value: data.shipmentDetails.contact_number }
          ]}
        />
        {/* Exporter Information */}
        <DetailsSection
          title="Exporter Details"
          icon={Globe}
          section="exporter"
          items={[
            { label: "Company Name", value: data.exporter.name },
            { label: "Address", value: data.exporter.address }
          ]}
        />

        {/* Shipment Details */}
        <DetailsSection
          title={freightType === 'sea' ? "Sea Freight Details" : "Air Freight Details"}
          icon={freightType === 'sea' ? Ship : Plane}
          section="transport"
          items={freightType === 'sea' ? [
            { label: "Bill of Lading Number", value: data.shipmentDetails.bl_number },
            { label: "Vessel Name", value: data.shipmentDetails.vessel_name },
            { label: "Voyage Number", value: data.shipmentDetails.voyage_number },
            { label: "Registry Number", value: data.shipmentDetails.registry_number },
            { label: "Container Number", value: data.shipmentDetails.container_number }
          ] : [
            { label: "Airway Bill Number", value: data.shipmentDetails.flight_number },
            { label: "Flight Number", value: data.shipmentDetails.flight_number },
            { label: "Aircraft Name", value: data.shipmentDetails.vessel_name }
          ]}
        />

        {/* Location Information Section */}
        <DetailsSection
          title="Location & Routing"
          icon={MapPin}
          section="location"
          items={[
            { label: "Port of Origin", value: data.shipmentDetails.port_of_origin },
            { label: "Port of Discharge", value: data.shipmentDetails.port_of_discharge },
            { label: "Final Destination", value: data.shipmentDetails.final_destination },
            { label: "Terms of Delivery", value: data.shipmentDetails.terms_of_delivery }
          ]}
        />

        {/* Schedule Information section */}
        <DetailsSection
          title="Schedule Information"
          icon={Calendar}
          section="schedule"
          items={[
            { label: "Estimated Time of Arrival (ETA)", value: data.shipmentDetails.eta },
            { label: "Actual Time of Arrival (ATA)", value: data.shipmentDetails.ata }
          ]}
        />

        {/* Cargo Details */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Package className="w-5 h-5 text-gray-500" />
      <h3 className="font-medium text-gray-700">Goods Declaration</h3>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:text-blue-700"
      onClick={() => onEdit('cargo')}
    >
      <Edit2 className="w-4 h-4 mr-2" />
      Edit
    </Button>
  </div>
  
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Invoice Value (USD)</TableHead>
          <TableHead>Gross Weight</TableHead>
          <TableHead>Net Weight</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>HS Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.cargo && data.cargo.length > 0 ? (
          data.cargo.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description || '-'}</TableCell>
              <TableCell>${item.invoiceValue?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>{item.grossWeight || '0'} kg</TableCell>
              <TableCell>{item.netWeight || '0'} kg</TableCell>
              <TableCell>{item.quantity || '0'}</TableCell>
              <TableCell>{item.hsCode || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-4">
              No goods declared yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

        {/* Documents Status */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Required Documents</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 pl-7">
            {data.documents
              .filter(doc => doc.isRequired)
              .map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      doc.isVerified ? 'bg-green-500' : 
                      doc.status === 'draft' ? 'bg-amber-500' : 
                      'bg-gray-300'
                    }`} 
                  />
                  <span className="text-sm text-gray-600">{doc.name}</span>
                </div>
              ))
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetailsForm;