/*
  Warnings:

  - Added the required column `shipping_service` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shipping_service" TEXT NOT NULL;
