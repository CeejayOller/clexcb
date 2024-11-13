/*
  Warnings:

  - You are about to drop the `EntityTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EntityTransaction" DROP CONSTRAINT "EntityTransaction_consigneeId_fkey";

-- DropForeignKey
ALTER TABLE "EntityTransaction" DROP CONSTRAINT "EntityTransaction_exporterId_fkey";

-- DropForeignKey
ALTER TABLE "EntityTransaction" DROP CONSTRAINT "EntityTransaction_userId_fkey";

-- DropTable
DROP TABLE "EntityTransaction";
