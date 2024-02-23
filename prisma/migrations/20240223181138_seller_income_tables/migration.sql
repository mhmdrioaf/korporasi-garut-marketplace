-- CreateEnum
CREATE TYPE "INCOME_STATUS" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "income" (
    "income_id" TEXT NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "total_income" INTEGER NOT NULL,
    "income_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "income_pkey" PRIMARY KEY ("income_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "income_order_id_key" ON "income"("order_id");

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
