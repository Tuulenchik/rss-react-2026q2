import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selectedItems/selectedItemsSlice';
import { charactersApi } from '../services/charactersApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
