// src/components/clients/ClientsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Eye, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getConsignees, getExporters } from '@/app/actions/clients'
import type { Consignee, Exporter } from '@prisma/client'
import { useAuth } from '@/components/layout/AuthProvider'
import { USER_ROLES } from '@/types/auth'
import { getResourcePermissions } from '@/lib/utils/permissions'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface ClientsListProps {
  type: 'consignee' | 'exporter'
}

type ConsigneeWithRelations = Consignee & {
    shipments: Array<{
      referenceNumber: string;
      status: string;
      createdAt: Date;
    }>;
  }
  
type ExporterWithRelations = Exporter & {
    shipments: Array<{
      referenceNumber: string;
      status: string;
      createdAt: Date;
    }>;
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
        if (!user) return
        setIsLoading(true)
        
        try {
          const result = type === 'consignee' 
            ? await getConsignees(searchQuery)
            : await getExporters(searchQuery)
    
          if (result.error || !result.data) {
            setError(result.error || 'No data received')
            setItems([])
            return
          }
    
          // Filter items based on user role
          const filteredItems = user.role === USER_ROLES.SUPERADMIN
            ? result.data
            : result.data.filter(item => item.userId === user.id)
    
          setItems(filteredItems)
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
    return getResourcePermissions(user, itemUserId)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
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
  
        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="border rounded-md">
            <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            {type === 'consignee' && <TableHead>TIN</TableHead>}
            <TableHead>Contact Number</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={type === 'consignee' ? 6 : 5}
                className="text-center"
              >
                No {type}s found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const permissions = getItemPermissions(item.userId)
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.contactPerson}</TableCell>
                  {type === 'consignee' && 
                    <TableCell>{item.tin}</TableCell>
                  }
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>
                    {item.userId === user?.id ? (
                      <Badge variant="outline" className="bg-blue-50">You</Badge>
                    ) : (
                      <Badge variant="outline">{item.createdBy?.name || 'Unknown'}</Badge>
                    )}
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
            })
          )}
        </TableBody>
      </Table>
    </div>
        )}
      </div>
    )
  }