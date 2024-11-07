// src/app/(dashboard)/admin/clients/[type]/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getConsigneeById, getExporterById } from '@/app/actions/clients'
import { EntityDetails } from '@/components/clients/EntityDetails'
import { EntityDocuments } from '@/components/clients/EntityDocuments'
import { EntityShipments } from '@/components/clients/EntityShipments'
import { Loader2 } from 'lucide-react'
import type { ConsigneeData, ExporterData } from '@/app/actions/clients'

type EntityData = (ConsigneeData | ExporterData) & {
  id: string
  documents?: any[]
  shipments?: any[]
}

export default function EntityDetailPage() {
  const params = useParams()
  const [data, setData] = useState<EntityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateAction = async () => {
    await loadEntity()
  }

  const loadEntity = async () => {
    try {
      setIsLoading(true)
      const result = params.type === 'consignee'
        ? await getConsigneeById(params.id as string)
        : await getExporterById(params.id as string)

      if (result.error) {
        setError(result.error)
        return
      }

      if (!result.data) {
        setError('No data received')
        return
      }

      // Now TypeScript knows result.data is either ConsigneeData or ExporterData
      setData(result.data)
    } catch (error) {
      setError('Failed to load entity details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEntity()
  }, [params.id, params.type])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">{error || 'Entity not found'}</div>
      </div>
    )
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <Button onClick={() => loadEntity()}>Refresh</Button>
      </div>
      <EntityDetails 
      data={data} 
      type={params.type as 'consignee' | 'exporter'} 
      onUpdateAction={handleUpdateAction}
    />

    <EntityDocuments 
      entityId={data.id}
      documents={data.documents || []}
      type={params.type as 'consignee' | 'exporter'}
      onUpdateAction={handleUpdateAction}
    />

    <EntityShipments 
      shipments={data.shipments || []}
    />


      
    </div>
  )
}