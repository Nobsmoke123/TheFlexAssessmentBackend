import { resilientRequest } from './http.circuit';

export const fetchHostawayListings = async () => {
  try {
    const response = await resilientRequest({
      url: `${process.env.HOSTAWAY_API_BASE_URL}/listings`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.HOSTAWAY_API_KEY}`,
      },
    });

    return response?.result;
  } catch (error) {
    throw new Error(
      `Failed to fetch Hostaway listings ${(error as Error).message}`,
    );
  }
};
