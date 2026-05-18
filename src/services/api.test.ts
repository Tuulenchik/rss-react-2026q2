import { afterEach, expect, test, vi } from 'vitest';

import { fetchCharacters } from './api';

afterEach(() => {
  vi.restoreAllMocks();
});

test('returns characters from API response', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      info: {
        pages: 1,
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
      ],
    }),
  } as unknown as Response);

  const result = await fetchCharacters('Rick');

  expect(result).toEqual({
    items: [
      {
        id: '1',
        name: 'Alien Rick',
        description:
          'unknown Alien, Male. Origin: unknown. Location: Citadel of Ricks.',
      },
    ],
    totalPages: 1,
  });
});

test('throws error when characters are not found', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: false,
    status: 404,
  } as unknown as Response);

  await expect(fetchCharacters('Unknown')).rejects.toThrow(
    'No characters found'
  );
});

test('throws error when API request fails', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: false,
    status: 500,
  } as unknown as Response);

  await expect(fetchCharacters('Rick')).rejects.toThrow(
    'Failed to load characters'
  );
});
