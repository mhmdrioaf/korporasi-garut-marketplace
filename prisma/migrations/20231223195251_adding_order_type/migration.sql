-- CreateEnum
CREATE TYPE "ORDER_TYPE" AS ENUM ('NORMAL', 'PREORDER');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_type" "ORDER_TYPE" NOT NULL DEFAULT 'NORMAL';
