import axios from 'axios';

export const fetchHostawayListings = async () => {
  try {
    const response = await axios.get(
      `${process.env.HOSTAWAY_API_BASE_URL}/listings`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSTAWAY_API_KEY}`,
        },
      },
    );
    return response.data.result;
  } catch (error) {
    throw new Error(
      `Failed to fetch Hostaway listings ${(error as Error).message}`,
    );
  }
};
