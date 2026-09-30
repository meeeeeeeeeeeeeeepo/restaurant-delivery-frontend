import { createClient, cacheExchange, fetchExchange } from 'urql';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql';

export const client = createClient({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange]
});
