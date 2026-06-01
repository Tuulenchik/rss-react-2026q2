import { type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/ThemeProvider';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selectedItems/selectedItemsSlice';
import { charactersApi } from '../services/charactersApi';

type RenderWithProvidersOptions = {
  route?: string;
};

export function setupTestStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
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
