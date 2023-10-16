-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shipping_address" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_fkey" FOREIGN KEY ("shipping_address") REFERENCES "address"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;
