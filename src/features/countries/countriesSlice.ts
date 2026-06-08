import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../store/store';

type CountriesState = {
  countries: string[];
};

const initialState: CountriesState = {
  countries: [
    'Georgia',
    'Armenia',
    'Azerbaijan',
    'Turkey',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Portugal',
    'Netherlands',
    'Poland',
    'Czech Republic',
    'United Kingdom',
    'United States',
    'Canada',
    'Japan',
    'South Korea',
    'Australia',
  ],
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const selectCountries = (state: RootState) => state.countries.countries;

export default countriesSlice.reducer;
