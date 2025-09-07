import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fetchHostawayListings } from '../utils/fetchListings';
import { channel } from 'node:diagnostics_channel';

interface Channel {
  id: number;
  name: string;
  displayName: string;
}

interface Review {
  id: number;
  type: 'host-to-guest';
  status: 'published' | 'awaiting';
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}

interface Property {
  id: number;
  propertyTypeId: number;
  name: string;
  externalListingName: string;
  internalListingName: string;
  description: string;
  thumbnailUrl: string | null;
  houseRules: string;
  keyPickup: string | null;
  specialInstruction: string | null;
  doorSecurityCode: string | null;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  street: string;
  address: string;
  publicAddress: string;
  zipcode: string;
  price: number;
  starRating: number | null;
  weeklyDiscount: number;
  monthlyDiscount: number;
  propertyRentTax: number;
  guestPerPersonPerNightTax: number;
  guestStayTax: number;
  guestNightlyTax: number;
  refundableDamageDeposit: number;
  isDepositStayCollected: number;
  personCapacity: number;
  maxChildrenAllowed: number | null;
  maxInfantsAllowed: number | null;
  maxPetsAllowed: number | null;
  lat: number;
  lng: number;
  checkInTimeStart: number;
  checkInTimeEnd: number;
  checkOutTime: number;
  cancellationPolicy: string;
  squareMeters: number | null;
  roomType: 'entire_home' | 'private_room' | 'shared_room';
  bathroomType: 'private' | 'shared';
  bedroomsNumber: number | null;
  bedsNumber: number | null;
  bathroomsNumber: number | null;
  guestBathroomsNumber: number | null;
  minNights: number | null;
  maxNights: number | null;
  guestsIncluded: number;
  cleaningFee: number | null;
  checkinFee: number;
  priceForExtraPerson: number;
  instantBookable: number | null;
  instantBookableLeadTime: number | null;
  airbnbBookingLeadTime: number | null;
  listingAmenities: Array<{
    id: number;
    amenityId: number;
    amenityName: string;
  }>;
  listingImages: Array<{
    id: number;
    caption: string;
    url: string;
    sortOrder: number;
  }>;
}

interface SeedResult {
  success: boolean;
  channelsCreated: number;
  propertiesCreated: number;
  reviewsCreated: number;
  errors: string[];
  warnings: string[];
}

class Seeder {
  private readonly prisma: PrismaClient;
  private result: SeedResult;

  constructor() {
    this.prisma = new PrismaClient();
    this.result = {
      success: false,
      channelsCreated: 0,
      propertiesCreated: 0,
      reviewsCreated: 0,
      errors: [],
      warnings: [],
    };
  }

  // Load JSON from file
  private async loadJsonData<T>(filepath: string): Promise<T[]> {
    try {
      const data = await fs.readFile(path.join(__dirname, filepath), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(
        `Failed to load data from ${filepath} : ${(error as Error).message}`,
      );
    }
  }

  /**
   * Validate data integrity
   */
  private async validateData(): Promise<void> {
    console.log('🔍 Validating data integrity...');

    const channels = await this.prisma.channel.count();
    const properties = await this.prisma.property.count();

    console.log(`📊 Data Summary:`);
    console.log(`📊 Channels: ${channels}`);
    console.log(`📊 Properties: ${properties}`);
  }

  /**
   * Seed Channels
   */
  private async seedChannels(): Promise<void> {
    console.log('⚡️ Seeding channels.....');

    const channels = await this.loadJsonData<Channel>('../data/channel.json');

    for (let channel of channels) {
      try {
        await this.prisma.channel.upsert({
          where: { id: channel.id },
          update: {
            name: channel.name,
            displayName: channel.displayName,
          },
          create: {
            id: channel.id,
            name: channel.name,
            displayName: channel.displayName,
          },
        });
        this.result.channelsCreated++;
      } catch (error) {
        this.result.errors.push(
          `Failed to seed channel ${channel.name}: ${(error as Error).message}`,
        );
      }
    }

    console.log(`✅ Created/Updated ${this.result.channelsCreated} channels`);
  }

  /**
   * Seed properties
   */
  private async seedProperties(): Promise<void> {
    console.log('🏠 Seeding properties from Hostaway...');

    const listings: Property[] = await fetchHostawayListings();

    for (let listing of listings) {
      try {
        await this.prisma.$transaction(async (transaction) => {
          const property = await transaction.property.upsert({
            where: { listingId: listing.id },
            create: {
              name: listing.name,
              listingId: listing.id,
              externalListingName: listing.externalListingName,
              internalListingName: listing.internalListingName,
              description: listing.description,
              address: listing.address,
              city: listing.city,
              country: listing.country,
              zipcode: listing.zipcode,
              latitude: listing.lat,
              longitude: listing.lng,
              guests: listing.guestsIncluded,
              bedrooms: listing.bedroomsNumber ?? 1,
              bathrooms: listing.bathroomsNumber ?? 1,
              beds: listing.bedsNumber ?? 1,
              checkInTime: listing.checkInTimeStart
                ? `${listing.checkInTimeStart}: 00PM`
                : '3:00PM',
              checkOutTime: listing.checkOutTime
                ? `${listing.checkOutTime}:00AM`
                : '10:00AM',
              price: listing.price,
            },
            update: {
              name: listing.name,
              externalListingName: listing.externalListingName,
              internalListingName: listing.internalListingName,
              description: listing.description,
              address: listing.address,
              city: listing.city,
              country: listing.country,
              zipcode: listing.zipcode,
              latitude: listing.lat,
              longitude: listing.lng,
              guests: listing.guestsIncluded,
              bedrooms: listing.bedroomsNumber ?? 1,
              bathrooms: listing.bathroomsNumber ?? 1,
              beds: listing.bedsNumber ?? 1,
              checkInTime: listing.checkInTimeStart
                ? `${listing.checkInTimeStart}: 00PM`
                : '3:00PM',
              checkOutTime: listing.checkOutTime
                ? `${listing.checkOutTime}:00AM`
                : '10:00AM',
              price: listing.price,
            },
          });

          // Add the property image
          await transaction.propertyImage.createMany({
            data: [
              ...listing.listingImages.map((listingImage) => ({
                url: listingImage.url,
                caption: listingImage.caption,
                sortOrder: listingImage.sortOrder,
                propertyId: property.id,
              })),
            ],
          });

          // Add the property amenity
          await transaction.propertyAmenity.createMany({
            data: [
              ...listing.listingAmenities.map((amenity) => ({
                propertyId: property.id,
                name: amenity.amenityName,
              })),
            ],
          });

          // Add the property house rules
          await transaction.houseRule.createMany({
            data: [
              {
                propertyId: property.id,
                rule: listing.houseRules,
              },
            ],
          });

          // Add cancellation policies
          await transaction.cancellationPolicy.createMany({
            data: [
              {
                propertyId: property.id,
                policyName: listing.cancellationPolicy,
              },
            ],
          });
        });

        this.result.propertiesCreated++;
      } catch (error) {
        this.result.errors.push(
          `Failed to seed property ${listing.name}: ${(error as Error).message}`,
        );
      }
    }

    console.log(
      `✅ Created/Updated ${this.result.propertiesCreated} properties`,
    );
  }

  /**
   * Main seeding function
   */
  async seed(): Promise<SeedResult> {
    console.log('🚀 Starting geographic data seeding...\n');

    try {
      // Check if data files exist
      const dataFiles = ['./data/channel.json'];

      for (const file of dataFiles) {
        try {
          await fs.access(path.join(__dirname, file));
        } catch {
          this.result.errors.push(`Data file not found: ${file}`);
        }
      }

      if (this.result.errors.length > 0) {
        throw new Error('Required data files are missing');
      }

      // Seed data in order (channels -> properties)
      await this.seedChannels();
      await this.seedProperties();

      // Validate the seeded data
      await this.validateData();

      this.result.success = true;

      console.log('\n🎉  Data seeding completed successfully!');
    } catch (error) {
      this.result.errors.push(`Seeding failed: ${(error as Error).message}`);
      console.error('❌ Seeding failed:', error);
    } finally {
      await this.prisma.$disconnect();
    }

    return this.result;
  }

  /**
   * Clean up existing data (use with caution)
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up existing data...');

    try {
      await this.prisma.channel.deleteMany();
      await this.prisma.property.deleteMany();

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }
}
