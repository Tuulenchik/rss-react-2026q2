import type {
  CharacterApiItem,
  CharacterDetails,
  CharacterDetailsApiItem,
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

function mapCharacterToDetails(
  character: CharacterDetailsApiItem
): CharacterDetails {
  return {
    id: String(character.id),
    name: character.name,
    status: character.status,
    species: character.species,
    gender: character.gender,
    origin: character.origin.name,
    location: character.location.name,
    image: character.image,
    episodesCount: character.episode.length,
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
