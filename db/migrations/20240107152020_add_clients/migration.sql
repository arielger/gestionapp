/*
  Warnings:

  - You are about to drop the `RealStateOwner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContractToRealStateOwner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContractToTenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PropertyToRealStateOwner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RealStateOwner" DROP CONSTRAINT "RealStateOwner_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToRealStateOwner" DROP CONSTRAINT "_ContractToRealStateOwner_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToRealStateOwner" DROP CONSTRAINT "_ContractToRealStateOwner_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToTenant" DROP CONSTRAINT "_ContractToTenant_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToTenant" DROP CONSTRAINT "_ContractToTenant_B_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyToRealStateOwner" DROP CONSTRAINT "_PropertyToRealStateOwner_A_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyToRealStateOwner" DROP CONSTRAINT "_PropertyToRealStateOwner_B_fkey";

-- DropTable
DROP TABLE "RealStateOwner";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "_ContractToRealStateOwner";

-- DropTable
DROP TABLE "_ContractToTenant";

-- DropTable
DROP TABLE "_PropertyToRealStateOwner";

-- CreateTable
CREATE TABLE "Client" (
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyOwnerOnProperty" (
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyOwnerOnProperty_pkey" PRIMARY KEY ("clientId","propertyId")
);

-- CreateTable
CREATE TABLE "TenantOnContract" (
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "TenantOnContract_pkey" PRIMARY KEY ("clientId","contractId")
);

-- CreateTable
CREATE TABLE "PropertyOwnerOnContract" (
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "PropertyOwnerOnContract_pkey" PRIMARY KEY ("clientId","contractId")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnProperty" ADD CONSTRAINT "PropertyOwnerOnProperty_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnProperty" ADD CONSTRAINT "PropertyOwnerOnProperty_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnProperty" ADD CONSTRAINT "PropertyOwnerOnProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantOnContract" ADD CONSTRAINT "TenantOnContract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantOnContract" ADD CONSTRAINT "TenantOnContract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantOnContract" ADD CONSTRAINT "TenantOnContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnContract" ADD CONSTRAINT "PropertyOwnerOnContract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnContract" ADD CONSTRAINT "PropertyOwnerOnContract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnerOnContract" ADD CONSTRAINT "PropertyOwnerOnContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
