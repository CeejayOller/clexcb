// src/components/import/dialogs/ConfirmationDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  type: 'complete' | 'partial';
  missingFields: string[];
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  missingFields
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'complete' ? 'Confirm Stage Completion' : 'Incomplete Details Warning'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {type === 'complete' ? (
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p>Are you sure you want to complete this stage?</p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone for fully completed stages.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-600">Some details are still incomplete</p>
                {missingFields.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                    {missingFields.map((field) => (
                      <li key={field}>Missing {field} information</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  You can proceed, but this stage will be marked as partially complete.
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            variant={type === 'complete' ? 'default' : 'secondary'}
          >
            {type === 'complete' ? 'Confirm' : 'Proceed Anyway'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};