-- AlterTable
ALTER TABLE "notification_item" ADD COLUMN     "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
