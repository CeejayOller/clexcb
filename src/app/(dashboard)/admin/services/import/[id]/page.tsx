// src/app/(dashboard)/admin/services/import/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getShipmentByIdAction } from '@/app/actions/import'
import ImportClearanceWorkflow from '@/components/import/ImportClearanceWorkflow'
import { Loader2 } from 'lucide-react'
import type { ShipmentData } from '@/types/import/workflow'

export default function ShipmentWorkflowPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadShipment = async () => {
      if (!params.id) return
      
      try {
        const data = await getShipmentByIdAction(params.id as string)
        if (!data) {
          setError('Shipment not found')
        } else {
          setShipmentData(data)
        }
      } catch (error) {
        console.error('Error loading shipment:', error)
        setError('Failed to load shipment')
      } finally {
        setIsLoading(false)
      }
    }

    loadShipment()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !shipmentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">{error}</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  return <ImportClearanceWorkflow initialData={shipmentData} />
}