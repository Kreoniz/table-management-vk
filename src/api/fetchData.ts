import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from './client';
import { type Person } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

type Item = Person;

export type PaginatedResponse = {
  data: Item[];
  page: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
};

const fetchItems = async ({ pageParam = 1 }): Promise<PaginatedResponse> => {
  const limit = 10;
  const response = await fetch(`${API_URL}/users?_page=${pageParam}&_limit=${limit}`);
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!response.ok) throw new Error('Network error');

  const data = await response.json();
  const totalHeader = response.headers.get('X-Total-Count');
  const totalCount = totalHeader ? parseInt(totalHeader, 10) : 100;

  return {
    data,
    totalCount,
    page: pageParam,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: pageParam < Math.ceil(totalCount / limit),
  };
};

const createItem = async (newItem: Omit<Person, 'id'>): Promise<Person> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  });

  if (!response.ok) {
    throw new Error('Failed to create item');
  }

  return response.json();
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

export const useCreateItem = () => {
  return useMutation({
    mutationFn: createItem,
    onSuccess: (newItem) => {
      queryClient.setQueryData(['infinite-items'], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = [...oldData.pages];
        if (updatedPages[0]) {
          updatedPages[0] = {
            ...updatedPages[0],
            data: [newItem, ...updatedPages[0].data],
            totalCount: updatedPages[0].totalCount + 1,
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    },
  });
};
