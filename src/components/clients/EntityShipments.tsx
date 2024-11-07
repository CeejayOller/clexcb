// src/components/clients/EntityShipments.tsx
'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EntityShipmentsProps {
  shipments: Array<{
    referenceNumber: string
    status: string
    createdAt: string
  }>
}

export function EntityShipments({ shipments }: EntityShipmentsProps) {
  const router = useRouter()

  const handleViewShipment = (referenceNumber: string) => {
    router.push(`/admin/services/import/${referenceNumber}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No shipments found
            </TableCell>
          </TableRow>
        ) : (
          shipments.map((shipment) => (
            <TableRow key={shipment.referenceNumber}>
              <TableCell className="font-medium">
                {shipment.referenceNumber}
              </TableCell>
              <TableCell>
                {new Date(shipment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{shipment.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewShipment(shipment.referenceNumber)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}