-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "companyName" TEXT,
    "companyAddress" TEXT,
    "contactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consignee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registeredName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "tin" TEXT NOT NULL,
    "brn" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Consignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsigneeDocument" (
    "id" TEXT NOT NULL,
    "consigneeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConsigneeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exporter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Exporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "freightType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "consigneeId" TEXT,
    "exporterId" TEXT,
    "userId" TEXT NOT NULL,
    "consigneeData" TEXT NOT NULL,
    "exporterData" TEXT NOT NULL,
    "shipmentDetails" TEXT NOT NULL,
    "documentsData" TEXT NOT NULL,
    "computations" TEXT,
    "timelineData" TEXT NOT NULL,
    "notesData" TEXT NOT NULL,
    "cargoData" TEXT DEFAULT '[]',
    "statementOfFactsData" TEXT DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3),
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Consignee_tin_key" ON "Consignee"("tin");

-- CreateIndex
CREATE INDEX "Consignee_name_tin_idx" ON "Consignee"("name", "tin");

-- CreateIndex
CREATE INDEX "Consignee_userId_idx" ON "Consignee"("userId");

-- CreateIndex
CREATE INDEX "ConsigneeDocument_consigneeId_idx" ON "ConsigneeDocument"("consigneeId");

-- CreateIndex
CREATE INDEX "Exporter_name_idx" ON "Exporter"("name");

-- CreateIndex
CREATE INDEX "Exporter_userId_idx" ON "Exporter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_referenceNumber_key" ON "Shipment"("referenceNumber");

-- CreateIndex
CREATE INDEX "Shipment_userId_idx" ON "Shipment"("userId");

-- CreateIndex
CREATE INDEX "Shipment_consigneeId_exporterId_idx" ON "Shipment"("consigneeId", "exporterId");

-- AddForeignKey
ALTER TABLE "Consignee" ADD CONSTRAINT "Consignee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsigneeDocument" ADD CONSTRAINT "ConsigneeDocument_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exporter" ADD CONSTRAINT "Exporter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "Exporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
