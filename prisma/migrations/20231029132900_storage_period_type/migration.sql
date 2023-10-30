/*
  Warnings:

  - The `storage_period` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "storage_period",
ADD COLUMN     "storage_period" INTEGER NOT NULL DEFAULT 3;
