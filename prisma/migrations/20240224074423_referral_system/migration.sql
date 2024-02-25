-- AlterTable
ALTER TABLE "income" ADD COLUMN     "referrer_name" TEXT,
ALTER COLUMN "seller_id" DROP NOT NULL;
