import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { USER_ROLES } from '@/types/auth'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create default broker admin
    const hashedPassword = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@clexcb.com' },
      update: {},
      create: {
        email: 'admin@clexcb.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'BROKER',
        companyName: 'CLEX Customs Brokerage',
        companyAddress: 'Manila, Philippines',
        contactNumber: '+63 123 456 7890'
      },
    })
    console.log('Created admin user:', admin)

    // Create some sample consignees
    const consignees = await Promise.all([
      prisma.consignee.upsert({
        where: { tin: '123-456-789-000' },
        update: {},
        create: {
          name: 'ABC Manufacturing Co.',
          registeredName: 'ABC Manufacturing Corporation',
          businessAddress: 'Makati City, Philippines',
          tin: '123-456-789-000',
          brn: 'BRN123456',
          contactPerson: 'John Doe',
          contactNumber: '+63 987 654 3210',
          email: 'john@abcmfg.com',
          userId: admin.id
        },
      }),
      prisma.consignee.upsert({
        where: { tin: '987-654-321-000' },
        update: {},
        create: {
          name: 'XYZ Trading Inc.',
          registeredName: 'XYZ Trading Incorporated',
          businessAddress: 'Pasig City, Philippines',
          tin: '987-654-321-000',
          brn: 'BRN987654',
          contactPerson: 'Jane Smith',
          contactNumber: '+63 912 345 6789',
          email: 'jane@xyztrading.com',
          userId: admin.id
        },
      }),
    ])
    console.log('Created sample consignees:', consignees)

    // Create some sample exporters
    const exporters = await Promise.all([
      prisma.exporter.create({
        data: {
          name: 'China Exports Ltd.',
          businessAddress: 'Shanghai, China',
          contactPerson: 'Li Wei',
          contactNumber: '+86 123 4567 8900',
          email: 'li.wei@chinaexports.com',
          userId: admin.id
        },
      }),
      prisma.exporter.create({
        data: {
          name: 'Korea Trade Co.',
          businessAddress: 'Seoul, South Korea',
          contactPerson: 'Kim Min-ji',
          contactNumber: '+82 10 1234 5678',
          email: 'kim.minji@koreatrade.co.kr',
          userId: admin.id
        },
      }),
    ])
    console.log('Created sample exporters:', exporters)

    // Create a sample shipment
    const shipment = await prisma.shipment.create({
      data: {
        referenceNumber: 'CLEX-IMS24-0001',
        freightType: 'IMS',
        status: 'CLIENT_DETAILS',
        userId: admin.id,
        consigneeId: consignees[0].id,
        exporterId: exporters[0].id,
        consigneeData: JSON.stringify({
          name: consignees[0].name,
          address: consignees[0].businessAddress
        }),
        exporterData: JSON.stringify({
          name: exporters[0].name,
          address: exporters[0].businessAddress
        }),
        shipmentDetails: JSON.stringify({
          bl_number: 'BL123456789',
          vessel_name: 'EVER GIVEN',
          registry_number: 'REG123456',
          voyage_number: 'V2024001',
          container_number: 'CONT123456',
          port_of_origin: 'Shanghai, China',
          port_of_discharge: 'Manila, Philippines',
          eta: '2024-03-15T08:00:00Z',
          ata: '',
          description_of_goods: 'Industrial machinery parts',
          volume: '40ft container'
        }),
        documentsData: JSON.stringify([
          {
            name: 'Bill of Lading',
            status: 'not_uploaded',
            isVerified: false,
            isRequired: true,
            files: []
          },
          {
            name: 'Commercial Invoice',
            status: 'not_uploaded',
            isVerified: false,
            isRequired: true,
            files: []
          }
        ]),
        timelineData: JSON.stringify([{
          stage: 'CLIENT_DETAILS',
          status: 'in_progress',
          timestamp: new Date().toISOString()
        }]),
        notesData: JSON.stringify([]),
      }
    })
    console.log('Created sample shipment:', shipment)

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })