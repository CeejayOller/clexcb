// src/components/import/cards/CardLayout.tsx
import React from 'react';
import { ShipmentDetailsCard } from './ShipmentCards';
import { ConsigneeCard } from './ShipmentCards';
import { CargoDetailsCard } from './CargoDetailsCard';
import type { ShipmentData } from '@/types/import/workflow';
import type { ImportTransactionType } from '@/lib/utils/reference-number';

interface CardLayoutProps {
  data: ShipmentData;
  onUpdate: (updates: Partial<ShipmentData>) => void;
  freightType: ImportTransactionType;
}

export const CardLayout: React.FC<CardLayoutProps> = ({ data, onUpdate, freightType }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <ShipmentDetailsCard 
          data={data} 
          onUpdate={onUpdate} 
          freightType={freightType === 'IMS' ? 'IMS' : 'IMA'} 
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