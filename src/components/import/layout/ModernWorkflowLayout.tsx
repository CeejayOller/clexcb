import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical,
  RefreshCcw
} from 'lucide-react';
import type { WorkflowStageStatus, ShipmentData } from '@/types/import/workflow';
import { WORKFLOW_STATES } from '@/lib/constants/workflow-states';

interface ModernWorkflowLayoutProps {
  isLoading: boolean;
  currentStage: keyof typeof WORKFLOW_STATES;
  stageStatus: WorkflowStageStatus;
  shipmentData: ShipmentData;
  children: React.ReactNode;
  onRefresh?: () => void;
}

const ModernWorkflowLayout: React.FC<ModernWorkflowLayoutProps> = ({
  isLoading,
  currentStage,
  stageStatus,
  shipmentData,
  children,
  onRefresh
}) => {
  const StateIcon = WORKFLOW_STATES[currentStage].icon;

  const getStatusColor = (status: WorkflowStageStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'partial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'complete':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Generating reference number...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Import Clearance
            </h1>
            <Badge variant="outline" className="text-sm">
              {shipmentData.referenceNumber}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stage Header */}
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`p-3 rounded-xl ${WORKFLOW_STATES[currentStage].bgColor}`}>
                  <StateIcon className={`w-6 h-6 ${WORKFLOW_STATES[currentStage].color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {WORKFLOW_STATES[currentStage].label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Stage {Object.keys(WORKFLOW_STATES).indexOf(currentStage) + 1} of {Object.keys(WORKFLOW_STATES).length}
                  </p>
                </div>
              </div>
              <Badge 
                variant="secondary"
                className={`${getStatusColor(stageStatus)} px-4 py-1.5 text-sm font-medium capitalize`}
              >
                {stageStatus.replace('_', ' ')}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((Object.keys(WORKFLOW_STATES).indexOf(currentStage) + 1) / 
                      Object.keys(WORKFLOW_STATES).length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModernWorkflowLayout;