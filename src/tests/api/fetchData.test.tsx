import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import { useInfiniteItems } from '@/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { type Person } from '@/types';

global.fetch = vi.fn();

const API_URL = import.meta.env.VITE_API_URL;

type MockPaginatedResponse = {
  data: Partial<Person>[];
  page: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useInfiniteItems', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  it('успешно получает данные первой страницы', async () => {
    const mockData: Partial<Person>[] = [
      { id: '1', name: 'John', age: 30 },
      { id: '2', name: 'Alice', age: 25 },
    ];

    const mockResponse: MockPaginatedResponse = {
      data: mockData,
      page: 1,
      totalCount: 20,
      totalPages: 2,
      hasNextPage: true,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'X-Total-Count': '20' }),
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useInfiniteItems(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/data?_page=1&_limit=10`);
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
  });

  it('правильно определяет следующую страницу', async () => {
    const mockDataPage1: Partial<Person>[] = Array(10)
      .fill(0)
      .map((_, i) => ({ id: String(i), name: `User ${i}`, age: 20 + i }));
    const mockDataPage2: Partial<Person>[] = Array(5)
      .fill(0)
      .map((_, i) => ({ id: String(i + 10), name: `User ${i + 10}`, age: 30 + i }));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'X-Total-Count': '15' }),
      json: () => Promise.resolve(mockDataPage1),
    });

    const { result } = renderHook(() => useInfiniteItems(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0].hasNextPage).toBe(true);
    expect(result.current.data?.pages[0].page).toBe(1);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'X-Total-Count': '15' }),
      json: () => Promise.resolve(mockDataPage2),
    });

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
      expect(result.current.data?.pages[1].page).toBe(2);
      expect(result.current.data?.pages[1].hasNextPage).toBe(false);
    });
  });
});
