export interface GoogleReview {
  name: string; //review-id
  relativePublishTimeDescription: string;
  rating: number; // google rating 1-5
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string; //guest-name
    uri: string;
    photoUri: string; // guest-avater
  };
  publishTime: string;
  flagContentUri: string;
  googleMapsUri: string;
  listingName: string; // add the displayName of the property from the response
  googlePlaceId: string; // add the id of the property from the response
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'awaiting';
  rating?: number;
  channelId?: number;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
}
