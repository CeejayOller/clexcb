// src/types/import/state.ts
import type { ImportTransactionType } from '@/lib/utils/reference-number';
import type { WORKFLOW_STATES } from '@/lib/constants/workflow-states';

export interface ImportWorkflowState {
  currentState: keyof typeof WORKFLOW_STATES;
  showConfirmDialog: boolean;
  showUploadDialog: boolean;
  selectedDocument: string | null;
  isLoading: boolean;
  freightType: ImportTransactionType;
  confirmationType: 'complete' | 'partial';
  missingFields: string[];
}