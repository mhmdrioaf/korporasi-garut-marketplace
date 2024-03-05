-- CreateTable
CREATE TABLE "referrer" (
    "referrer_id" TEXT NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "referrer_pkey" PRIMARY KEY ("referrer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrer_user_id_key" ON "referrer"("user_id");

-- AddForeignKey
ALTER TABLE "referrer" ADD CONSTRAINT "referrer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
