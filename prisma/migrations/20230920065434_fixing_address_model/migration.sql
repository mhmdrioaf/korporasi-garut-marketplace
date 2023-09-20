/*
  Warnings:

  - Added the required column `label` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_name` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_phone_number` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "recipient_name" TEXT NOT NULL,
ADD COLUMN     "recipient_phone_number" TEXT NOT NULL;
