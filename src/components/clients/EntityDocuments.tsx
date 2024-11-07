// src/components/clients/EntityDocuments.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Upload, FileText, Trash2 } from 'lucide-react'
import { addConsigneeDocument } from '@/app/actions/clients'

interface EntityDocumentsProps {
  entityId: string
  documents: Array<{
    id: string
    name: string
    fileUrl: string
    uploadedAt: string
  }>
  type: 'consignee' | 'exporter'
  onUpdateAction: () => Promise<void>
}

export function EntityDocuments({ 
  entityId, 
  documents, 
  type, 
  onUpdateAction 
}: EntityDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      
      if (type === 'consignee') {
        const result = await addConsigneeDocument(entityId, {
          name: file.name,
          fileUrl: URL.createObjectURL(file) // In production, use proper file upload
        })

        if (result.error) {
          throw new Error(result.error)
        }
      }
      // Handle exporter documents if needed

      await onUpdateAction()
      setShowUploadDialog(false)
      
      toast({
        title: 'Success',
        description: 'Document uploaded successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}