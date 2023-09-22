-- AlterTable
ALTER TABLE "product" ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "product_category" (
    "category_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("category_id")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;
