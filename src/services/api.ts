import type {
  CharacterApiItem,
  CharactersApiResponse,
  Item,
} from '../types/item';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

function mapCharacterToItem(character: CharacterApiItem): Item {
  return {
    id: String(character.id),
    name: character.name,
    description: `${character.status} ${character.species}, ${character.gender}. Origin: ${character.origin.name}. Location: ${character.location.name}.`,
  };
}

export async function fetchCharacters(searchTerm = ''): Promise<Item[]> {
  const url = new URL(API_BASE_URL);

  if (searchTerm.trim()) {
    url.searchParams.set('name', searchTerm.trim());
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load characters');
  }

  const data: CharactersApiResponse = await response.json();

  return data.results.map(mapCharacterToItem);
}
