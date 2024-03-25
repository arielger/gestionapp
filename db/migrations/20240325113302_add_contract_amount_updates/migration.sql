-- CreateEnum
CREATE TYPE "ContractUpdateType" AS ENUM ('INDEX_IPC');

-- CreateEnum
CREATE TYPE "ContractAmountUpdateStatus" AS ENUM ('INITIAL', 'EXECUTED');

-- CreateEnum
CREATE TYPE "ContractAmountUpdateType" AS ENUM ('PROVISIONAL', 'FINAL');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "updateAmountFrequency" INTEGER,
ADD COLUMN     "updateAmountType" "ContractUpdateType";

-- CreateTable
CREATE TABLE "ContractAmountUpdate" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "status" "ContractAmountUpdateStatus" NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "indexType" "ContractAmountUpdateType",
    "executedAt" TIMESTAMP(3),
    "percentageVariation" DOUBLE PRECISION,
    "previousRentAmount" DOUBLE PRECISION,
    "newRentAmount" DOUBLE PRECISION,

    CONSTRAINT "ContractAmountUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractAmountUpdate" ADD CONSTRAINT "ContractAmountUpdate_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
