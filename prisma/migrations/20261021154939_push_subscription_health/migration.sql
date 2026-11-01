-- AlterTable
ALTER TABLE "public"."PushSubscription" ADD COLUMN     "failureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastSuccessAt" TIMESTAMP(3);
