import type {
  CharacterDetails,
  CharacterDetailsApiItem,
  CharactersApiResponse,
  Item,
} from '../types/item';
import { mapCharacterToItem, mapCharacterToDetails } from './characterMappers';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

type FetchCharactersResult = {
  items: Item[];
  totalPages: number;
};

export async function fetchCharacters(
  searchTerm = '',
  page = 1
): Promise<FetchCharactersResult> {
  const url = new URL(API_BASE_URL);

  url.searchParams.set('page', String(page));

  if (searchTerm.trim()) {
    url.searchParams.set('name', searchTerm.trim());
  }

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('No characters found');
  }

  if (!response.ok) {
    throw new Error('Failed to load characters');
  }

  const data: CharactersApiResponse = await response.json();

  return {
    items: data.results.map(mapCharacterToItem),
    totalPages: data.info.pages,
  };
}

export async function fetchCharacterById(
  characterId: string
): Promise<CharacterDetails> {
  const trimmedCharacterId = characterId.trim();

  if (!trimmedCharacterId) {
    throw new Error('Character id is required');
  }

  const response = await fetch(`${API_BASE_URL}/${trimmedCharacterId}`);

  if (response.status === 404) {
    throw new Error('Character not found');
  }

  if (!response.ok) {
    throw new Error('Failed to load character');
  }

  const data: CharacterDetailsApiItem = await response.json();

  return mapCharacterToDetails(data);
}
