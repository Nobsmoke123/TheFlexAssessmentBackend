/*
  Warnings:

  - You are about to drop the column `lat` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internalListingName]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceReviewId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "listingId" INTEGER NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_propertyId" ON "public"."CancellationPolicy"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "public"."Channel"("name");

-- CreateIndex
CREATE INDEX "idx_channel_name" ON "public"."Channel"("name");

-- CreateIndex
CREATE INDEX "idx_houserule_propertyId" ON "public"."HouseRule"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_listingId_key" ON "public"."Property"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_internalListingName_key" ON "public"."Property"("internalListingName");

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_googlePlaceId" ON "public"."Property"("googlePlaceId");

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_internalListingName" ON "public"."Property"("internalListingName");

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_latitude" ON "public"."Property"("latitude");

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_longitude" ON "public"."Property"("longitude");

-- CreateIndex
CREATE INDEX "idx_cancellationpolicy_listingId" ON "public"."Property"("listingId");

-- CreateIndex
CREATE INDEX "idx_propertyamenity_propertyId" ON "public"."PropertyAmenity"("propertyId");

-- CreateIndex
CREATE INDEX "idx_propertyimage_propertyId" ON "public"."PropertyImage"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_sourceReviewId_key" ON "public"."Review"("sourceReviewId");

-- CreateIndex
CREATE INDEX "idx_review_propertyId" ON "public"."Review"("propertyId");

-- CreateIndex
CREATE INDEX "idx_review_channelId" ON "public"."Review"("channelId");

-- CreateIndex
CREATE INDEX "idx_review_type" ON "public"."Review"("type");

-- CreateIndex
CREATE INDEX "idx_review_source" ON "public"."Review"("source");

-- CreateIndex
CREATE INDEX "idx_review_sourceReviewId" ON "public"."Review"("sourceReviewId");

-- CreateIndex
CREATE INDEX "idx_reviewcategory_reviewId" ON "public"."ReviewCategory"("reviewId");
