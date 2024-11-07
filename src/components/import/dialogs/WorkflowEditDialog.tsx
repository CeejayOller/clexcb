import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { INCOTERMS } from '@/lib/constants';
import type { ShipmentData, ShipmentDetails, StatementOfFactEvent } from '@/types/import/workflow';
import { User } from '@/types/auth';

interface WorkflowEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShipmentData;
  section: string;
  onUpdate: (updates: Partial<ShipmentData>) => void;
  freightType: 'sea' | 'air';
  currentUser: User;
}

interface ExtendedShipmentDetails extends ShipmentDetails {
    markings_and_numbers?: string;
    packaging_code?: string;
    packaging_details?: string;
  }



// Type definitions for different forms
type ConsigneeForm = {
  name: string;
  address: string;
  tin?: string;
  brn?: string;
};

type ExporterForm = {
  name: string;
  address: string;
};

type TransportForm = {
  bl_number: string;
  vessel_name: string;
  flight_number: string;
  registry_number: string;
  voyage_number: string;
  container_number: string;
};

interface LocationForm extends ShipmentDetails {
    final_destination?: string;
    contact_person?: string;
    contact_number?: string;
  }
  
  interface ScheduleForm extends Pick<ShipmentDetails, 'eta' | 'ata'> {
    estimated_delivery?: string;
    actual_delivery?: string;
  }
  
  interface CargoForm {
    description_of_goods: string;
    markings_and_numbers: string;
    packaging_code: string;
    volume: string;
    packaging_details?: string;
  }
  
  interface ComputationsForm {
    dutiable_value: number;
    customs_duty: number;
    vat: number;
    other_charges: number;
    total_payable: number;
    exchange_rate: number;
  }
  
  interface NoteForm {
    content: string;
    timestamp: string;
    author: string;
  }
  
  interface StatementOfFactForm {
    description: string;
    timestamp: string;
    documents: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
    }>;
    createdBy: {
      id: string;
      name: string;
    };
  }


  const WorkflowEditDialog: React.FC<WorkflowEditDialogProps> = ({
    isOpen,
    onClose,
    data,
    section,
    onUpdate,
    freightType,
    currentUser
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editData, setEditData] = useState(() => {
      switch (section) {
        case 'consignee':
          return {
            name: data.consignee?.name || '',
            address: data.consignee?.address || '',
            tin: data.consignee?.tin || '',
            brn: data.consignee?.brn || ''
          } as ConsigneeForm;
        case 'exporter':
          return {
            name: data.exporter?.name || '',
            address: data.exporter?.address || ''
          } as ExporterForm;
        case 'transport':
          return {
            bl_number: data.shipmentDetails?.bl_number || '',
            vessel_name: data.shipmentDetails?.vessel_name || '',
            flight_number: data.shipmentDetails?.flight_number || '',
            registry_number: data.shipmentDetails?.registry_number || '',
            voyage_number: data.shipmentDetails?.voyage_number || '',
            container_number: data.shipmentDetails?.container_number || '',
          } as TransportForm;
        case 'location':
          return {
            port_of_origin: data.shipmentDetails?.port_of_origin || '',
            port_of_discharge: data.shipmentDetails?.port_of_discharge || '',
            terms_of_delivery: data.shipmentDetails?.terms_of_delivery || ''
          } as LocationForm;
        case 'schedule':
          return {
            eta: data.shipmentDetails?.eta || '',
            ata: data.shipmentDetails?.ata || ''
          } as ScheduleForm;
        default:
          return {};
      }
    });

    // Reset editData when section changes
useEffect(() => {
    if (isOpen) {
      switch (section) {
        case 'consignee':
          setEditData({
            name: data.consignee?.name || '',
            address: data.consignee?.address || '',
            tin: data.consignee?.tin || '',
            brn: data.consignee?.brn || ''
          } as ConsigneeForm);
          break;
  
        case 'exporter':
          setEditData({
            name: data.exporter?.name || '',
            address: data.exporter?.address || ''
          } as ExporterForm);
          break;
  
        case 'transport':
          if (freightType === 'sea') {
            setEditData({
              bl_number: data.shipmentDetails?.bl_number || '',
              vessel_name: data.shipmentDetails?.vessel_name || '',
              voyage_number: data.shipmentDetails?.voyage_number || '',
              registry_number: data.shipmentDetails?.registry_number || '',
              container_number: data.shipmentDetails?.container_number || '',
              flight_number: data.shipmentDetails?.flight_number || '', // Include for type consistency
            } as TransportForm);
          } else {
            setEditData({
              flight_number: data.shipmentDetails?.flight_number || '',
              vessel_name: data.shipmentDetails?.vessel_name || '', // Aircraft name
              bl_number: data.shipmentDetails?.bl_number || '', // Include for type consistency
              voyage_number: data.shipmentDetails?.voyage_number || '',
              registry_number: data.shipmentDetails?.registry_number || '',
              container_number: data.shipmentDetails?.container_number || '',
            } as TransportForm);
          }
          break;
  
        case 'location':
          setEditData({
            port_of_origin: data.shipmentDetails?.port_of_origin || '',
            port_of_discharge: data.shipmentDetails?.port_of_discharge || '',
            terms_of_delivery: data.shipmentDetails?.terms_of_delivery || '',
            final_destination: data.shipmentDetails?.final_destination || '',
            contact_person: data.shipmentDetails?.contact_person || '',
            contact_number: data.shipmentDetails?.contact_number || ''
          } as LocationForm);
          break;
  
        case 'schedule':
          setEditData({
            eta: data.shipmentDetails?.eta || '',
            ata: data.shipmentDetails?.ata || '',
        } as ScheduleForm);
          break;
  
        case 'cargo':
          setEditData({
            description_of_goods: data.shipmentDetails?.description_of_goods || '',
            markings_and_numbers: data.shipmentDetails?.markings_and_numbers || '',
            packaging_code: data.shipmentDetails?.packaging_code || '',
            volume: data.shipmentDetails?.volume || '',
            packaging_details: data.shipmentDetails?.packaging_details || ''
          });
          break;
  
        case 'documents':
          // If you need to edit document details
          setEditData({
            required_documents: data.documents?.map(doc => ({
              ...doc,
              status: doc.status || 'not_uploaded',
              files: doc.files || []
            })) || []
          });
          break;
  
        case 'computations':
          setEditData({
            dutiable_value: data.computations?.dutiable_value || 0,
            customs_duty: data.computations?.customs_duty || 0,
            vat: data.computations?.vat || 0,
            other_charges: data.computations?.other_charges || 0,
            total_payable: data.computations?.total_payable || 0,
          });
          break;
  
  
        case 'statement_of_facts':
          // For statement of facts editing
          setEditData({
            description: '',
            timestamp: new Date().toISOString(),
            documents: [],
            createdBy: {
              id: currentUser?.id || '',
              name: currentUser?.name || ''
            }
          });
          break;
  
        default:
          setEditData({});
          break;
      }
    }
  }, [section, isOpen, data, freightType]);



  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updates: Partial<ShipmentData> = {};
      
      switch (section) {
        case 'consignee':
          updates.consignee = {
            ...(data.consignee || {}),
            ...editData as ConsigneeForm
          };
          break;
        case 'exporter':
          updates.exporter = {
            ...data.exporter,
            ...editData as ExporterForm
          };
          break;
        case 'transport':
        case 'location':
        case 'schedule':
          updates.shipmentDetails = {
            ...data.shipmentDetails,
            ...editData
          };
          break;
          case 'statement_of_facts':
            if (!currentUser) {
              throw new Error('User information required');
            }
            
            const newStatement: StatementOfFactEvent = {
              id: crypto.randomUUID(), // Generate a unique ID
              timestamp: new Date().toISOString(),
              description: (editData as StatementOfFactForm).description,
              createdBy: {
                id: currentUser.id,
                name: currentUser.name
              },
              documents: []
            };
            
            updates.statementOfFacts = [
              ...(data.statementOfFacts || []),
              newStatement
            ];
            break;
      }

      await onUpdate(updates);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConsigneeForm = () => {
    const form = editData as ConsigneeForm;
    return (
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter company address"
          />
        </div>
        <div>
          <Label>TIN</Label>
          <Input
            value={form.tin}
            onChange={(e) => handleChange('tin', e.target.value)}
            placeholder="Enter TIN"
          />
        </div>
        <div>
          <Label>Business Registration Number</Label>
          <Input
            value={form.brn}
            onChange={(e) => handleChange('brn', e.target.value)}
            placeholder="Enter BRN"
          />
        </div>
      </div>
    );
  };

  const renderExporterForm = () => {
    const form = editData as ExporterForm;
    return (
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter exporter name"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter exporter address"
          />
        </div>
      </div>
    );
  };

  const renderTransportForm = () => {
    const form = editData as ShipmentDetails;
    return (
      <div className="space-y-4">
        {freightType === 'sea' ? (
          <>
            <div>
              <Label>Bill of Lading Number</Label>
              <Input
                value={form.bl_number}
                onChange={(e) => handleChange('bl_number', e.target.value)}
                placeholder="Enter B/L number"
              />
            </div>
            <div>
              <Label>Vessel Name</Label>
              <Input
                value={form.vessel_name}
                onChange={(e) => handleChange('vessel_name', e.target.value)}
                placeholder="Enter vessel name"
              />
            </div>
            <div>
              <Label>Voyage Number</Label>
              <Input
                value={form.voyage_number}
                onChange={(e) => handleChange('voyage_number', e.target.value)}
                placeholder="Enter voyage number"
              />
            </div>
            <div>
              <Label>Container Number</Label>
              <Input
                value={form.container_number}
                onChange={(e) => handleChange('container_number', e.target.value)}
                placeholder="Enter container number"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Airway Bill Number</Label>
              <Input
                value={form.flight_number}
                onChange={(e) => handleChange('flight_number', e.target.value)}
                placeholder="Enter AWB number"
              />
            </div>
            <div>
              <Label>Flight Number</Label>
              <Input
                value={form.flight_number}
                onChange={(e) => handleChange('flight_number', e.target.value)}
                placeholder="Enter flight number"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLocationForm = () => {
    const form = editData as ShipmentDetails;
    return (
      <div className="space-y-4">
        <div>
          <Label>Port of Origin</Label>
          <Input
            value={form.port_of_origin}
            onChange={(e) => handleChange('port_of_origin', e.target.value)}
            placeholder="Enter port of origin"
          />
        </div>
        <div>
          <Label>Port of Discharge</Label>
          <Input
            value={form.port_of_discharge}
            onChange={(e) => handleChange('port_of_discharge', e.target.value)}
            placeholder="Enter port of discharge"
          />
        </div>
        <div>
          <Label>Terms of Delivery</Label>
          <Select
            value={form.terms_of_delivery || ''}
            onValueChange={(value) => handleChange('terms_of_delivery', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Incoterms" />
            </SelectTrigger>
            <SelectContent>
              {INCOTERMS.map((term) => (
                <SelectItem key={term} value={term}>{term}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderScheduleForm = () => {
    const form = editData as ShipmentDetails;
    return (
      <div className="space-y-4">
        <div>
          <Label>Estimated Time of Arrival (ETA)</Label>
          <Input
            type="datetime-local"
            value={form.eta}
            onChange={(e) => handleChange('eta', e.target.value)}
          />
        </div>
        <div>
          <Label>Actual Time of Arrival (ATA)</Label>
          <Input
            type="datetime-local"
            value={form.ata}
            onChange={(e) => handleChange('ata', e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderStatementOfFactsForm = () => {
    const form = editData as StatementOfFactForm;
    return (
      <div className="space-y-4">
        <div>
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter statement description"
          />
        </div>
        {/* Add this to your existing renderForm switch statement */}
        <div className="text-sm text-gray-500">
          Will be created by: {currentUser?.name}
        </div>
      </div>
    );
  };
 

  const getDialogTitle = () => {
    switch (section) {
      case 'consignee':
        return 'Edit Consignee Details';
      case 'exporter':
        return 'Edit Exporter Details';
      case 'transport':
        return `Edit ${freightType === 'sea' ? 'Sea' : 'Air'} Transport Details`;
      case 'location':
        return 'Edit Location Details';
      case 'schedule':
        return 'Edit Schedule Details';
      default:
        return 'Edit Details';
    }
  };

  const renderForm = () => {
    switch (section) {
      case 'consignee':
        return renderConsigneeForm();
      case 'exporter':
        return renderExporterForm();
      case 'transport':
        return renderTransportForm();
      case 'location':
        return renderLocationForm();
      case 'schedule':
        return renderScheduleForm();
      case 'statement_of_facts':
        return renderStatementOfFactsForm();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {error && (
            <div className="p-4 mb-4 text-red-600 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
          <div className="p-6">
            {renderForm()}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowEditDialog;