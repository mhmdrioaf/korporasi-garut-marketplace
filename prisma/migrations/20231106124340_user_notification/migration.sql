-- CreateEnum
CREATE TYPE "NOTIFICATION_STATUS" AS ENUM ('UNREAD', 'READ');

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" TEXT NOT NULL,
    "subscriber_id" INTEGER NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "notification_item" (
    "notification_item_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "redirect_url" TEXT,
    "show_action_button" BOOLEAN NOT NULL DEFAULT true,
    "status" "NOTIFICATION_STATUS" NOT NULL DEFAULT 'UNREAD',

    CONSTRAINT "notification_item_pkey" PRIMARY KEY ("notification_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_subscriber_id_key" ON "notification"("subscriber_id");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_item" ADD CONSTRAINT "notification_item_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("notification_id") ON DELETE CASCADE ON UPDATE CASCADE;
