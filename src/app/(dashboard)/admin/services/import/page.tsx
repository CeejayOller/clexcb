// src/app/(dashboard)/admin/services/import/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Ship, Plane, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/layout/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { USER_ROLES } from '@/types/auth';
import { getResourcePermissions } from '@/lib/utils/permissions';

import NewImportForm from '@/components/import/NewImportForm';
import type { ShipmentListItem } from '@/types/import';
import { getShipmentsAction } from '@/app/actions/import';

interface ShipmentTableProps {
  shipments: ShipmentListItem[];
  isHistorical?: boolean;
  onRowClick: (id: string, isLocked: boolean) => void;
  searchQuery: string;
}

const ImportClearancePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isNewImportOpen, setIsNewImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const permissions = getResourcePermissions(user);

  // Helper function to format dates safely
  const formatDate = (dateString: string | undefined | null, defaultText: string = 'N/A') => {
    if (!dateString) return defaultText;
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : defaultText;
  };

  // Status style helper
  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      CLIENT_DETAILS: 'bg-gray-100 text-gray-800',
      DOCUMENT_COLLECTION: 'bg-yellow-100 text-yellow-800',
      TAX_COMPUTATION: 'bg-purple-100 text-purple-800',
      READY_FOR_E2M: 'bg-blue-100 text-blue-800',
      LODGED_IN_E2M: 'bg-indigo-100 text-indigo-800',
      PAYMENT_COMPLETED: 'bg-emerald-100 text-emerald-800',
      PORT_RELEASE: 'bg-orange-100 text-orange-800',
      IN_TRANSIT: 'bg-cyan-100 text-cyan-800',
      DELIVERED: 'bg-green-100 text-green-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Navigation handler
  const handleRowClick = (id: string, isLocked: boolean) => {
    router.push(`/admin/services/import/${id}?locked=${isLocked}`);
  };

  // Filter shipments based on search query
  const filteredShipments = shipments.filter(shipment => 
    shipment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shipment.blNumber && shipment.blNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (shipment.awbNumber && shipment.awbNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );  

  // Fetch shipments
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getShipmentsAction();
        if (result.success) {
          setShipments(result.data);
        } else {
          setError('Failed to fetch shipments');
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
        setError('An error occurred while fetching shipments');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchShipments();
  }, [isNewImportOpen]);

  const ShipmentTable: React.FC<ShipmentTableProps> = ({ 
    shipments, 
    isHistorical = false,
    onRowClick,
    searchQuery 
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference No.</TableHead>
          <TableHead>Consignee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>{isHistorical ? 'Completion Date' : 'ETA'}</TableHead>
          <TableHead>Document No.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead>Customs Broker</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments
          .filter(s => isHistorical ? s.status === 'DELIVERED' : s.status !== 'DELIVERED')
          .map((shipment) => (
            <TableRow 
              key={shipment.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick(shipment.id, shipment.isLocked || false)}
            >
              <TableCell className="font-medium">{shipment.referenceNumber}</TableCell>
              <TableCell>{shipment.consignee}</TableCell>
              <TableCell>
                {shipment.type === 'sea' ? (
                  <div className="flex items-center">
                    <Ship className="w-4 h-4 mr-1" />
                    SEA
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 mr-1" />
                    AIR
                  </div>
                )}
              </TableCell>
              <TableCell>
                {formatDate(
                  isHistorical ? shipment.completionDate : shipment.eta,
                  'Pending'
                )}
              </TableCell>
              <TableCell>
                {shipment.type === 'sea' ? shipment.blNumber || 'N/A' : shipment.awbNumber || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge 
                  className={`${getStatusStyle(shipment.status)} border-none`}
                  variant="outline"
                >
                  {shipment.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(shipment.lastUpdate, 'Recent')}
              </TableCell>
              <TableCell>
                {shipment.userId === user?.id ? (
                  <Badge variant="outline" className="bg-blue-50">You</Badge>
                ) : (
                  <Badge variant="outline">{shipment.createdBy?.name || 'Unassigned'}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Import Clearance</h1>
        {permissions.canCreate && (
          <Dialog open={isNewImportOpen} onOpenChange={setIsNewImportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <DialogHeader>
                <DialogTitle>Create New Import Clearance</DialogTitle>
              </DialogHeader>
              <NewImportForm onComplete={() => setIsNewImportOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by reference number, consignee, or document number..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="history">Shipment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-4">{error}</div>
              ) : (
                <ShipmentTable 
                  shipments={filteredShipments}
                  onRowClick={handleRowClick}
                  searchQuery={searchQuery}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-4">{error}</div>
              ) : (
                <ShipmentTable 
                  shipments={filteredShipments}
                  isHistorical={true}
                  onRowClick={handleRowClick}
                  searchQuery={searchQuery}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function ImportPage() {
  return (
    <RequireAuth allowedRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]}>
      <ImportClearancePage />
    </RequireAuth>
  );
}