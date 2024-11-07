// src/components/import/cards/CargoDetailsCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ShipmentData, CargoItem } from '@/types/import/workflow';

interface CargoItemCardProps {
  item: CargoItem;
  onEdit: () => void;
  onDelete: () => void;
}

const CargoItemCard: React.FC<CargoItemCardProps> = ({ item, onEdit, onDelete }) => (
  <Card className="w-full">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm truncate">{item.description}</h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Value:</span> ${item.invoiceValue.toFixed(2)}</p>
        <p><span className="font-medium">Weight:</span> {item.grossWeight}kg/{item.netWeight}kg</p>
        <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
        <p><span className="font-medium">HS Code:</span> {item.hsCode}</p>
      </div>
    </CardContent>
  </Card>
);

interface CargoEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: CargoItem | null;
  onSave: (item: CargoItem) => void;
}

const CargoEditDialog: React.FC<CargoEditDialogProps> = ({ isOpen, onClose, item, onSave }) => {
  const [editForm, setEditForm] = React.useState<CargoItem>(
    item || {
      id: Math.random().toString(),
      description: '',
      invoiceValue: 0,
      grossWeight: 0,
      netWeight: 0,
      quantity: 0,
      hsCode: ''
    }
  );

  const handleChange = (field: keyof CargoItem, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Description</Label>
            <Input
              value={editForm.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Value (USD)</Label>
              <Input
                type="number"
                value={editForm.invoiceValue}
                onChange={(e) => handleChange('invoiceValue', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>HS Code</Label>
              <Input
                value={editForm.hsCode}
                onChange={(e) => handleChange('hsCode', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Gross Weight</Label>
              <Input
                type="number"
                value={editForm.grossWeight}
                onChange={(e) => handleChange('grossWeight', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Net Weight</Label>
              <Input
                type="number"
                value={editForm.netWeight}
                onChange={(e) => handleChange('netWeight', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={editForm.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(editForm)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const CargoDetailsCard: React.FC<{
    data: ShipmentData;
    onUpdate: (updates: Partial<ShipmentData>) => void;
  }> = ({ data, onUpdate }) => {
    const [editingItem, setEditingItem] = React.useState<CargoItem | null>(null);
  
    // Ensure cargo exists with a default empty array
    const cargoItems = data.cargo || [];
  
    const handleAddItem = () => {
      const newItem: CargoItem = {
        id: Math.random().toString(),
        description: '',
        invoiceValue: 0,
        grossWeight: 0,
        netWeight: 0,
        quantity: 0,
        hsCode: ''
      };
      setEditingItem(newItem);
    };
  
    const handleSaveItem = (item: CargoItem) => {
      const isNew = !cargoItems.find(i => i.id === item.id);
      const updatedCargo = isNew 
        ? [...cargoItems, item]
        : cargoItems.map(i => i.id === item.id ? item : i);
      
      onUpdate({ cargo: updatedCargo });
      setEditingItem(null);
    };
  
    const handleDeleteItem = (id: string) => {
      onUpdate({ cargo: cargoItems.filter(item => item.id !== id) });
    };
  
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Cargo Details</h3>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
  
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {cargoItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm truncate">{item.description}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Value:</span> ${item.invoiceValue.toFixed(2)}</p>
                    <p><span className="font-medium">Weight:</span> {item.grossWeight}kg/{item.netWeight}kg</p>
                    <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    <p><span className="font-medium">HS Code:</span> {item.hsCode}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
  
          {editingItem && (
            <Dialog open={true} onOpenChange={() => setEditingItem(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem.id ? 'Edit Cargo Item' : 'Add Cargo Item'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={editingItem.description}
                      onChange={(e) => setEditingItem(prev => ({ ...prev!, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Value (USD)</Label>
                      <Input
                        type="number"
                        value={editingItem.invoiceValue}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, invoiceValue: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>HS Code</Label>
                      <Input
                        value={editingItem.hsCode}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, hsCode: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Gross Weight</Label>
                      <Input
                        type="number"
                        value={editingItem.grossWeight}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, grossWeight: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>Net Weight</Label>
                      <Input
                        type="number"
                        value={editingItem.netWeight}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, netWeight: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, quantity: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                  <Button onClick={() => handleSaveItem(editingItem)}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    );
  };