export type Item = {
  id: string;
  name: string;
  description: string;
};

export type CharacterApiItem = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
};

export type CharactersApiResponse = {
  info: {
    pages: number;
  };
  results: CharacterApiItem[];
};
