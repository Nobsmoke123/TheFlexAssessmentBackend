/*
  Warnings:

  - A unique constraint covering the columns `[reviewId,categoryName]` on the table `ReviewCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "authorAvatarUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ReviewCategory_reviewId_categoryName_key" ON "public"."ReviewCategory"("reviewId", "categoryName");
