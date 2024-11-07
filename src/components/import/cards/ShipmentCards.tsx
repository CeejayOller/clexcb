// src/components/import/cards/ShipmentCards.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save } from 'lucide-react';
import type { ShipmentData, CargoItem } from '@/types/import/workflow';
import { ShipmentDetailsEditDialog, ConsigneeEditDialog } from '../dialogs/EditDialogs';
import { CargoDetailsCard } from './CargoDetailsCard';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, title, children, onSave }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        {children}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);


interface ShipmentDetailsCardProps {
    data: ShipmentData;
    onUpdate: (updates: Partial<ShipmentData>) => void;
    freightType: 'IMS' | 'IMA';
  }
  
  export const ShipmentDetailsCard: React.FC<ShipmentDetailsCardProps> = ({ 
    data, 
    onUpdate, 
    freightType 
  }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState(data.shipmentDetails);

  const handleSave = () => {
    onUpdate({ shipmentDetails: editForm });
    setIsEditing(false);
  };

  return (
    <Card className="col-span-1">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Shipment Details</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm space-y-1">
          {/* Display shipment details */}
          <p><span className="font-medium">BL/AWB Number:</span> {data.shipmentDetails.bl_number || data.shipmentDetails.flight_number}</p>
          <p><span className="font-medium">Vessel/Flight:</span> {data.shipmentDetails.vessel_name || data.shipmentDetails.flight_number}</p>
          <p><span className="font-medium">Port of Origin:</span> {data.shipmentDetails.port_of_origin}</p>
          <p><span className="font-medium">Port of Discharge:</span> {data.shipmentDetails.port_of_discharge}</p>
        </div>

        <EditDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Shipment Details"
          onSave={handleSave}
        >
          <div className="space-y-4">
            <div>
              <Label>BL/AWB Number</Label>
              <Input
                value={editForm.bl_number || editForm.flight_number}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  bl_number: e.target.value
                }))}
              />
            </div>
            {/* Add more input fields */}
          </div>
        </EditDialog>
      </CardContent>
    </Card>
  );
};

export const ConsigneeCard: React.FC<{
    data: ShipmentData;
    onUpdate: (updates: Partial<ShipmentData>) => void;
  }> = ({ data, onUpdate }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
      consignee: data.consignee || {
        name: '',
        address: '',
        tin: '',
        brn: ''
      },
      exporter: data.exporter
    });
  
    const handleSave = () => {
      onUpdate({
        consignee: editForm.consignee,
        exporter: editForm.exporter
      });
      setIsEditing(false);
    };
  
    const handleConsigneeChange = (field: string, value: string) => {
      setEditForm(prev => ({
        ...prev,
        consignee: {
          ...prev.consignee!,
          [field]: value
        }
      }));
    };
  
    return (
      <Card className="col-span-1">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium">Consignee & Exporter Details</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
  
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Consignee:</span> {data.consignee?.name || 'Not set'}</p>
            <p><span className="font-medium">Address:</span> {data.consignee?.address || 'Not set'}</p>
            <div className="mt-4">
              <p><span className="font-medium">Exporter:</span> {data.exporter.name}</p>
              <p><span className="font-medium">Address:</span> {data.exporter.address}</p>
            </div>
          </div>
  
          <EditDialog
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            title="Edit Consignee & Exporter Details"
            onSave={handleSave}
          >
            <div className="space-y-4">
              <div>
                <Label>Consignee Name</Label>
                <Input
                  value={editForm.consignee?.name || ''}
                  onChange={(e) => handleConsigneeChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Consignee Address</Label>
                <Input
                  value={editForm.consignee?.address || ''}
                  onChange={(e) => handleConsigneeChange('address', e.target.value)}
                  required
                />
              </div>
              {/* Add more fields as needed */}
            </div>
          </EditDialog>
        </CardContent>
      </Card>
    );
  };

  interface CardLayoutProps {
    data: ShipmentData;
    onUpdate: (updates: Partial<ShipmentData>) => void;
    freightType: 'IMS' | 'IMA';
  }
  
  export const CardLayout: React.FC<CardLayoutProps> = ({ 
    data, 
    onUpdate, 
    freightType 
  }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <ShipmentDetailsCard 
            data={data} 
            onUpdate={onUpdate} 
            freightType={freightType} 
          />
          <ConsigneeCard 
            data={data} 
            onUpdate={onUpdate} 
          />
        </div>
        
        <CargoDetailsCard 
          data={data} 
          onUpdate={onUpdate} 
        />
      </div>
    );
  };