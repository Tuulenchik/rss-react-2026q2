import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../features/selectedItems/selectedItemsSlice';
import formSubmissionsReducer from '../features/formSubmissions/formSubmissionsSlice';
import { charactersApi } from '../services/charactersApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    formSubmissions: formSubmissionsReducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
