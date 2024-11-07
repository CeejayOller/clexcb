import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RoleSelectProps {
  value: string
  onChange: (value: string) => void
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Account Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select account type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CLIENT">Client</SelectItem>
          <SelectItem value="BROKER">Broker</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}