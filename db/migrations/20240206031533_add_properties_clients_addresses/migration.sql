/*
  Warnings:

  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "addressId" INTEGER;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "address",
ADD COLUMN     "addressId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" INTEGER NOT NULL,
    "subpremise" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_addressId_key" ON "Client"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_addressId_key" ON "Property"("addressId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
