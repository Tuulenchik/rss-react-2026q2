import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultCard from './ResultCard';
import { mockItems } from '../../test-utils/mockItems';

test('displays item name and description', () => {
  render(<ResultCard item={mockItems[0]} />);
  expect(screen.getByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/unknown alien/i)).toBeInTheDocument();
});
