/*
  Warnings:

  - The values [RENT,RENT_FEE] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customDetailsId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `originActivityId` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `ActivityCustomDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('RENT_DEBT', 'RENT_PAYMENT', 'RENT_OWNER_CREDIT', 'CUSTOM');
ALTER TABLE "Activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_originActivityId_fkey";

-- DropIndex
DROP INDEX "Activity_customDetailsId_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "customDetailsId",
DROP COLUMN "originActivityId";

-- AlterTable
ALTER TABLE "ActivityCustomDetails" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ActivityRentPaymentDetails" (
    "organizationId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "rentDebtId" INTEGER NOT NULL,

    CONSTRAINT "ActivityRentPaymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRentOwnerCredit" (
    "organizationId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "rentDebtId" INTEGER NOT NULL,
    "rentPaymentId" INTEGER NOT NULL,

    CONSTRAINT "ActivityRentOwnerCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRentPaymentDetails_activityId_key" ON "ActivityRentPaymentDetails"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRentPaymentDetails_rentDebtId_key" ON "ActivityRentPaymentDetails"("rentDebtId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRentOwnerCredit_activityId_key" ON "ActivityRentOwnerCredit"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRentOwnerCredit_rentDebtId_key" ON "ActivityRentOwnerCredit"("rentDebtId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRentOwnerCredit_rentPaymentId_key" ON "ActivityRentOwnerCredit"("rentPaymentId");

-- AddForeignKey
ALTER TABLE "ActivityCustomDetails" ADD CONSTRAINT "ActivityCustomDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentPaymentDetails" ADD CONSTRAINT "ActivityRentPaymentDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentPaymentDetails" ADD CONSTRAINT "ActivityRentPaymentDetails_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentPaymentDetails" ADD CONSTRAINT "ActivityRentPaymentDetails_rentDebtId_fkey" FOREIGN KEY ("rentDebtId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentOwnerCredit" ADD CONSTRAINT "ActivityRentOwnerCredit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentOwnerCredit" ADD CONSTRAINT "ActivityRentOwnerCredit_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentOwnerCredit" ADD CONSTRAINT "ActivityRentOwnerCredit_rentDebtId_fkey" FOREIGN KEY ("rentDebtId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRentOwnerCredit" ADD CONSTRAINT "ActivityRentOwnerCredit_rentPaymentId_fkey" FOREIGN KEY ("rentPaymentId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
