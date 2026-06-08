import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import type { CharactersApiResponse } from './types/item';
import { renderWithProviders } from './test-utils/renderWithProviders';

const pageOneResponse: CharactersApiResponse = {
  info: {
    pages: 2,
  },
  results: [
    {
      id: 1,
      name: 'Alien Rick',
      status: 'unknown',
      species: 'Alien',
      gender: 'Male',
      origin: {
        name: 'unknown',
      },
      location: {
        name: 'Citadel of Ricks',
      },
    },
    {
      id: 2,
      name: 'Antenna Rick',
      status: 'unknown',
      species: 'Human',
      gender: 'Male',
      origin: {
        name: 'unknown',
      },
      location: {
        name: 'unknown',
      },
    },
  ],
};

const pageTwoResponse: CharactersApiResponse = {
  info: {
    pages: 2,
  },
  results: [
    {
      id: 3,
      name: 'Birdperson',
      status: 'Alive',
      species: 'Bird-Person',
      gender: 'Male',
      origin: {
        name: 'Bird World',
      },
      location: {
        name: 'Planet Squanch',
      },
    },
  ],
};

function createJsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
}

function getRequestUrl(input: Parameters<typeof fetch>[0]) {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function mockCharactersFetch() {
  const fetchMock = vi.fn<typeof fetch>();

  fetchMock.mockImplementation((input) => {
    const requestUrl = getRequestUrl(input);

    if (requestUrl.includes('page=2')) {
      return createJsonResponse(pageTwoResponse);
    }

    return createJsonResponse(pageOneResponse);
  });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

function renderApp(route = '/page/1') {
  return renderWithProviders(<App />, { route });
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('renders characters after successful query', async () => {
  const fetchMock = mockCharactersFetch();

  renderApp();

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(screen.getByText(/antenna rick/i)).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('uses saved search term from localStorage', async () => {
  const fetchMock = mockCharactersFetch();

  localStorage.setItem('searchTerm', 'Rick');
  renderApp();

  expect(screen.getByPlaceholderText('Search...')).toHaveValue('Rick');

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  const firstCall = fetchMock.mock.calls[0];
  const requestUrl = getRequestUrl(firstCall[0]);

  expect(requestUrl).toContain('name=Rick');
});

test('shows error message after failed query', async () => {
  const fetchMock = vi.fn<typeof fetch>();

  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

  vi.stubGlobal('fetch', fetchMock);

  renderApp();

  expect(
    await screen.findByText(/failed to load characters/i)
  ).toBeInTheDocument();
});

test('saves trimmed search term and sends new query', async () => {
  const user = userEvent.setup();
  const fetchMock = mockCharactersFetch();

  renderApp();

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();

  const input = screen.getByPlaceholderText('Search...');
  const button = screen.getByRole('button', { name: /^search$/i });

  await user.type(input, ' Rick ');
  await user.click(button);

  await waitFor(() => {
    expect(localStorage.getItem('searchTerm')).toBe('Rick');
  });

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  const secondCall = fetchMock.mock.calls[1];
  const requestUrl = getRequestUrl(secondCall[0]);

  expect(requestUrl).toContain('name=Rick');
});

test('uses cached page data when returning to a previously loaded page', async () => {
  const user = userEvent.setup();
  const fetchMock = mockCharactersFetch();

  renderApp();

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);

  await user.click(screen.getByRole('button', { name: '2' }));

  expect(await screen.findByText(/birdperson/i)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);

  await user.click(screen.getByRole('button', { name: '1' }));

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('refresh results button sends a new request for current page', async () => {
  const user = userEvent.setup();
  const fetchMock = mockCharactersFetch();

  renderApp();

  expect(await screen.findByText(/alien rick/i)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);

  await user.click(screen.getByRole('button', { name: /refresh results/i }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
