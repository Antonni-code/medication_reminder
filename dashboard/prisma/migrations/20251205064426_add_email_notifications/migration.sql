-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notification_delay_minutes" INTEGER NOT NULL DEFAULT 15;

-- CreateTable
CREATE TABLE "email_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "alarm_index" INTEGER NOT NULL,
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_type" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_notifications_user_id_alarm_index_scheduled_time_idx" ON "email_notifications"("user_id", "alarm_index", "scheduled_time");

-- CreateIndex
CREATE UNIQUE INDEX "email_notifications_user_id_alarm_index_scheduled_time_emai_key" ON "email_notifications"("user_id", "alarm_index", "scheduled_time", "email_type");

-- AddForeignKey
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
