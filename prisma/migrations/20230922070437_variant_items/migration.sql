/*
  Warnings:

  - You are about to drop the column `variant_price` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `variant_value` on the `product_variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_product_variant_id_fkey";

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "variant_price",
DROP COLUMN "variant_value",
ALTER COLUMN "product_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "product_variant_item" (
    "variant_item_id" TEXT NOT NULL,
    "variant_name" TEXT NOT NULL,
    "variant_value" TEXT NOT NULL,
    "variant_price" INTEGER NOT NULL DEFAULT 0,
    "variant_id" TEXT NOT NULL,

    CONSTRAINT "product_variant_item_pkey" PRIMARY KEY ("variant_item_id")
);

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant_item"("variant_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_item" ADD CONSTRAINT "product_variant_item_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;
