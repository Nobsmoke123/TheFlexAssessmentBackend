import axios from 'axios';
import axiosRetry from 'axios-retry';

export const httpClient = axios.create({
  timeout: 5000,
});

// wrap httpClient with error logging
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`[HTTP ERROR] ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

axiosRetry(httpClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (typeof error.response?.status === 'number' &&
        error.response.status >= 500)
    );
  },
});
