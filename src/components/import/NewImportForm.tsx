// src/components/import/NewImportForm.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ship, Plane, Plus, Upload, FileText, X } from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';
import { createClientDuringShipmentAction } from '@/app/actions/import';
import { useAuth } from '@/components/layout/AuthProvider'
import type { 
  CustomEntity, 
  ValidationErrors, 
  PackageCode,
  NewImportFormProps, 
  ShipmentForm 
} from '@/types/import/index';
import type { ImportTransactionType } from '@/lib/utils/reference-number';
import type { ShipmentData, DocumentStatus, DocumentData } from '@/types/import/workflow';
import { REQUIRED_DOCUMENTS } from '@/lib/constants/workflow-states';
import { ComboboxInput } from './ComboboxInput';
import { MOCK_CLIENTS, MOCK_EXPORTERS, INCOTERMS, PACKAGE_CODES } from '@/lib/constants';
import { createShipmentAction, getSavedEntitiesAction } from '@/app/actions/import';



// Shipment Form Fields
interface ShipmentFormFieldsProps {
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

const ShipmentFormFields: React.FC<ShipmentFormFieldsProps> = ({ 
  formIndex,
  form,
  shipmentType,
  onChange,
  onGoodsChange,
  onGoodsRemove,
  onGoodsAdd,
  onDocumentUpload,
  savedConsignees = [],
  savedExporters = []
}) => {
  const { toast } = useToast();
  return (
    <div className="space-y-8 p-6 bg-card rounded-lg border shadow-sm">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consignee field */}
          <div className="space-y-2">
            <Label>Consignee</Label>
            <ComboboxInput
              type="consignee"
              value={form.consignee || ''}
              initialEntities={savedConsignees}
              onChangeAction={async (value, entityId, shouldCreate) => {
                // Always update the display value
                onChange(formIndex, 'consignee', value);

                if (entityId) {
                  // Handle selection of existing consignee
                  const selectedConsignee = savedConsignees.find(c => c.id === entityId);
                  if (selectedConsignee) {
                    // Auto-fill all related fields
                    onChange(formIndex, 'consigneeId', entityId);
                    if (selectedConsignee.contactPerson) {
                      onChange(formIndex, 'contactPerson', selectedConsignee.contactPerson);
                    }
                    if (selectedConsignee.contactNumber) {
                      onChange(formIndex, 'consigneeContactNumber', selectedConsignee.contactNumber);
                    }
                    if (selectedConsignee.tin) {
                      onChange(formIndex, 'tin', selectedConsignee.tin);
                    }
                    if (selectedConsignee.brn) {
                      onChange(formIndex, 'brn', selectedConsignee.brn);
                    }
                  }
                } else if (shouldCreate && value.trim()) {
                  // Create new consignee only when shouldCreate is true (Enter pressed)
                  try {
                    const response = await createClientDuringShipmentAction({
                      type: 'consignee',
                      name: value,
                      address: '',
                      contactPerson: form.contactPerson || '',
                      contactNumber: form.consigneeContactNumber || '',
                    });
                    
                    if (response.success && response.client) {
                      onChange(formIndex, 'consigneeId', response.client.id);
                      toast({
                        title: 'Success',
                        description: 'New consignee created'
                      });
                    }
                  } catch (error) {
                    console.error('Error creating consignee:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to create new consignee',
                      variant: 'destructive'
                    });
                  }
                }
              }}
              placeholder="Select or enter consignee"
            />
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label>Contact Person</Label>
            <Input 
              value={form.contactPerson || ''}
              onChange={(e) => onChange(formIndex, 'contactPerson', e.target.value)}
              placeholder="Enter contact person"
            />
          </div>

          {/* Exporter field */}
          <div className="space-y-2">
            <Label>Exporter</Label>
            <ComboboxInput
              type="exporter"
              value={form.exporter || ''}
              initialEntities={savedExporters}
              onChangeAction={async (value, entityId, shouldCreate) => {
                // Always update the display value
                onChange(formIndex, 'exporter', value);
                
                if (entityId) {
                  // Handle selection of existing exporter
                  const selectedExporter = savedExporters.find(e => e.id === entityId);
                  if (selectedExporter) {
                    // Auto-fill all related fields
                    onChange(formIndex, 'exporterId', entityId);
                    if (selectedExporter.address) {
                      onChange(formIndex, 'exporterAddress', selectedExporter.address);
                    }
                    if (selectedExporter.contactPerson) {
                      onChange(formIndex, 'exporterContactPerson', selectedExporter.contactPerson);
                    }
                    if (selectedExporter.contactNumber) {
                      onChange(formIndex, 'exporterContactNumber', selectedExporter.contactNumber);
                    }
                  }
                } else if (shouldCreate && value.trim()) {
                  // Create new exporter only when shouldCreate is true (Enter pressed)
                  try {
                    const response = await createClientDuringShipmentAction({
                      type: 'exporter',
                      name: value,
                      address: form.exporterAddress || '',
                      contactPerson: form.exporterContactPerson || '',
                      contactNumber: form.exporterContactNumber || ''
                    });
                    
                    if (response.success && response.client) {
                      onChange(formIndex, 'exporterId', response.client.id);
                      toast({
                        title: 'Success',
                        description: 'New exporter created'
                      });
                    }
                  } catch (error) {
                    console.error('Error creating exporter:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to create new exporter',
                      variant: 'destructive'
                    });
                  }
                }
              }}
              placeholder="Select or enter exporter"
            />
          </div>

          {/* Exporter Address */}
          <div className="space-y-2">
            <Label>Exporter Address</Label>
            <Input 
              value={form.exporterAddress || ''}
              onChange={(e) => onChange(formIndex, 'exporterAddress', e.target.value)}
              placeholder="Enter exporter address"
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Country of Export</Label>
            <Input 
              value={form.countryOfExport || ''}
              onChange={(e) => onChange(formIndex, 'countryOfExport', e.target.value)}
              placeholder="Enter country of export"
            />
          </div>

          <div className="space-y-2">
            <Label>Country of Origin</Label>
            <Input 
              value={form.countryOfOrigin || ''}
              onChange={(e) => onChange(formIndex, 'countryOfOrigin', e.target.value)}
              placeholder="Enter country of origin"
            />
          </div>

          <div className="space-y-2">
            <Label>Port of Origin</Label>
            <Input 
              value={form.portOfOrigin || ''}
              onChange={(e) => onChange(formIndex, 'portOfOrigin', e.target.value)}
              placeholder="Enter port of origin"
            />
          </div>

          <div className="space-y-2">
            <Label>Port of Discharge</Label>
            <Input 
              value={form.portOfDischarge || ''}
              onChange={(e) => onChange(formIndex, 'portOfDischarge', e.target.value)}
              placeholder="Enter port of discharge"
            />
          </div>

          <div className="space-y-2">
            <Label>Terms of Delivery</Label>
            <Select 
              value={form.termsOfDelivery || ''}
              onValueChange={(value) => onChange(formIndex, 'termsOfDelivery', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Incoterms" />
              </SelectTrigger>
              <SelectContent>
                {INCOTERMS.map(term => (
                  <SelectItem key={term} value={term}>{term}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

    {/* Shipment Details */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Shipment Type Specific Fields */}
        {shipmentType === 'sea' ? (
          <>
            <div>
              <Label>Bill of Lading No.</Label>
              <Input 
                value={form.blNumber}
                onChange={(e) => onChange(formIndex, 'blNumber', e.target.value)}
                placeholder="Enter B/L number"
              />
            </div>
            <div>
              <Label>Vessel Name</Label>
              <Input 
                value={form.vesselName}
                onChange={(e) => onChange(formIndex, 'vesselName', e.target.value)}
                placeholder="Enter vessel name"
              />
            </div>
            <div>
              <Label>Registry No.</Label>
              <Input 
                value={form.registryNo}
                onChange={(e) => onChange(formIndex, 'registryNo', e.target.value)}
                placeholder="Enter registry number"
              />
            </div>
            <div>
              <Label>Voyage No.</Label>
              <Input 
                value={form.voyageNo}
                onChange={(e) => onChange(formIndex, 'voyageNo', e.target.value)}
                placeholder="Enter voyage number"
              />
            </div>
            <div>
              <Label>Container No.</Label>
              <Input 
                value={form.containerNo}
                onChange={(e) => onChange(formIndex, 'containerNo', e.target.value)}
                placeholder="Enter container number"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Airway Bill No.</Label>
              <Input 
                value={form.awbNumber}
                onChange={(e) => onChange(formIndex, 'awbNumber', e.target.value)}
                placeholder="Enter AWB number"
              />
            </div>
            <div>
              <Label>Aircraft Name</Label>
              <Input 
                value={form.aircraftName}
                onChange={(e) => onChange(formIndex, 'aircraftName', e.target.value)}
                placeholder="Enter aircraft name"
              />
            </div>
            <div>
              <Label>Flight No.</Label>
              <Input 
                value={form.flightNo}
                onChange={(e) => onChange(formIndex, 'flightNo', e.target.value)}
                placeholder="Enter flight number"
              />
            </div>
          </>
        )}

        {/* Common Additional Fields */}
        <div>
          <Label>Markings & Numbers</Label>
          <Input 
            value={form.markingsAndNumbers}
            onChange={(e) => onChange(formIndex, 'markingsAndNumbers', e.target.value)}
            placeholder="Enter markings and numbers"
          />
        </div>
        <div>
          <Label>Packaging Code</Label>
          <Select 
            value={form.packagingCode}
            onValueChange={(value) => onChange(formIndex, 'packagingCode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select packaging code" />
            </SelectTrigger>
            <SelectContent>
            {PACKAGE_CODES.map((pkg: PackageCode) => (
              <SelectItem key={pkg.code} value={pkg.code}>
                {pkg.code} - {pkg.description}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goods Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg">Goods Declaration</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGoodsAdd(formIndex)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.goods.map((item, goodsIndex) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input 
                      value={item.description}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.invoiceValue}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'invoiceValue', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.grossWeight}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'grossWeight', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.netWeight}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'netWeight', parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'quantity', parseInt(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.hsCode}
                      onChange={(e) => onGoodsChange(formIndex, goodsIndex, 'hsCode', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGoodsRemove(formIndex, goodsIndex)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      </div>  

      {/* Document Upload Section */}
      <div>
        <Label className="text-lg">Supporting Documents</Label>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Commercial Invoice */}
          <div>
            <Label>Commercial Invoice</Label>
            <div className="mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById(`invoice-upload-${formIndex}`)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
              <input
                id={`invoice-upload-${formIndex}`}
                type="file"
                className="hidden"
                onChange={(e) => onDocumentUpload(e, 'invoice', formIndex)}
              />
            </div>
            {form.documents['invoice']?.map(doc => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
          
          {/* Packing List */}
          <div>
            <Label>Packing List</Label>
            <div className="mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById(`packing-upload-${formIndex}`)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Packing List
              </Button>
              <input
                id={`packing-upload-${formIndex}`}
                type="file"
                className="hidden"
                onChange={(e) => onDocumentUpload(e, 'packing', formIndex)}
              />
            </div>
            {form.documents['packing']?.map(doc => (
              <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {doc}
              </div>
            ))}
          </div>
          {/* Other Documents */}
          <div>
      <Label>Other Documents</Label>
      <div className="mt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => document.getElementById(`other-upload-${formIndex}`)?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Other Documents
        </Button>
        <input
          id={`other-upload-${formIndex}`}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => onDocumentUpload(e, 'other', formIndex)}
        />
      </div>
      {form.documents['other']?.map(doc => (
        <div key={doc} className="text-sm text-gray-600 mt-1 flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          {doc}
        </div>
      ))}
    </div>
    </div>
    </div>
    </div>
);
};

  


const NewImportForm: React.FC<NewImportFormProps> = ({ onComplete }) => {
  const { user } = useAuth()
  const [shipmentType, setShipmentType] = useState<'sea' | 'air'>('sea');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedConsignees, setSavedConsignees] = useState<CustomEntity[]>([]);
  const [savedExporters, setSavedExporters] = useState<CustomEntity[]>([]);
  const [forms, setForms] = useState<ShipmentForm[]>([{
    id: '1',
    consignee: '',
    consigneeId: undefined,
    consigneeNew: '',
    contactPerson: '',
    consigneeContactNumber: '',
    exporter: '',
    exporterId: undefined,
    exporterNew: '',
    exporterAddress: '',
    exporterContactPerson: '',
    exporterContactNumber: '',
    portOfOrigin: '',
    countryOfExport: '',
    countryOfOrigin: '',
    portOfDischarge: '',
    termsOfDelivery: '',
    markingsAndNumbers: '',
    packagingCode: '',
    
    // Sea freight fields
    blNumber: '',
    isMultipleBL: false,
    vesselName: '',
    registryNo: '',
    voyageNo: '',
    containerNo: '',
    
    // Air freight fields
    awbNumber: '',
    aircraftName: '',
    flightNo: '',
    
    // Common arrays
    goods: [],
    documents: {},
  }]);
  console.log('Forms state:', forms)

  // Form handlers
  const handleFormChange = (index: number, field: string, value: any) => {
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      [field]: value,
    };
    setForms(updatedForms);
  };

  const handleGoodsChange = (formIndex: number, goodsIndex: number, field: string, value: any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods[goodsIndex] = {
      ...updatedForms[formIndex].goods[goodsIndex],
      [field]: value,
    };
    setForms(updatedForms);
  };

  const handleGoodsAdd = (formIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods.push({
      id: Math.random().toString(),
      description: '',
      invoiceValue: 0,
      grossWeight: 0,
      netWeight: 0,
      quantity: 0,
      hsCode: '',
    });
    setForms(updatedForms);
  };

  const handleGoodsRemove = (formIndex: number, goodsIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goods.splice(goodsIndex, 1);
    setForms(updatedForms);
  };
  
  // When handling document uploads
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, docType: string, formIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedForms = [...forms];
      const currentDocs = updatedForms[formIndex].documents[docType] || [];
      updatedForms[formIndex].documents = {
        ...updatedForms[formIndex].documents,
        [docType]: [...currentDocs, file.name],
      };
      setForms(updatedForms);
    }
  };

  useEffect(() => {
    const loadSavedEntries = async () => {
      try {
        const [consignees, exporters] = await Promise.all([
          getSavedEntitiesAction('consignee'),
          getSavedEntitiesAction('exporter')
        ]);
        console.log('Loaded consignees:', consignees);
        console.log('Loaded exporters:', exporters);
  
        setSavedConsignees(consignees);
        setSavedExporters(exporters);
      } catch (error) {
        console.error('Error loading saved entries:', error);
        setSavedConsignees([]);
        setSavedExporters([]);
      }
    };
  
    loadSavedEntries();
  }, []);

  const handleSubmitForm = async () => {
    try {
      if (!user) {
        setFormErrors({
          submit: 'You must be logged in to create a shipment'
        })
        return
      }
  
      setFormErrors({})
      
      const currentErrors = validateForm(forms[0])
      if (Object.keys(currentErrors).length > 0) {
        setFormErrors(currentErrors)
        return
      }
  
      setIsSubmitting(true)
      
      const formData = forms[0]
  
      // Explicitly type the shipmentType
      const shipmentData: {
        shipmentType: ImportTransactionType;
        formData: Partial<ShipmentData>;
      } = {
        shipmentType: shipmentType === 'sea' ? 'IMS' as const : 'IMA' as const,
        formData: {
          consignee: formData.consigneeId ? {
            id: formData.consigneeId,
            name: formData.consignee,
            address: ''
          } : {
            name: formData.consignee,
            address: ''
          },
          exporter: formData.exporterId ? {
            id: formData.exporterId,
            name: formData.exporter,
            address: formData.exporterAddress || ''
          } : {
            name: formData.exporter,
            address: formData.exporterAddress || ''
          },
          shipmentDetails: {
            bl_number: shipmentType === 'sea' ? formData.blNumber : '',
            vessel_name: shipmentType === 'sea' ? formData.vesselName : formData.aircraftName,
            flight_number: shipmentType === 'air' ? formData.flightNo : '',
            registry_number: formData.registryNo || '',
            voyage_number: formData.voyageNo || '',
            container_number: formData.containerNo || '',
            port_of_origin: formData.portOfOrigin || '',
            port_of_discharge: formData.portOfDischarge || '',
            eta: '',
            ata: '',
            description_of_goods: formData.goods.map(g => g.description).join(', '),
            volume: ''
          },
          documents: Object.entries(formData.documents || {}).map(([type, files]) => ({
            name: type,
            status: 'not_uploaded' as DocumentStatus,
            isVerified: false,
            isRequired: REQUIRED_DOCUMENTS.some(doc => doc.name === type && doc.isRequired),
            files: files || []
          }))
        }
      };
  
      const shipmentResponse = await createShipmentAction(shipmentData)
  
      if (shipmentResponse && shipmentResponse.referenceNumber) {
        setReferenceNumber(shipmentResponse.referenceNumber)
        setIsConfirmDialogOpen(true)
      } else {
        throw new Error('Failed to get reference number from shipment creation')
      }
    } catch (error) {
      console.error('Error creating shipment:', error)
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Failed to create shipment. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsConfirmDialogOpen(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({
        ...formErrors,
        submit: 'Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhance form validation
  const validateForm = (form: ShipmentForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!form.consignee || typeof form.consignee !== 'string' || !form.consignee.trim()) {
      errors.consignee = 'Consignee is required';
    }
    
    if (!form.exporter?.trim()) {
      errors.exporter = 'Exporter is required';
    }
    
    if (!form.exporterAddress?.trim()) {
      errors.exporterAddress = 'Exporter address is required';
    }
    
    // Location validation
    if (!form.portOfOrigin?.trim() && !form.countryOfExport?.trim()) {
      errors.origin = 'Either port of origin or country of export is required';
    }
    
    if (!form.portOfDischarge?.trim()) {
      errors.portOfDischarge = 'Port of discharge is required';
    }
    
    // Shipment type specific validations
    if (shipmentType === 'sea') {
      if (!form.blNumber?.trim()) {
        errors.blNumber = 'Bill of Lading number is required';
      }
      if (!form.vesselName?.trim()) {
        errors.vesselName = 'Vessel name is required';
      }
    } else {
      if (!form.awbNumber?.trim()) {
        errors.awbNumber = 'Airway Bill number is required';
      }
      if (!form.flightNo?.trim()) {
        errors.flightNo = 'Flight number is required';
      }
    }
    
    // Validate goods
    if (!form.goods?.length) {
      errors.goods = 'At least one item must be added';
    } else {
      form.goods.forEach((item, index) => {
        if (!item.description?.trim()) {
          errors[`goods_${index}`] = `Description is required for item ${index + 1}`;
        }
        if (!item.quantity || item.quantity <= 0) {
          errors[`goods_quantity_${index}`] = `Valid quantity is required for item ${index + 1}`;
        }
      });
    }
    
    return errors;
  };

  console.log('Rendering with savedConsignees:', savedConsignees);
  console.log('Rendering with savedExporters:', savedExporters);

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      {/* Error Display - Keep existing */}
      {Object.keys(formErrors).length > 0 && (
        <div className="mb-4 p-4 border border-red-200 rounded bg-red-50">
          <h4 className="text-red-700 font-medium mb-2">Please fix the following errors:</h4>
          <ul className="list-disc pl-5 text-red-600">
            {Object.entries(formErrors).map(([key, value]) => (
              <li key={key}>{String(value)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Freight Type Tabs */}
      <Tabs 
        value={shipmentType} 
        onValueChange={(value) => setShipmentType(value as 'sea' | 'air')}
        className="space-y-4"
      >
        <div className="border-b">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="sea" className="flex-1 sm:flex-none data-[state=active]:border-primary">
              <Ship className="w-4 h-4 mr-2" />
              Sea Freight
            </TabsTrigger>
            <TabsTrigger value="air" className="flex-1 sm:flex-none data-[state=active]:border-primary">
              <Plane className="w-4 h-4 mr-2" />
              Air Freight
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sea" className="space-y-4">
          {forms.map((form, index) => (
            <ShipmentFormFields 
              key={form.id}
              formIndex={index}
              form={form}
              shipmentType="sea"
              onChange={handleFormChange}
              onGoodsChange={handleGoodsChange}
              onGoodsRemove={handleGoodsRemove}
              onGoodsAdd={handleGoodsAdd}
              onDocumentUpload={handleDocumentUpload}
              savedConsignees={savedConsignees}
              savedExporters={savedExporters}
            />
          ))}
        </TabsContent>

        <TabsContent value="air" className="space-y-4">
          <ShipmentFormFields 
            formIndex={0}
            form={forms[0]}
            shipmentType="air"
            onChange={handleFormChange}
            onGoodsChange={handleGoodsChange}
            onGoodsRemove={handleGoodsRemove}
            onGoodsAdd={handleGoodsAdd}
            onDocumentUpload={handleDocumentUpload}
            savedConsignees={savedConsignees}
            savedExporters={savedExporters}
          />
        </TabsContent>
      </Tabs>

      {/* Keep existing Action Buttons and Dialog */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={onComplete}>Cancel</Button>
        <Button onClick={handleSubmitForm}>Create Shipment</Button>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        {/* Keep existing Dialog content */}
      </Dialog>
    </div>
  );
};

export default NewImportForm as React.FC<NewImportFormProps>;