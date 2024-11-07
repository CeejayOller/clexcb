// src/components/import/StatementOfFacts.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Plus, Upload, FileText, Download, Trash2 } from 'lucide-react';
import type { ShipmentData, StatementOfFactEvent } from '@/types/import/workflow';

interface StatementOfFactsProps {
  data: ShipmentData;
  onUpdate: (updates: Partial<ShipmentData>) => void;
  currentUser: {
    id: string;
    name: string;
  };
}

export const StatementOfFacts: React.FC<StatementOfFactsProps> = ({
  data,
  onUpdate,
  currentUser
}) => {
  const [isAddingEvent, setIsAddingEvent] = React.useState(false);
  const [formData, setFormData] = React.useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    description: '',
    documents: [] as File[]
  });

  // Ensure statementOfFacts exists with a default empty array
  const events = data.statementOfFacts || [];

  const handleAddEvent = () => {
    const timestamp = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    const newEvent: StatementOfFactEvent = {
      id: Math.random().toString(),
      timestamp,
      description: formData.description,
      createdBy: currentUser,
      documents: formData.documents.map(file => ({
        id: Math.random().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }))
    };

    onUpdate({
      statementOfFacts: [...events, newEvent]
    });

    setIsAddingEvent(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      description: '',
      documents: []
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    onUpdate({
      statementOfFacts: events.filter(event => event.id !== eventId)
    });
  };

  const handleExportPDF = async () => {
    // TODO: Implement PDF export
    console.log('Exporting PDF...');
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Statement of Facts</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => setIsAddingEvent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Event Description</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No events recorded
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.createdBy.name}</TableCell>
                  <TableCell>
                    {event.documents?.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        {doc.name}
                      </a>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      time: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Documents</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    documents: Array.from(e.target.files || [])
                  }))}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddEvent}
                disabled={!formData.description.trim()}
              >
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};