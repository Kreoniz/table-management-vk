import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 15 * 60 * 1000,
      retry: 1,
    },
  },
});
