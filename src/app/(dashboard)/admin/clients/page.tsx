// src/app/(dashboard)/admin/clients/page.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { ConsigneeForm } from '@/components/clients/ConsigneeForm'
import { ExporterForm } from '@/components/clients/ExporterForm'
import { ClientsList } from '@/components/clients/ClientsList'
import { useToast } from '@/components/ui/use-toast'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/layout/AuthProvider'
import { USER_ROLES } from '@/types/auth'
import { getResourcePermissions } from '@/lib/utils/permissions'

export default function ClientsPage() {
    const [activeTab, setActiveTab] = useState('consignees')
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
    const { toast } = useToast()
    const { user } = useAuth()
    
    const permissions = getResourcePermissions(user)
  
    const handleFormComplete = async () => {
        setIsNewDialogOpen(false)
        toast({
          title: 'Success',
          description: `New ${activeTab === 'consignees' ? 'consignee' : 'exporter'} created successfully`,
        })
      }

    const handleCloseAction = async () => {
        setIsNewDialogOpen(false)
        return Promise.resolve()
    }

    const baseContent = (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Client Management</h1>
                {permissions.canCreate && (
                    <Button onClick={() => setIsNewDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New {activeTab === 'consignees' ? 'Consignee' : 'Exporter'}
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="consignees">Consignees</TabsTrigger>
                    <TabsTrigger value="exporters">Exporters</TabsTrigger>
                </TabsList>

                <TabsContent value="consignees">
                    <Card>
                        <CardHeader>
                            <CardTitle>Consignees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ClientsList type="consignee" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="exporters">
                    <Card>
                        <CardHeader>
                            <CardTitle>Exporters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ClientsList type="exporter" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
                {activeTab === 'consignees' ? (
                    <ConsigneeForm 
                        onSuccessAction={handleFormComplete} 
                        onCloseAction={handleCloseAction}
                    />
                ) : (
                    <ExporterForm 
                        onSuccessAction={handleFormComplete}
                        onCloseAction={handleCloseAction}
                    />
                )}
            </Dialog>
        </div>
    )

    return (
        <RequireAuth allowedRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]}>
            {baseContent}
        </RequireAuth>
    )
}