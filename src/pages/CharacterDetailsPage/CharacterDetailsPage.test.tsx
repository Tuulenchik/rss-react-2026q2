import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, expect, test, vi } from 'vitest';
import { fetchCharacterById } from '../../services/api';
import CharacterDetailsPage from './CharacterDetailsPage';

vi.mock('../../services/api', () => ({
  fetchCharacterById: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderCharacterDetailsPage(route = '/page/2/details/1') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/page/:pageNumber/details/:characterId"
          element={<CharacterDetailsPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

test('shows loader and renders fetched character details', async () => {
  vi.mocked(fetchCharacterById).mockResolvedValue({
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: 'Earth',
    location: 'Citadel of Ricks',
    image: 'https://example.com/rick.png',
    episodesCount: 2,
  });

  renderCharacterDetailsPage();

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', { name: /rick sanchez/i })
  ).toBeInTheDocument();

  expect(fetchCharacterById).toHaveBeenCalledWith('1');
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

test('renders error message when character details request fails', async () => {
  vi.mocked(fetchCharacterById).mockRejectedValue(
    new Error('Character not found')
  );

  renderCharacterDetailsPage('/page/3/details/999');

  expect(await screen.findByText(/character not found/i)).toBeInTheDocument();
  expect(fetchCharacterById).toHaveBeenCalledWith('999');

  expect(screen.getByRole('link', { name: /close/i })).toHaveAttribute(
    'href',
    '/page/3'
  );
});
