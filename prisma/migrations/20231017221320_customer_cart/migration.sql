-- CreateTable
CREATE TABLE "customer_cart" (
    "cart_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "total_weight" INTEGER NOT NULL,

    CONSTRAINT "customer_cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "customer_cart_item" (
    "cart_item_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_variant_item_id" TEXT,

    CONSTRAINT "customer_cart_item_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_cart_user_id_key" ON "customer_cart"("user_id");

-- AddForeignKey
ALTER TABLE "customer_cart" ADD CONSTRAINT "customer_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_cart_item" ADD CONSTRAINT "customer_cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "customer_cart"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_cart_item" ADD CONSTRAINT "customer_cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_cart_item" ADD CONSTRAINT "customer_cart_item_product_variant_item_id_fkey" FOREIGN KEY ("product_variant_item_id") REFERENCES "product_variant_item"("variant_item_id") ON DELETE CASCADE ON UPDATE CASCADE;
