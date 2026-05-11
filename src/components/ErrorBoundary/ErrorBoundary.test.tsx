import { Component, type ReactNode } from 'react';
import { expect, test, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const throwTestError = (): never => {
  throw new Error('Test error');
};

class BrokenComponent extends Component {
  render(): ReactNode {
    return throwTestError();
  }
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('renders children when there is no error', () => {
  render(
    <ErrorBoundary>
      <p>Child content</p>
    </ErrorBoundary>
  );

  expect(screen.getByText(/child content/i)).toBeInTheDocument();
});

test('shows fallback UI when child component throws an error', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.getByText(/reload the page/i)).toBeInTheDocument();
});

test('logs error when child component throws an error', () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(consoleErrorSpy).toHaveBeenCalled();
});
