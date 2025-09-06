/*
  Warnings:

  - You are about to drop the column `currencyCode` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `Review` table. All the data in the column will be lost.
  - Added the required column `status` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "currencyCode";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "approved",
ADD COLUMN     "status" "public"."ReviewStatus" NOT NULL;
