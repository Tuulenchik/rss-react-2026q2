import { type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { ThemeProvider } from '../context/ThemeProvider';
import countriesReducer from '../features/countries/countriesSlice';
import formSubmissionsReducer from '../features/formSubmissions/formSubmissionsSlice';
import selectedItemsReducer from '../features/selectedItems/selectedItemsSlice';
import { charactersApi } from '../services/charactersApi';

type RenderWithProvidersOptions = {
  route?: string;
};

export function setupTestStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      formSubmissions: formSubmissionsReducer,
      countries: countriesReducer,
      [charactersApi.reducerPath]: charactersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(charactersApi.middleware),
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderWithProvidersOptions = {}
) {
  const store = setupTestStore();

  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
  };
}
