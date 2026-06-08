import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import NotFoundPage from './NotFoundPage';

test('renders not found page with link back to search', () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /go back to search/i })
  ).toBeInTheDocument();
});
