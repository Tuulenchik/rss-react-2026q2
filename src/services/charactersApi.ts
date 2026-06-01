import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CharacterDetails,
  CharacterDetailsApiItem,
  CharactersApiResponse,
  Item,
} from '../types/item';
import { getCacheTtlSeconds } from './cacheTtl';
import { mapCharacterToDetails, mapCharacterToItem } from './characterMappers';

type GetCharactersQueryArgs = {
  searchTerm: string;
  page: number;
};

type GetCharactersResult = {
  items: Item[];
  totalPages: number;
};

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/',
  }),
  keepUnusedDataFor: getCacheTtlSeconds(),
  tagTypes: ['Characters', 'Character'],
  endpoints: (builder) => ({
    getCharacters: builder.query<GetCharactersResult, GetCharactersQueryArgs>({
      query: ({ searchTerm, page }) => ({
        url: 'character',
        params: {
          page,
          ...(searchTerm.trim() ? { name: searchTerm.trim() } : {}),
        },
      }),
      transformResponse: (response: CharactersApiResponse) => ({
        items: response.results.map(mapCharacterToItem),
        totalPages: response.info.pages,
      }),
      providesTags: (_result, _error, { searchTerm, page }) => [
        { type: 'Characters', id: `${searchTerm.trim()}-${page}` },
      ],
    }),

    getCharacterById: builder.query<CharacterDetails, string>({
      query: (characterId) => `character/${characterId.trim()}`,
      transformResponse: (response: CharacterDetailsApiItem) =>
        mapCharacterToDetails(response),
      providesTags: (_result, _error, characterId) => [
        { type: 'Character', id: characterId.trim() },
      ],
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } =
  charactersApi;
