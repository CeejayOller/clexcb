// app/actions/clients.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import type { Session } from '@/types/auth'

// Response type
interface ActionResponse<T> {
    success?: boolean
    error?: string
    data?: T
  }
  
  // Type for returned Document data
  interface DocumentData {
    id: string
    name: string
    fileUrl: string
    uploadedAt: string
  }
  
  // Type for returned Shipment data
  interface ShipmentData {
    referenceNumber: string
    status: string
    createdAt: string
  }
  
  // Base data type that includes common fields
  interface BaseEntityData {
    id: string
    name: string
    businessAddress: string
    contactPerson: string
    contactNumber: string
    email: string
    isActive: boolean
    documents: DocumentData[]
    shipments: ShipmentData[]
  }
  
  // Specific entity types
export interface ConsigneeData extends BaseEntityData {
    registeredName: string
    tin: string
    brn: string
  }
  
export interface ExporterData extends BaseEntityData {}

export type ConsigneeFormData = {
  name: string
  registeredName: string
  businessAddress: string
  tin: string
  brn: string
  contactPerson: string
  contactNumber: string
  email: string
}

export type ConsigneeDocumentData = {
  name: string
  fileUrl: string
}

export type ExporterFormData = {
  name: string
  businessAddress: string
  contactPerson: string
  email: string
  contactNumber: string
}

export async function handleConsigneeSuccessAction() {
    revalidatePath('/admin/clients')
  }
  
export async function handleExporterSuccessAction() {
    revalidatePath('/admin/clients')
  }

export async function handleDialogCloseAction() {
    'use server'
    // This is just a placeholder action to satisfy the type system
    return Promise.resolve()
  }
  
export async function handleEntityUpdateAction() {
    'use server'
    revalidatePath('/admin/clients/[type]/[id]')
  }

export async function createConsignee(data: ConsigneeFormData) {
    try {
      const session = await getServerSession() as Session | null;
      if (!session?.user) {
        throw new Error('Unauthorized');
      }
  
      const existingConsignee = await prisma.consignee.findFirst({
        where: {
          OR: [
            { tin: data.tin },
            { name: data.name }
          ],
          createdBy: {  // This references the User relation in your schema
            id: session.user.id
          }
        }
      })
  
      if (existingConsignee) {
        return {
          error: 'A consignee with this TIN or name already exists'
        }
      }
  
      const consignee = await prisma.consignee.create({
        data: {
          ...data,
          createdBy: {  // This is how we connect to the User model
            connect: {
              id: session.user.id
            }
          }
        }
      })
  
      revalidatePath('/admin/clients')
      return { success: true, data: consignee }
    } catch (error) {
      console.error('Error creating consignee:', error)
      return { error: 'Failed to create consignee' }
    }
  }
  
export async function createExporter(data: ExporterFormData) {
    try {
      const session = await getServerSession() as Session | null;
      if (!session?.user) {
        throw new Error('Unauthorized');
      }
  
      const existingExporter = await prisma.exporter.findFirst({
        where: {
          OR: [
            { email: data.email },
            { name: data.name }
          ],
          createdBy: {  // This references the User relation in your schema
            id: session.user.id
          }
        }
      })
  
      if (existingExporter) {
        return {
          error: 'An exporter with this email or name already exists'
        }
      }
  
      const exporter = await prisma.exporter.create({
        data: {
          ...data,
          createdBy: {  // This is how we connect to the User model
            connect: {
              id: session.user.id
            }
          }
        }
      })
  
      revalidatePath('/admin/clients')
      return { success: true, data: exporter }
    } catch (error) {
      console.error('Error creating exporter:', error)
      return { error: 'Failed to create exporter' }
    }
  }
  
  export async function getConsignees(query?: string) {
    try {
      const session = await getServerSession() as Session | null;
      if (!session?.user) {
        throw new Error('Unauthorized');
      }
  
      const consignees = await prisma.consignee.findMany({
        where: query ? {
          AND: [
            {
              OR: [
                { name: { contains: query } },
                { tin: { contains: query } }
              ]
            },
            {
              createdBy: {  // Reference the User relation
                id: session.user.id
              }
            }
          ]
        } : {
          createdBy: {
            id: session.user.id
          }
        },
        orderBy: { name: 'asc' },
        include: {
          documents: true,
          shipments: {
            select: {
              referenceNumber: true,
              status: true,
              createdAt: true
            }
          }
        }
      })
  
      return { success: true, data: consignees }
    } catch (error) {
      console.error('Error fetching consignees:', error)
      return { error: 'Failed to fetch consignees' }
    }
  }
  
  export async function getExporters(query?: string) {
    try {
      const session = await getServerSession() as Session | null;
      if (!session?.user) {
        throw new Error('Unauthorized');
      }
  
      const exporter = await prisma.exporter.findMany({
        where: query ? {
          AND: [
            {
              OR: [
                { name: { contains: query } },
                { email: { contains: query } }
              ]
            },
            {
              createdBy: {  // Reference the User relation
                id: session.user.id
              }
            }
          ]
        } : {
          createdBy: {
            id: session.user.id
          }
        },
        orderBy: { name: 'asc' },
        include: {
            shipments: {
            select: {
              referenceNumber: true,
              status: true,
              createdAt: true
            }
          }
        }
      })
  
      return { success: true, data: exporter }
    } catch (error) {
      console.error('Error fetching exporter:', error)
      return { error: 'Failed to fetch exporter' }
    }
  }

export async function updateConsignee(id: string, data: Partial<ConsigneeFormData>) {
    try {
      const updatedConsignee = await prisma.consignee.update({
        where: { id },
        data: {
          name: data.name,
          registeredName: data.registeredName,
          businessAddress: data.businessAddress,
          tin: data.tin,
          brn: data.brn,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          email: data.email,
          updatedAt: new Date()
        }
      })
  
      revalidatePath('/admin/clients')
      return { success: true, data: updatedConsignee }
    } catch (error) {
      console.error('Error updating consignee:', error)
      return { error: 'Failed to update consignee' }
    }
  }
  
  export async function updateExporter(id: string, data: Partial<ExporterFormData>) {
    try {
      const updatedExporter = await prisma.exporter.update({
        where: { id },
        data: {
          name: data.name,
          businessAddress: data.businessAddress,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          email: data.email,
          updatedAt: new Date()
        }
      })
  
      revalidatePath('/admin/clients')
      return { success: true, data: updatedExporter }
    } catch (error) {
      console.error('Error updating exporter:', error)
      return { error: 'Failed to update exporter' }
    }
  }

export async function addConsigneeDocument(
  consigneeId: string, 
  document: ConsigneeDocumentData
) {
  try {
    const doc = await prisma.consigneeDocument.create({
      data: {
        consigneeId,
        name: document.name,
        fileUrl: document.fileUrl,
      }
    })

    revalidatePath('/admin/clients')
    return { success: true, data: doc }
  } catch (error) {
    console.error('Error adding consignee document:', error)
    return { error: 'Failed to add document' }
  }
}

export async function getConsigneeById(id: string): Promise<ActionResponse<ConsigneeData>> {
    try {
      const consignee = await prisma.consignee.findUnique({
        where: { id },
        include: {
          documents: true,
          shipments: {
            select: {
              referenceNumber: true,
              status: true,
              createdAt: true
            }
          }
        }
      })
  
      if (!consignee) {
        return { error: 'Consignee not found' }
      }
  
      // Transform the data to match our interface
      const data: ConsigneeData = {
        id: consignee.id,
        name: consignee.name,
        registeredName: consignee.registeredName,
        businessAddress: consignee.businessAddress,
        tin: consignee.tin,
        brn: consignee.brn,
        contactPerson: consignee.contactPerson,
        contactNumber: consignee.contactNumber,
        email: consignee.email,
        isActive: consignee.isActive,
        documents: consignee.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          fileUrl: doc.fileUrl,
          uploadedAt: doc.uploadedAt.toISOString()
        })),
        shipments: consignee.shipments.map(ship => ({
          referenceNumber: ship.referenceNumber,
          status: ship.status,
          createdAt: ship.createdAt.toISOString()
        }))
      }
  
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching consignee:', error)
      return { error: 'Failed to fetch consignee' }
    }
  }
  
export async function getExporterById(id: string): Promise<ActionResponse<ExporterData>> {
    try {
      const exporter = await prisma.exporter.findUnique({
        where: { id },
        include: {
          shipments: {
            select: {
              referenceNumber: true,
              status: true,
              createdAt: true
            }
          }
        }
      })
  
      if (!exporter) {
        return { error: 'Exporter not found' }
      }
  
      // Transform the data to match our interface
      const data: ExporterData = {
        id: exporter.id,
        name: exporter.name,
        businessAddress: exporter.businessAddress,
        contactPerson: exporter.contactPerson,
        contactNumber: exporter.contactNumber,
        email: exporter.email,
        isActive: exporter.isActive,
        documents: [], // Exporters don't have documents in the schema
        shipments: exporter.shipments.map(ship => ({
          referenceNumber: ship.referenceNumber,
          status: ship.status,
          createdAt: ship.createdAt.toISOString()
        }))
      }
  
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching exporter:', error)
      return { error: 'Failed to fetch exporter' }
    }
  }

