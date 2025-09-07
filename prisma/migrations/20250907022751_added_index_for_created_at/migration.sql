/*
  Warnings:

  - You are about to drop the column `ratingNormalized` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "ratingNormalized";

-- CreateIndex
CREATE INDEX "idx_review_createdAt" ON "public"."Review"("createdAt");
