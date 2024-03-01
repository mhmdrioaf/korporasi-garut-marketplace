/*
  Warnings:

  - You are about to drop the column `referrer_name` on the `income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "income" DROP COLUMN "referrer_name",
ADD COLUMN     "referrer_id" TEXT;

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "referrer"("referrer_id") ON DELETE CASCADE ON UPDATE CASCADE;
