// src/components/clients/ExporterForm.tsx
'use client'

import { useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createExporter, type ExporterFormData } from '@/app/actions/clients'
import { useToast } from '@/components/ui/use-toast'

interface FormProps {
    onSuccessAction: () => Promise<void>
    onCloseAction: () => Promise<void>
}

export function ExporterForm({ onSuccessAction, onCloseAction }: FormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ExporterFormData>({
    name: '',
    businessAddress: '',
    contactPerson: '',
    contactNumber: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createExporter(formData)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      await onSuccessAction()
      
      toast({
        title: 'Success',
        description: 'Exporter created successfully'
      })

      await onCloseAction()

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create exporter',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof ExporterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Exporter</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange('name')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange('businessAddress')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange('contactPerson')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange('contactNumber')}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Exporter'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}