import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
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
