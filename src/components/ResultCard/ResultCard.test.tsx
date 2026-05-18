import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import ResultCard from './ResultCard';
import { mockItems } from '../../test-utils/mockItems';

test('displays item name and description as a details link', () => {
  render(
    <MemoryRouter>
      <ResultCard item={mockItems[0]} detailsPath="/page/1/details/1" />
    </MemoryRouter>
  );

  expect(screen.getByText(mockItems[0].name)).toBeInTheDocument();
  expect(screen.getByText(mockItems[0].description)).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /alien rick/i })).toHaveAttribute(
    'href',
    '/page/1/details/1'
  );
});
