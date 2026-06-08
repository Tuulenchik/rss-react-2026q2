import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Route, Routes } from 'react-router';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import type { CharacterDetailsApiItem } from '../../types/item';
import CharacterDetailsPage from './CharacterDetailsPage';

const characterResponse: CharacterDetailsApiItem = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  origin: {
    name: 'Earth',
  },
  location: {
    name: 'Citadel of Ricks',
  },
  image: 'https://example.com/rick.png',
  episode: ['episode-1', 'episode-2'],
};

function mockCharacterFetch(status = 200) {
  const fetchMock = vi.fn<typeof fetch>();

  fetchMock.mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(characterResponse), {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    )
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

function renderCharacterDetailsPage(route = '/page/2/details/1') {
  return renderWithProviders(
    <Routes>
      <Route
        path="/page/:pageNumber/details/:characterId"
        element={<CharacterDetailsPage />}
      />
    </Routes>,
    { route }
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('renders fetched character details', async () => {
  const fetchMock = mockCharacterFetch();

  renderCharacterDetailsPage();

  expect(
    await screen.findByRole('heading', { name: /rick sanchez/i })
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Alive')).toBeInTheDocument();
  expect(screen.getByText('Human')).toBeInTheDocument();
  expect(screen.getByText('Male')).toBeInTheDocument();
  expect(screen.getByText('Earth')).toBeInTheDocument();
  expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();

  expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
    'src',
    'https://example.com/rick.png'
  );

  expect(screen.getByRole('link', { name: /close/i })).toHaveAttribute(
    'href',
    '/page/2'
  );
});

test('shows loader while character details are loading', async () => {
  let resolveRequest: ((response: Response) => void) | undefined;

  const fetchMock = vi.fn<typeof fetch>().mockImplementation(
    () =>
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      })
  );

  vi.stubGlobal('fetch', fetchMock);

  renderCharacterDetailsPage();

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  resolveRequest?.(
    new Response(JSON.stringify(characterResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

  expect(
    await screen.findByRole('heading', { name: /rick sanchez/i })
  ).toBeInTheDocument();
});

test('renders error message when character details request fails', async () => {
  mockCharacterFetch(404);

  renderCharacterDetailsPage('/page/3/details/999');

  expect(await screen.findByText(/character not found/i)).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /close/i })).toHaveAttribute(
    'href',
    '/page/3'
  );
});

test('refresh details button sends a new request', async () => {
  const user = userEvent.setup();
  const fetchMock = mockCharacterFetch();

  renderCharacterDetailsPage();

  expect(
    await screen.findByRole('heading', { name: /rick sanchez/i })
  ).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(1);

  await user.click(screen.getByRole('button', { name: /refresh details/i }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
