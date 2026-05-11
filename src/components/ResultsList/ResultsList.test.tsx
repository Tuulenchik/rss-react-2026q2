import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultsList from './ResultsList';
import { mockItems } from '../../test-utils/mockItems';

test('renders all provided items', () => {
  render(<ResultsList items={mockItems} />);
  expect(screen.getByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/antenna rick/i)).toBeInTheDocument();
  expect(screen.queryByText(/no results yet/i)).not.toBeInTheDocument();
});

test('displays "No results yet" when items array is empty', () => {
  render(<ResultsList items={[]} />);
  expect(screen.getByText(/no results yet/i)).toBeInTheDocument();
});
