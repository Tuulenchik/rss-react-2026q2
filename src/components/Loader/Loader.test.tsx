import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

test('renders loading text', () => {
  render(<Loader />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
