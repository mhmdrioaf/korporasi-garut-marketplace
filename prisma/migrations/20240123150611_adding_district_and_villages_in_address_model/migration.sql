/*
  Warnings:

  - Added the required column `district` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "village" TEXT NOT NULL;
