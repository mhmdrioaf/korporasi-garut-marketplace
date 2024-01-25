/*
  Warnings:

  - Added the required column `latidude` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "latidude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
