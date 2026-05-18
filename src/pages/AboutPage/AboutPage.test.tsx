import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import AboutPage from './AboutPage';

test('renders about page content and navigation links', () => {
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  expect(screen.getByText(/author/i)).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /rs school react course/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /back to search/i })
  ).toBeInTheDocument();
});
