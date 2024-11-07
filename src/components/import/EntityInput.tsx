// src/components/import/EntityInput.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { CustomEntity } from '@/types/import/index';

interface EntityInputProps {
  type: 'consignee' | 'exporter';
  value: string;
  savedEntries: CustomEntity[];
  onChange: (value: string) => void;
}

export const EntityInput: React.FC<EntityInputProps> = ({
  type,
  value,
  savedEntries,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>{type === 'consignee' ? 'Consignee' : 'Exporter'}</Label>
      <div className="space-y-2">
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select saved ${type}`} />
          </SelectTrigger>
          <SelectContent>
            {savedEntries.map((entry) => (
              <SelectItem key={entry.id} value={entry.name}>
                {entry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder={`Or enter new ${type} name`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};