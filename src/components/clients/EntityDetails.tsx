// src/components/clients/EntityDetails.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { updateConsignee, updateExporter } from '@/app/actions/clients'

// Define strict types for each entity
interface BaseEntityData {
  id: string
  name: string
  businessAddress: string
  contactPerson: string
  contactNumber: string
  email: string
}

interface ConsigneeFormData extends BaseEntityData {
  registeredName: string
  tin: string
  brn: string
}

interface ExporterFormData extends BaseEntityData {
  // No additional fields
}

type EntityFormData = ConsigneeFormData | ExporterFormData

interface EntityDetailsProps {
  data: EntityFormData
  type: 'consignee' | 'exporter'
  onUpdateAction: () => Promise<void>
}

export function EntityDetails({ data, type, onUpdateAction }: EntityDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<EntityFormData>(data)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Type guard to check if the data is ConsigneeFormData
  const isConsigneeData = (data: EntityFormData): data is ConsigneeFormData => {
    return type === 'consignee'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isConsigneeData(formData)) {
        // Handle consignee update
        const consigneeData: ConsigneeFormData = {
          id: formData.id,
          name: formData.name,
          registeredName: formData.registeredName,
          businessAddress: formData.businessAddress,
          tin: formData.tin,
          brn: formData.brn,
          contactPerson: formData.contactPerson,
          contactNumber: formData.contactNumber,
          email: formData.email
        }
        const result = await updateConsignee(data.id, consigneeData)
        if (result.error) throw new Error(result.error)
      } else {
        // Handle exporter update
        const result = await updateExporter(data.id, formData)
        if (result.error) throw new Error(result.error)
      }

      await onUpdateAction()
      toast({
        title: 'Success',
        description: 'Changes saved successfully'
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save changes'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof ConsigneeFormData | keyof ExporterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const renderEditForm = () => {
    if (isConsigneeData(formData)) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
            </div>
            <div>
              <Label>Registered Name</Label>
              <Input
                value={formData.registeredName}
                onChange={handleChange('registeredName')}
                required
              />
            </div>
            <div>
              <Label>TIN</Label>
              <Input
                value={formData.tin}
                onChange={handleChange('tin')}
                required
              />
            </div>
            <div>
              <Label>BRN</Label>
              <Input
                value={formData.brn}
                onChange={handleChange('brn')}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Business Address</Label>
              <Input
                value={formData.businessAddress}
                onChange={handleChange('businessAddress')}
                required
              />
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input
                value={formData.contactPerson}
                onChange={handleChange('contactPerson')}
                required
              />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={handleChange('contactNumber')}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )
    }

    // Render exporter form
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Company Name</Label>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div className="col-span-2">
            <Label>Business Address</Label>
            <Input
              value={formData.businessAddress}
              onChange={handleChange('businessAddress')}
              required
            />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input
              value={formData.contactPerson}
              onChange={handleChange('contactPerson')}
              required
            />
          </div>
          <div>
            <Label>Contact Number</Label>
            <Input
              value={formData.contactNumber}
              onChange={handleChange('contactNumber')}
              required
            />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    )
  }

  const renderDetails = () => {
    if (isConsigneeData(data)) {
      return (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-muted-foreground">Company Name</Label>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Registered Name</Label>
            <p className="font-medium">{data.registeredName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">TIN</Label>
            <p className="font-medium">{data.tin}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">BRN</Label>
            <p className="font-medium">{data.brn}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-muted-foreground">Business Address</Label>
            <p className="font-medium">{data.businessAddress}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Contact Person</Label>
            <p className="font-medium">{data.contactPerson}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Contact Number</Label>
            <p className="font-medium">{data.contactNumber}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium">{data.email}</p>
          </div>
        </div>
      )
    }

    // Render exporter details
    return (
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <Label className="text-muted-foreground">Company Name</Label>
          <p className="font-medium">{data.name}</p>
        </div>
        <div className="col-span-2">
          <Label className="text-muted-foreground">Business Address</Label>
          <p className="font-medium">{data.businessAddress}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Contact Person</Label>
          <p className="font-medium">{data.contactPerson}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Contact Number</Label>
          <p className="font-medium">{data.contactNumber}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Email</Label>
          <p className="font-medium">{data.email}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          <EditIcon className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {type === 'consignee' ? 'Consignee' : 'Exporter'}</DialogTitle>
          </DialogHeader>
          {renderEditForm()}
        </DialogContent>
      </Dialog>

      {renderDetails()}
    </div>
  )
}