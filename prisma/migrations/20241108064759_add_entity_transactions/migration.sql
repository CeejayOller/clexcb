-- CreateTable
CREATE TABLE "EntityTransaction" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changeLog" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EntityTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityTransaction_entityId_idx" ON "EntityTransaction"("entityId");

-- CreateIndex
CREATE INDEX "EntityTransaction_userId_idx" ON "EntityTransaction"("userId");

-- AddForeignKey
ALTER TABLE "EntityTransaction" ADD CONSTRAINT "EntityTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
