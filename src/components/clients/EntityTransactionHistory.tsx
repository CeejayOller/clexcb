// src/components/clients/EntityTransactionHistory.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

interface EntityTransaction {
  id: string
  action: 'created' | 'updated' | 'deactivated'
  changeLog: any
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface EntityTransactionHistoryProps {
  transactions: EntityTransaction[]
  entityType: 'consignee' | 'exporter'
}

export function EntityTransactionHistory({
  transactions,
  entityType
}: EntityTransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<EntityTransaction | null>(null)
  const itemsPerPage = 10
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'updated':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'deactivated':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatChangeLog = (log: any) => {
    if (!log) return 'No changes recorded'
    
    if (log.initialData) {
      return 'Initial creation'
    }

    if (log.deactivatedAt) {
      return `Deactivated by ${log.deactivatedBy}`
    }

    if (log.before && log.after) {
      const changes = []
      for (const [key, newValue] of Object.entries(log.after)) {
        const oldValue = log.before[key]
        if (oldValue !== newValue) {
          changes.push(`${key}: ${oldValue} → ${newValue}`)
        }
      }
      return changes.join(', ') || 'No field changes'
    }

    return JSON.stringify(log)
  }

  const renderDetailedChanges = (transaction: EntityTransaction) => {
    const { changeLog } = transaction

    if (changeLog.initialData) {
      return (
        <div className="space-y-4">
          <h3 className="font-medium">Initial Data:</h3>
          {Object.entries(changeLog.initialData).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-4 border-b pb-2">
              <span className="font-medium">{key}</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )
    }

    if (changeLog.before && changeLog.after) {
      return (
        <div className="space-y-4">
          {Object.entries(changeLog.after).map(([key, newValue]) => {
            const oldValue = changeLog.before[key]
            if (oldValue !== newValue) {
              return (
                <div key={key} className="grid grid-cols-2 gap-4 border-b pb-2">
                  <div>
                    <p className="font-medium">{key}</p>
                    <div className="mt-1 text-sm">
                      <p className="text-red-600 line-through">{String(oldValue)}</p>
                      <p className="text-green-600">{String(newValue)}</p>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }

    return <pre className="whitespace-pre-wrap">{JSON.stringify(changeLog, null, 2)}</pre>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Modified By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={5} 
                      className="text-center text-muted-foreground"
                    >
                      No transaction history found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getActionBadgeStyle(transaction.action)}
                        >
                          {transaction.action.charAt(0).toUpperCase() + 
                           transaction.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {formatChangeLog(transaction.changeLog)}
                      </TableCell>
                      <TableCell>
                        {transaction.createdBy.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Changes Dialog */}
      <Dialog 
        open={!!selectedTransaction} 
        onOpenChange={() => setSelectedTransaction(null)}
        >
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>
                Transaction Details - {selectedTransaction && 
                (selectedTransaction.action.charAt(0).toUpperCase() + 
                selectedTransaction.action.slice(1))}
            </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                    {selectedTransaction && format(new Date(selectedTransaction.createdAt), 
                    'MMM dd, yyyy HH:mm:ss')}
                </p>
                </div>
                <div>
                <p className="text-sm text-muted-foreground">Modified By</p>
                <p className="font-medium">
                    {selectedTransaction?.createdBy?.name || 'Unknown'}
                </p>
                </div>
            </div>
            <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Changes</p>
                {selectedTransaction && renderDetailedChanges(selectedTransaction)}
            </div>
            </div>
        </DialogContent>
        </Dialog>
    </>
  )
}