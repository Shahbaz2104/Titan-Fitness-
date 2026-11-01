-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_userId_fkey";

-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "guestName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
