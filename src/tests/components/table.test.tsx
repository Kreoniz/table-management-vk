import { render, screen, waitFor } from '@testing-library/react';
import { Table } from '@/components/table';
import { vi } from 'vitest';
import * as api from '@/api';

vi.mock('@/api');

const mockUser = {
  id: '1',
  name: 'John Doe',
  age: 30,
  gender: 'male',
  balance: '$2,000.00',
  company: 'TEST CORP',
  phone: '+1 123-456-7890',
  email: 'john.doe@example.com',
  about: 'Lorem ipsum dolor sit amet',
};

const mockPaginatedResponse = {
  pages: [
    {
      data: [mockUser],
      page: 1,
      totalPages: 1,
      totalCount: 1,
      hasNextPage: false,
    },
  ],
};

describe('Table Component', () => {
  beforeEach(() => {
    (api.useInfiniteItems as any).mockReturnValue({
      data: mockPaginatedResponse,
      fetchNextPage: vi.fn(),
      isFetching: false,
      isLoading: false,
    });
  });

  it('отображает данные пользователя в таблице', async () => {
    render(<Table />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    });
  });

  it('показывает спиннер на загрузке', async () => {
    (api.useInfiniteItems as any).mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      isFetching: false,
      isLoading: true,
    });

    render(<Table />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
