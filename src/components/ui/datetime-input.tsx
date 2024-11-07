// src/components/ui/datetime-input.tsx
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimeInputProps {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  className?: string;
}

export function DateTimeInput({ 
  label, 
  date, 
  time, 
  onDateChange, 
  onTimeChange,
  className 
}: DateTimeInputProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2 mt-1.5">
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
}