// src/components/clients/ClientsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getConsignees, getExporters } from '@/app/actions/clients'
import { useAuth } from '@/components/layout/AuthProvider'
import { USER_ROLES } from '@/types/auth'
import { getResourcePermissions } from '@/lib/utils/permissions'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import type { Consignee, Exporter } from '@prisma/client'

interface ClientsListProps {
  type: 'consignee' | 'exporter'
}

type ExtendedConsignee = Consignee & {
  createdBy: {
    id: string
    name: string
    email: string
  }
  shipments: Array<{
    referenceNumber: string
    status: string
    createdAt: Date
  }>
}

type ExtendedExporter = Exporter & {
  createdBy: {
    id: string
    name: string
    email: string
  }
  shipments: Array<{
    referenceNumber: string
    status: string
    createdAt: Date
  }>
}

export function ClientsList({ type }: ClientsListProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      if (!user) {
        console.log('No user found')
        return
      }
      
      console.log('Current user:', user) // Debug log
      setIsLoading(true)
      
      try {
        const result = type === 'consignee' 
          ? await getConsignees(searchQuery)
          : await getExporters(searchQuery)

        console.log('API response:', result) // Debug log

        if (result.error || !result.data) {
          console.error('Error or no data:', result.error) // Debug log
          setError(result.error || 'No data received')
          setItems([])
          return
        }

        console.log('Fetched items:', result.data) // Debug log
        setItems(result.data)
      } catch (error) {
        console.error('Failed to load items:', error)
        setError('Failed to load items')
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [type, searchQuery, user])
  
    // Action handlers
  const handleView = (id: string) => {
    router.push(`/admin/clients/${type}/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/clients/${type}/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      // TODO: Implement delete functionality with API call
      toast({
        title: 'Success',
        description: `${type} deleted successfully`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      })
    }
  }

  // Get permissions for each item
  const getItemPermissions = (itemUserId: string) => {
    if (!user) return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canCreate: false
    }
  
    // SUPERADMIN can do everything
    if (user.role === 'SUPERADMIN') {
      return {
        canView: true,
        canEdit: true,
        canDelete: true,
        canCreate: true
      }
    }
  
    // BROKER can view all, but only edit/delete their own
    if (user.role === 'BROKER') {
      const isOwn = itemUserId === user.id
      return {
        canView: true,
        canEdit: isOwn,
        canDelete: isOwn,
        canCreate: true
      }
    }
  
    // CLIENT has no access to this page
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canCreate: false
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={`Search ${type}s...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              {type === 'consignee' && <TableHead>TIN</TableHead>}
              <TableHead>Contact Number</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const permissions = getResourcePermissions(user, item.createdBy.id)
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.contactPerson}</TableCell>
                  {type === 'consignee' && 
                    <TableCell>{(item as ExtendedConsignee).tin}</TableCell>
                  }
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>
                    {item.createdBy.id === user?.id ? (
                      <Badge variant="outline" className="bg-blue-50">You</Badge>
                    ) : (
                      <Badge variant="outline">{item.createdBy.name}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.isActive ? "default" : "secondary"}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {permissions.canView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(item.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {permissions.canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {permissions.canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}