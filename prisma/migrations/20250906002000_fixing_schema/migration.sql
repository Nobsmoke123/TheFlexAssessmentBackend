/*
  Warnings:

  - You are about to drop the column `channel` on the `CancellationPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `cleanliness` on the `ReviewCategory` table. All the data in the column will be lost.
  - You are about to drop the column `communication` on the `ReviewCategory` table. All the data in the column will be lost.
  - You are about to drop the column `respect_house_rules` on the `ReviewCategory` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `ReviewCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `ReviewCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CancellationPolicy" DROP COLUMN "channel";

-- AlterTable
ALTER TABLE "public"."ReviewCategory" DROP COLUMN "cleanliness",
DROP COLUMN "communication",
DROP COLUMN "respect_house_rules",
ADD COLUMN     "categoryName" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL;
