import { render, screen, fireEvent } from '@testing-library/react';
import { AddUserDialog } from '@/components/add-row-dialog';
import { vi } from 'vitest';

vi.mock('@/api/fetchData', () => ({
  useCreateItem: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

test('открывает модальное окно по нажатию кнопки', () => {
  render(<AddUserDialog />);
  const openButton = screen.getByText('Добавить пользователя');

  fireEvent.click(openButton);

  expect(screen.getByText('Добавление пользователя')).toBeInTheDocument();
});
