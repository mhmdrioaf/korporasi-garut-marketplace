/*
  Warnings:

  - You are about to drop the column `pending_order_count` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "pending_order_count";

-- AlterTable
ALTER TABLE "product_variant_item" ADD COLUMN     "pending_order_count" INTEGER NOT NULL DEFAULT 0;
