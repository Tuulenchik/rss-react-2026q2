import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { fetchCharacters } from './services/api';
import { mockItems } from './test-utils/mockItems';
import { MemoryRouter } from 'react-router';

function renderApp(route = '/page/1') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}
const mockCharactersResponse = {
  items: mockItems,
  totalPages: 1,
};

vi.mock('./services/api', () => ({
  fetchCharacters: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

test('calls fetchCharacters on initial mount', async () => {
  vi.mocked(fetchCharacters).mockResolvedValue(mockCharactersResponse);

  renderApp();

  await waitFor(() => {
    expect(fetchCharacters).toHaveBeenCalledTimes(1);
  });

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/antenna rick/i)).toBeInTheDocument();
});

test('uses saved search term from localStorage for initial API call', async () => {
  vi.mocked(fetchCharacters).mockResolvedValue(mockCharactersResponse);
  localStorage.setItem('searchTerm', 'Rick');
  renderApp();

  const input = screen.getByPlaceholderText('Search...');

  expect(input).toHaveValue('Rick');

  await waitFor(() => {
    expect(fetchCharacters).toHaveBeenCalledWith('Rick', 1);
  });

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/antenna rick/i)).toBeInTheDocument();
});

test('shows Loader while loading and renders items after successful response', async () => {
  vi.mocked(fetchCharacters).mockResolvedValue(mockCharactersResponse);
  renderApp();

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test('renders error message after failed API response', async () => {
  vi.mocked(fetchCharacters).mockRejectedValue(
    new Error('Something went wrong')
  );

  renderApp();

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test('saves trimmed search term to localStorage, calls API and renders results', async () => {
  const user = userEvent.setup();

  vi.mocked(fetchCharacters)
    .mockResolvedValueOnce({
      items: [],
      totalPages: 1,
    })
    .mockResolvedValueOnce(mockCharactersResponse);

  renderApp();

  await waitFor(() => {
    expect(fetchCharacters).toHaveBeenCalledTimes(1);
  });

  const input = screen.getByPlaceholderText('Search...');
  const button = screen.getByRole('button', { name: /search/i });

  await user.type(input, ' Alien ');
  await user.click(button);

  await waitFor(() => {
    expect(fetchCharacters).toHaveBeenCalledWith('Alien', 1);
  });

  expect(localStorage.getItem('searchTerm')).toBe('Alien');
  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
});

test('does not call API again if search term equals lastSearchTerm', async () => {
  const user = userEvent.setup();

  localStorage.setItem('searchTerm', 'Rick');
  vi.mocked(fetchCharacters).mockResolvedValue(mockCharactersResponse);

  renderApp();

  await waitFor(() => {
    expect(fetchCharacters).toHaveBeenCalledTimes(1);
  });

  const input = screen.getByPlaceholderText('Search...');
  const button = screen.getByRole('button', { name: /search/i });

  expect(input).toHaveValue('Rick');

  await user.click(button);

  expect(fetchCharacters).toHaveBeenCalledTimes(1);
});
