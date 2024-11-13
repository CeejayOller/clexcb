-- DropIndex
DROP INDEX "EntityTransaction_entityId_idx";

-- AlterTable
ALTER TABLE "EntityTransaction" ADD COLUMN     "consigneeId" TEXT,
ADD COLUMN     "exporterId" TEXT;

-- CreateIndex
CREATE INDEX "EntityTransaction_consigneeId_idx" ON "EntityTransaction"("consigneeId");

-- CreateIndex
CREATE INDEX "EntityTransaction_exporterId_idx" ON "EntityTransaction"("exporterId");

-- AddForeignKey
ALTER TABLE "EntityTransaction" ADD CONSTRAINT "EntityTransaction_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityTransaction" ADD CONSTRAINT "EntityTransaction_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "Exporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
