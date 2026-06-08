import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

afterEach(() => {
  cleanup();
});

test('renders pagination buttons and marks current page as active', () => {
  const onPageChange = vi.fn();

  render(
    <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
  );

  expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

  expect(screen.getByRole('button', { name: '1' })).toBeEnabled();
  expect(screen.getByRole('button', { name: '2' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('button', { name: '3' })).toBeEnabled();
});

test('disables previous button on first page and next button on last page', () => {
  const onPageChange = vi.fn();

  const { rerender } = render(
    <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
  );

  expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

  rerender(
    <Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />
  );

  expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
});

test('calls onPageChange when previous and next buttons are clicked', async () => {
  const user = userEvent.setup();
  const onPageChange = vi.fn();

  render(
    <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
  );

  await user.click(screen.getByRole('button', { name: /previous/i }));
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
  expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
});

test('shows compact pagination with ellipses for middle pages', () => {
  render(
    <Pagination currentPage={20} totalPages={42} onPageChange={vi.fn()} />
  );

  expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '19' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '20' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '21' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument();

  expect(screen.getAllByText('…')).toHaveLength(2);
  expect(screen.queryByRole('button', { name: '10' })).not.toBeInTheDocument();
});

test('shows first pages without start ellipsis near the beginning', () => {
  render(<Pagination currentPage={3} totalPages={42} onPageChange={vi.fn()} />);

  expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '3' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument();

  expect(screen.getAllByText('…')).toHaveLength(1);
});

test('shows last pages without end ellipsis near the end', () => {
  render(
    <Pagination currentPage={40} totalPages={42} onPageChange={vi.fn()} />
  );

  expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '38' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '39' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '40' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '41' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument();

  expect(screen.getAllByText('…')).toHaveLength(1);
});
