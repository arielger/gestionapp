/*
  Warnings:

  - You are about to drop the column `activityToPayId` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `fee` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feeType` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractFeeType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'RENT_FEE';

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_activityToPayId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "activityToPayId",
ADD COLUMN     "originActivityId" INTEGER;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "feeType" "ContractFeeType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_originActivityId_fkey" FOREIGN KEY ("originActivityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
