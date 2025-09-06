-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "ratingNormalized" DROP NOT NULL;

-- RenameIndex
ALTER INDEX "public"."idx_cancellationpolicy_googlePlaceId" RENAME TO "idx_property_googlePlaceId";

-- RenameIndex
ALTER INDEX "public"."idx_cancellationpolicy_internalListingName" RENAME TO "idx_property_internalListingName";

-- RenameIndex
ALTER INDEX "public"."idx_cancellationpolicy_latitude" RENAME TO "idx_property_latitude";

-- RenameIndex
ALTER INDEX "public"."idx_cancellationpolicy_listingId" RENAME TO "idx_property_listingId";

-- RenameIndex
ALTER INDEX "public"."idx_cancellationpolicy_longitude" RENAME TO "idx_property_longitude";
