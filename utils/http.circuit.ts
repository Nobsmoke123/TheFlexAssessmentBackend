import { httpClient } from './http.client';
import * as CircuitBreaker from 'opossum';

async function requestWithAxios(config: any) {
  const res = await httpClient.request(config);
  return res.data;
}

const options = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};

const breaker = new CircuitBreaker(requestWithAxios, options);

breaker.fallback(() => ({
  result: [],
  fallback: true,
}));

export async function resilientRequest(config: any) {
  return breaker.fire(config);
}
