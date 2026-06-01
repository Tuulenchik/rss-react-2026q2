import type {
  CharacterApiItem,
  CharacterDetails,
  CharacterDetailsApiItem,
  Item,
} from '../types/item';

export function mapCharacterToItem(character: CharacterApiItem): Item {
  return {
    id: String(character.id),
    name: character.name,
    description: `${character.status} ${character.species}, ${character.gender}. Origin: ${character.origin.name}. Location: ${character.location.name}.`,
  };
}

export function mapCharacterToDetails(
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
