// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  const hashedAdminPassword = await hashPassword('adminpassword123')
  const hashedClientPassword = await hashPassword('clientpassword123')
  const hashedBrokerPassword = await hashPassword('brokerpassword123')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clexcb.com' },
    update: {},
    create: {
      email: 'admin@clexcb.com',
      password: hashedAdminPassword,
      name: "CLEX Admin",
      role: 'SUPERADMIN',
      isActive: true,
      profile: {}
    }
  });

  // Create client with included user relation
  const client = await prisma.client.create({
    data: {
      user: {
        create: {
          email: 'client@example.com',
          password: hashedClientPassword,
          name: 'Example Client',
          role: 'CLIENT',
          isActive: true,
          profile: {
            tin: '123-456-789',
            industryType: 'Manufacturing'
          }
        }
      },
      type: 'IMPORTER',
      name: 'Example Company',
      registeredName: 'Example Company Inc.',
      tinNumber: '123-456-789',
      businessAddress: 'Manila, Philippines',
      contactPerson: 'John Doe',
      contactNumber: '+63 912 345 6789',
      email: 'contact@example.com',
      taxSettings: {},
      creditSettings: {}
    },
    include: {
      user: true // Include the user relation
    }
  });

  // Create broker with included user relation
  const broker = await prisma.broker.create({
    data: {
      user: {
        create: {
          email: 'broker@clexcb.com',
          password: hashedBrokerPassword,
          name: 'CLEX Broker',
          role: 'BROKER',
          isActive: true,
          profile: {
            employeeId: 'BR001',
            specialization: ['Import', 'PEZA']
          }
        }
      },
      employeeId: 'BR001',
      designation: 'Senior Broker',
      specialization: ['Import', 'PEZA'],
      isActive: true
    },
    include: {
      user: true // Include the user relation
    }
  });

  // Create sample shipment
  const shipment = await prisma.shipment.create({
    data: {
      referenceNumber: 'SHIP-2024-001',
      type: 'IMPORT',
      status: 'DRAFT',
      mode: 'SEA',
      consignee: {},
      shipper: {},
      cargo: {},
      packageDetails: {},
      portOfLoading: 'Shanghai',
      portOfDischarge: 'Manila',
      clientId: client.id,
      brokerId: broker.id,
    }
  });

  console.log('Seed data created successfully!');
  console.log('Admin:', { id: admin.id, email: admin.email, role: admin.role });
  console.log('Client:', { id: client.id, email: client.user.email, role: client.user.role });
  console.log('Broker:', { id: broker.id, email: broker.user.email, role: broker.user.role });
  console.log('Shipment:', { id: shipment.id, reference: shipment.referenceNumber });
}

main()
  .catch((e) => {
    console.error('Error while seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })