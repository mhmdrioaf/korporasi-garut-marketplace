/*
  Warnings:

  - You are about to drop the `referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "referral" DROP CONSTRAINT "referral_product_id_fkey";

-- DropTable
DROP TABLE "referral";
