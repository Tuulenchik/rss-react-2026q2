import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Search from './Search';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

test('calls onSearch with typed value after search button click', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<Search onSearch={onSearch} />);

  const input = screen.getByPlaceholderText('Search...');
  const button = screen.getByRole('button', { name: /search/i });

  await user.type(input, 'Rick');
  await user.click(button);

  expect(input).toHaveValue('Rick');
  expect(onSearch).toHaveBeenCalledWith('Rick');
});

test('shows empty input when local storage is empty', () => {
  const onSearch = vi.fn();

  render(<Search onSearch={onSearch} />);
  const input = screen.getByPlaceholderText('Search...');
  expect(input).toHaveValue('');
});

test('reads saved search term from localStorage on render', () => {
  localStorage.setItem('searchTerm', 'Aqua');
  const onSearch = vi.fn();
  render(<Search onSearch={onSearch} />);
  const input = screen.getByPlaceholderText('Search...');

  expect(input).toHaveValue('Aqua');
});

test('trims whitespace before calling onSearch', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<Search onSearch={onSearch} />);

  const input = screen.getByPlaceholderText('Search...');
  const button = screen.getByRole('button', { name: /search/i });

  await user.type(input, ' Adjudicator ');
  await user.click(button);

  expect(input).toHaveValue('Adjudicator');
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith('Adjudicator');
});
