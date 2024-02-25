-- CreateTable
CREATE TABLE "referral" (
    "referral_id" TEXT NOT NULL,
    "referrer_name" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "redirect_path" TEXT NOT NULL,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("referral_id")
);

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
