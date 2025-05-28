import { useInfiniteQuery } from '@tanstack/react-query';
import { type Person } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

type Item = Person;

type PaginatedResponse = {
  data: Item[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
};

const fetchItems = async ({ pageParam = 1 }): Promise<PaginatedResponse> => {
  const limit = 10;
  const response = await fetch(`${API_URL}/users?_page=${pageParam}&_limit=${limit}`);
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!response.ok) throw new Error('Network error');

  const data = await response.json();
  const totalCount = 10000;

  return {
    data,
    page: pageParam,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: pageParam < Math.ceil(totalCount / limit),
  };
};

export const useInfiniteItems = () => {
  return useInfiniteQuery<PaginatedResponse>({
    queryKey: ['infinite-items'],
    queryFn: (context) => fetchItems({ pageParam: context.pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
