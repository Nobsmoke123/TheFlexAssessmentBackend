/*
  Warnings:

  - You are about to drop the column `guestName` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[source,sourceReviewId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "guestName",
ADD COLUMN     "authorName" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."ReviewStatus";

-- DropEnum
DROP TYPE "public"."ReviewType";

-- CreateIndex
CREATE INDEX "idx_review_type" ON "public"."Review"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Review_source_sourceReviewId_key" ON "public"."Review"("source", "sourceReviewId");
