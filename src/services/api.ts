import type {
  CharacterApiItem,
  CharactersApiResponse,
  Item,
} from '../types/item';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

type FetchCharactersResult = {
  items: Item[];
  totalPages: number;
};

function mapCharacterToItem(character: CharacterApiItem): Item {
  return {
    id: String(character.id),
    name: character.name,
    description: `${character.status} ${character.species}, ${character.gender}. Origin: ${character.origin.name}. Location: ${character.location.name}.`,
  };
}

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
