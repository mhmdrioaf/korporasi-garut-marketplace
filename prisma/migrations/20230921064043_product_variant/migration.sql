-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "product_variant_id" TEXT;

-- CreateTable
CREATE TABLE "product_variant" (
    "variant_id" TEXT NOT NULL,
    "variant_title" TEXT NOT NULL,
    "variant_value" TEXT NOT NULL,
    "variant_price" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("variant_id")
);

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
