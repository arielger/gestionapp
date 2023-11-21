/*
  Warnings:

  - A unique constraint covering the columns `[customDetailsId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "customDetailsId" INTEGER;

-- CreateTable
CREATE TABLE "ActivityCustomDetails" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ActivityCustomDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityCustomDetails_activityId_key" ON "ActivityCustomDetails"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_customDetailsId_key" ON "Activity"("customDetailsId");

-- AddForeignKey
ALTER TABLE "ActivityCustomDetails" ADD CONSTRAINT "ActivityCustomDetails_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
