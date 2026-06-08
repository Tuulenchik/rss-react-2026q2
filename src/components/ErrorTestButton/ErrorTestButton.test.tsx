import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ErrorTestButton from './ErrorTestButton';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('triggers ErrorBoundary fallback after button click', async () => {
  const user = userEvent.setup();

  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ErrorTestButton />
    </ErrorBoundary>
  );

  const button = screen.getByRole('button', { name: /test error boundary/i });

  await user.click(button);

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.getByText(/reload the page/i)).toBeInTheDocument();
});
