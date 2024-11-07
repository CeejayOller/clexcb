// components/auth/AuthCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  children: React.ReactNode
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

// components/auth/AuthFormField.tsx
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface AuthFormFieldProps {
    name: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
  }
  
  export function AuthFormField({
    name,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false
  }: AuthFormFieldProps) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      </div>
    )
  }