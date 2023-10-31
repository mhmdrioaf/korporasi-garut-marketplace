/*
  Warnings:

  - You are about to drop the column `variant_value` on the `product_variant_item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `product_variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capable_out_of_town` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expire_date` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage_period` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "capable_out_of_town" BOOLEAN NOT NULL,
ADD COLUMN     "expire_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "storage_period" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_variant_item" DROP COLUMN "variant_value",
ADD COLUMN     "variant_stock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_product_id_key" ON "product_variant"("product_id");
