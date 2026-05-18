import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import ResultsList from './ResultsList';
import { mockItems } from '../../test-utils/mockItems';

test('renders all provided items with links to details pages', () => {
  render(
    <MemoryRouter>
      <ResultsList items={mockItems} currentPage={1} />
    </MemoryRouter>
  );

  expect(screen.getByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/antenna rick/i)).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /alien rick/i })).toHaveAttribute(
    'href',
    `/page/1/details/${mockItems[0].id}`
  );
});

test('displays "No results yet" when items array is empty', () => {
  render(
    <MemoryRouter>
      <ResultsList items={[]} currentPage={1} />
    </MemoryRouter>
  );

  expect(screen.getByText(/no results yet/i)).toBeInTheDocument();
});
