/*
  Warnings:

  - You are about to drop the column `city` on the `address` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "city",
ADD COLUMN     "city_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "city" (
    "city_id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("city_id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("city_id") ON DELETE RESTRICT ON UPDATE CASCADE;
