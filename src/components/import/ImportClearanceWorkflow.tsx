// src/components/import/ImportClearanceWorkflow.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

import { uploadDocument, updateShipment } from '@/lib/db/import';
import { WORKFLOW_STATES, REQUIRED_DOCUMENTS } from '@/lib/constants/workflow-states';
import type { DocumentData, DocumentStatus, ShipmentData, WorkflowStageStatus } from '@/types/import/workflow';
import type { ImportTransactionType } from '@/lib/utils/reference-number';
import { createShipmentAction, processDocumentUploadAction, updateShipmentDetailsAction } from '@/app/actions/import';
import { CardLayout } from './cards/CardLayout';
import { StatementOfFacts } from './StatementOfFacts';
import { ConfirmationDialog } from './dialogs/ConfirmationDialog';
import type { ImportWorkflowState } from '@/types/import/state';
import ModernWorkflowLayout from './layout/ModernWorkflowLayout';
import ClientDetailsForm from './forms/ClientDetailsForm';
import WorkflowEditDialog from './dialogs/WorkflowEditDialog';
import { useAuth } from '@/components/layout/AuthProvider';
import { checkUserPermissions } from '@/app/actions/auth'


// State interfaces for the component
interface ImportClearanceWorkflowProps {
  initialData?: ShipmentData;
}

interface WorkflowState {
  currentState: keyof typeof WORKFLOW_STATES;
  showConfirmDialog: boolean;
  showUploadDialog: boolean;
  selectedDocument: string | null;
  isLoading: boolean;
  freightType: ImportTransactionType;
}

interface EditableCardProps {
  title: string;
  onEdit: () => void;
  className?: string;
  children: React.ReactNode;
}



export default function ImportClearanceWorkflow({ initialData }: ImportClearanceWorkflowProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Consolidate all useState hooks at the top
  const [hasPermission, setHasPermission] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSection, setEditSection] = useState<string>('');
  const [state, setState] = useState<ImportWorkflowState>({
    currentState: (initialData?.status as keyof typeof WORKFLOW_STATES) || 'CLIENT_DETAILS',
    showConfirmDialog: false,
    showUploadDialog: false,
    selectedDocument: null,
    isLoading: !initialData,
    freightType: (initialData?.shipmentDetails?.bl_number ? 'IMS' : 'IMA') as ImportTransactionType,
    confirmationType: 'complete',
    missingFields: []
  });
  
    // Move the edit dialog state up
    const [editDialog, setEditDialog] = useState<{
      isOpen: boolean;
      section: string;
    }>({
      isOpen: false,
      section: '',
    });

    const [shipmentData, setShipmentData] = useState<ShipmentData>(initialData || {
      id: '',
      referenceNumber: '',
      status: 'CLIENT_DETAILS',
      consignee: null,
      exporter: {
        name: '',
        address: ''
      },
      shipmentDetails: {
        bl_number: '',
        vessel_name: '',
        flight_number: '',
        registry_number: '',
        voyage_number: '',
        container_number: '',
        port_of_origin: '',
        port_of_discharge: '',
        eta: '',
        ata: '',
        description_of_goods: '',
        volume: ''
      },
      documents: [],
      timeline: [],
      notes: [],
      cargo: [],
      statementOfFacts: [],
      computations: null
    });

  // 3. Effects
  // Generate reference number on mount
  useEffect(() => {
    if (!shipmentData.referenceNumber) {
      generateReferenceNumber();
    }
  }, []);

  useEffect(() => {
    async function checkPermission() {
      if (!user?.id || !initialData?.id) return
      
      const canAccess = await checkUserPermissions(user.id, initialData.id)
      setHasPermission(canAccess)
    }
    
    checkPermission()
  }, [user, initialData])

    // Reference number generation
    const generateReferenceNumber = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const response = await fetch('/api/admin/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shipmentType: state.freightType,
            formData: {
              consignee: {},
              exporter: {},
              shipmentDetails: {},
              documents: REQUIRED_DOCUMENTS.map(doc => ({
                name: doc.name,
                status: 'not_uploaded',
                isVerified: false,
                isRequired: doc.isRequired
              }))
            }
          }),
        });
  
        if (!response.ok) throw new Error('Failed to create shipment');
  
        const data = await response.json();
        setShipmentData(data);
      } catch (error) {
        console.error('Error creating shipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to create shipment',
          variant: 'destructive',
        });
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
  
    // function to update shipment
    const updateShipmentData = async (updates: Partial<ShipmentData>) => {
      try {
        if (!shipmentData?.id) return;
  
        const response = await fetch(`/api/admin/import/${shipmentData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...updates,
            currentStage: state.currentState,
          }),
        });
  
        if (!response.ok) throw new Error('Failed to update shipment');
  
        const updatedShipment = await response.json();
        setShipmentData(updatedShipment);
        
        toast({
          title: 'Success',
          description: 'Shipment updated successfully',
        });
      } catch (error) {
        console.error('Error updating shipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to update shipment',
          variant: 'destructive',
        });
      }
    };

      // Freight type handler
  const handleFreightTypeChange = (freightType: ImportTransactionType) => {
    setState(prev => ({ ...prev, freightType }));
    generateReferenceNumber();
  };

    // Stage status helper
  const getStageStatus = (stage: keyof typeof WORKFLOW_STATES): WorkflowStageStatus => {
    const states = Object.keys(WORKFLOW_STATES);
    const currentIndex = states.indexOf(state.currentState);
    const stageIndex = states.indexOf(stage);
    
    const timeline = shipmentData.timeline.find(t => t.stage === stage);
    
    // If we have a timeline entry, use its status
    if (timeline) {
      return timeline.status;
    }
    
    // If no timeline entry, determine based on position
    if (stageIndex === currentIndex) {
      return 'in_progress';
    } else if (stageIndex < currentIndex) {
      return 'partial'; // You might want to add logic to determine if it should be 'complete'
    } else {
      return 'pending';
    }
  };

    // Stage completion handler to use API
  const handleStageCompletion = async () => {
    try {
      await updateShipment(shipmentData.id, {
        timeline: [
          ...shipmentData.timeline,
          {
            stage: state.currentState,
            status: 'complete' as WorkflowStageStatus,
            timestamp: new Date().toISOString()
          }
        ]
      });
  
      const states = Object.keys(WORKFLOW_STATES);
      const currentIndex = states.indexOf(state.currentState);
      if (currentIndex < states.length - 1) {
        setState(prev => ({
          ...prev,
          currentState: states[currentIndex + 1] as keyof typeof WORKFLOW_STATES,
          showConfirmDialog: false
        }));
      }
    } catch (error) {
      console.error('Error completing stage:', error);
    }
  };

  const handleUpdate = async (updates: Partial<ShipmentData>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      setShipmentData(prevData => ({
        ...prevData,
        ...updates,
      }));
      
      const result = await updateShipmentDetailsAction(shipmentData.id, updates);
      
      if (!result.success) {
        throw new Error(result.error);
      }
  
      toast({
        title: 'Success',
        description: 'Shipment details updated successfully',
      });
      
      setEditDialog({
        isOpen: false,
        section: '',
      });
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update shipment',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // function to handle opening the edit dialog
  const handleEdit = (section: string) => {
    setEditSection(section);
    setIsEditDialogOpen(true);
  };

  // function to handle updates from the dialog
  const handleDialogUpdate = async (updates: Partial<ShipmentData>) => {
    try {
      await updateShipmentData(updates);
      setShipmentData(prev => ({
        ...prev,
        ...updates
      }));
      toast({
        title: 'Success',
        description: 'Successfully updated shipment details'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update shipment details',
        variant: 'destructive'
      });
    }
  };

  // Document Upload Handler
  const handleDocumentUpload = async (file: File, documentType: string) => {
    try {
      if (!shipmentData?.id) return;
  
      const result = await processDocumentUploadAction(
        shipmentData.id,
        documentType,
        file
      );
  
      if (result.success) {
        // Update the documents in your state
        const updatedDocuments = shipmentData.documents.map(doc => {
          if (doc.name === documentType) {
            return {
              ...doc,
              status: result.status,
              files: [...(doc.files || []), result.fileUrl]
            };
          }
          return doc;
        });
  
        setShipmentData(prev => ({
          ...prev,
          documents: updatedDocuments
        }));
  
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
        });
  
        // Close the upload dialog
        setState(prev => ({
          ...prev,
          showUploadDialog: false,
          selectedDocument: null
        }));
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    }
  };  

  // Protect the component
  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this shipment.</p>
        </div>
      </div>
    )
  }


  // 4. Header Component
const ShipmentHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {shipmentData.referenceNumber || 'Loading...'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={state.freightType === 'IMS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFreightTypeChange('IMS')}
            disabled={!!shipmentData.referenceNumber}
          >
            Sea Freight
          </Button>
          <Button
            variant={state.freightType === 'IMA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFreightTypeChange('IMA')}
            disabled={!!shipmentData.referenceNumber}
          >
            Air Freight
          </Button>
        </div>
      </div>
    </div>
  );
};





// 6. Timeline Component
const WorkflowTimeline: React.FC = () => {
  const states = Object.entries(WORKFLOW_STATES);
  const currentIndex = states.findIndex(([key]) => key === state.currentState);

  return (
    <div className="relative mt-8">
      <div className="absolute left-0 w-full h-1 bg-gray-200 top-5" />
      <div className="relative flex justify-between">
        {states.map(([key, stageInfo], index) => {
          const StateIcon = stageInfo.icon;
          const isActive = index <= currentIndex;
          const isCurrent = key === state.currentState;
          const stageStatus = getStageStatus(key as keyof typeof WORKFLOW_STATES);
          
          const getIconColor = () => {
            if (!isActive) return 'bg-gray-200 text-gray-400';
            if (stageStatus === 'complete') return `${stageInfo.bgColor} ${stageInfo.color}`;
            if (stageStatus === 'partial') return 'bg-yellow-100 text-yellow-500';
            return `${stageInfo.bgColor} ${stageInfo.color}`;
          };

          return (
            <div key={key} className="flex flex-col items-center relative group">
              <div
                className={`z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${getIconColor()}
                  ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              >
                <StateIcon className="w-5 h-5" />
              </div>
              <span className={`mt-2 text-sm font-medium 
                ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {stageInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};



const DocumentUploadDialog: React.FC = () => {
  const [uploadType, setUploadType] = useState<'draft' | 'final'>('draft');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !state.selectedDocument) return;
    
    await handleDocumentUpload(file, state.selectedDocument);
    setState(prev => ({ ...prev, showUploadDialog: false, selectedDocument: null }));
    setFile(null);
  };

  return (
    <Dialog 
      open={state.showUploadDialog} 
      onOpenChange={(open) => setState(prev => ({ ...prev, showUploadDialog: open }))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Document Type</h4>
            <p className="text-sm text-gray-500">{state.selectedDocument}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Document Status</h4>
            <div className="flex gap-4">
              <Button
                variant={uploadType === 'draft' ? 'default' : 'outline'}
                onClick={() => setUploadType('draft')}
              >
                Draft
              </Button>
              <Button
                variant={uploadType === 'final' ? 'default' : 'outline'}
                onClick={() => setUploadType('final')}
              >
                Final
              </Button>
            </div>
          </div>
          <div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setState(prev => ({ ...prev, showUploadDialog: false }))}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const checkClientDetails = () => {
  const requiredFields = {
    consignee: Boolean(shipmentData.consignee?.name && shipmentData.consignee?.address),
    exporter: Boolean(shipmentData.exporter.name && shipmentData.exporter.address),
    shipmentDetails: Boolean(
      shipmentData.shipmentDetails.port_of_origin &&
      shipmentData.shipmentDetails.port_of_discharge &&
      (state.freightType === 'IMS' 
        ? shipmentData.shipmentDetails.bl_number
        : shipmentData.shipmentDetails.flight_number)
    )
  };

  return {
    isComplete: Object.values(requiredFields).every(Boolean),
    missingFields: Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
  };
};


// 8. Main Render Function
return (
  <ModernWorkflowLayout
    isLoading={state.isLoading}
    currentStage={state.currentState}
    stageStatus={getStageStatus(state.currentState)}
    shipmentData={shipmentData}
    onRefresh={() => window.location.reload()}
  >
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{WORKFLOW_STATES[state.currentState].label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        {state.currentState === 'CLIENT_DETAILS' && (
  
  <ClientDetailsForm
    data={shipmentData}
    freightType={state.freightType === 'IMS' ? 'sea' : 'air'} // Add this prop
    onEdit={handleEdit}
    onConfirm={() => {
      const { isComplete, missingFields } = checkClientDetails();
      setState(prev => ({ 
        ...prev, 
        showConfirmDialog: true,
        confirmationType: isComplete ? 'complete' : 'partial',
        missingFields
      }));
    }}
    isCompleteCheck={checkClientDetails}
  />
)}
          
          {state.currentState === 'DOCUMENT_COLLECTION' && (
            <div className="space-y-4">
              {shipmentData.documents.map((doc) => (
                <div 
                  key={doc.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'not_uploaded' ? 'bg-gray-400' :
                      doc.status === 'draft' ? 'bg-yellow-400' :
                      doc.isVerified ? 'bg-green-400' : 'bg-orange-400'
                    }`} />
                    <span>{doc.name}</span>
                    {doc.isRequired && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>
                  {doc.status === 'not_uploaded' ? (
                    <Button
                      size="sm"
                      onClick={() => setState(prev => ({
                        ...prev,
                        showUploadDialog: true,
                        selectedDocument: doc.name
                      }))}
                    >
                      Upload
                    </Button>
                  ) : !doc.isVerified ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {/* Handle verification */}}
                    >
                      Verify
                    </Button>
                  ) : (
                    <span className="text-green-500 text-sm">Verified</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Statement of Facts */}
    <StatementOfFacts 
      data={shipmentData} 
      onUpdate={updateShipmentData}
      currentUser={{ 
        id: '1',
        name: 'John Doe'
      }}
    />

    <ConfirmationDialog 
      isOpen={state.showConfirmDialog}
      onClose={() => setState(prev => ({ ...prev, showConfirmDialog: false }))}
      onConfirm={handleStageCompletion}
      type={state.confirmationType as 'complete' | 'partial'}
      missingFields={state.missingFields || []}
    />
{user && (
<WorkflowEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        data={shipmentData}
        section={editSection}
        onUpdate={handleDialogUpdate}
        freightType={state.freightType === 'IMS' ? 'sea' : 'air'}
        currentUser={user}
      />
    )}

    <DocumentUploadDialog />
  </ModernWorkflowLayout>
);
};

