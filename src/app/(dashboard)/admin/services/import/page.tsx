// src/app/(dashboard)/admin/services/import/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isValid } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileText, Ship, Plane } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { USER_ROLES } from "@/types/auth";
import { getResourcePermissions } from "@/lib/utils/permissions";

import NewImportForm from "@/components/import/NewImportForm";
import type { ShipmentListItem } from "@/types/import";
import { getShipmentsAction } from "@/app/actions/import";

interface ShipmentTableProps {
  shipments: ShipmentListItem[];
  isHistorical?: boolean;
  userPermissions: any;
}

const ImportClearancePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isNewImportOpen, setIsNewImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentListItem[]>([]);

  const permissions = getResourcePermissions(user);

  // Helper function to format dates safely
  const formatDate = (
    dateString: string | undefined | null,
    defaultText: string = "N/A"
  ) => {
    if (!dateString) return defaultText;
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : defaultText;
  };

  // Status style helper
  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      DOCUMENT_COLLECTION:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
      TAX_COMPUTATION: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
      READY_FOR_E2M: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      LODGED_IN_E2M: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80",
      PAYMENT_COMPLETED:
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
      PORT_RELEASE: "bg-orange-100 text-orange-800 hover:bg-orange-100/80",
      IN_TRANSIT: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80",
      DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100/80",
    };
    return styles[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  };

  // Navigation handler
  const handleViewShipment = (id: string, isLocked: boolean) => {
    router.push(`/admin/services/import/${id}?locked=${isLocked}`);
  };

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
          setError("Failed to fetch shipments");
        }
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setError("An error occurred while fetching shipments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [isNewImportOpen]);

  const ShipmentTable: React.FC<ShipmentTableProps> = ({
    shipments,
    isHistorical = false,
    userPermissions,
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference No.</TableHead>
          <TableHead>Consignee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>{isHistorical ? "Completion Date" : "ETA"}</TableHead>
          <TableHead>Document No.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments
          .filter((s: ShipmentListItem) =>
            isHistorical ? s.status === "DELIVERED" : s.status !== "DELIVERED"
          )
          .map((shipment) => {
            const itemPermissions = getResourcePermissions(
              user,
              shipment.userId
            );

            return (
              (<TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  {shipment.referenceNumber}
                </TableCell>
                <TableCell>{shipment.consignee}</TableCell>
                <TableCell>
                  {shipment.type === "sea" ? (
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
                    "Pending"
                  )}
                </TableCell>
                <TableCell>
                  {shipment.type === "sea"
                    ? shipment.blNumber || "N/A"
                    : shipment.awbNumber || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusStyle(shipment.status)} border-none`}
                    variant="outline"
                  >
                    {shipment.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(shipment.lastUpdate, "Recent")}
                </TableCell>
                <TableCell>
                  {shipment.userId === user?.id ? (
                    <Badge variant="outline" className="bg-blue-50">
                      You
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {shipment.createdBy?.name || "Unknown"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {itemPermissions.canView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleViewShipment(
                            shipment.id,
                            shipment.isLocked || false
                          )
                        }
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                    {shipment.isLocked && (
                      <Badge variant="secondary">Locked</Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>)
            );
          })}
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
                <div>Loading...</div>
              ) : (
                <ShipmentTable
                  shipments={shipments}
                  userPermissions={permissions}
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
                <div>Loading...</div>
              ) : (
                <ShipmentTable
                  shipments={shipments}
                  isHistorical={true}
                  userPermissions={permissions}
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
