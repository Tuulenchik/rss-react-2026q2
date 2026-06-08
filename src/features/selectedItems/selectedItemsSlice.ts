import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SelectedItem = {
  id: string;
  name: string;
  description: string;
  detailsPath: string;
};

type SelectedItemsState = {
  itemsById: Record<string, SelectedItem>;
};

const initialState: SelectedItemsState = {
  itemsById: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem: (state, action: PayloadAction<SelectedItem>) => {
      const item = action.payload;

      if (state.itemsById[item.id]) {
        delete state.itemsById[item.id];
      } else {
        state.itemsById[item.id] = item;
      }
    },
    clearSelectedItems: (state) => {
      state.itemsById = {};
    },
  },
});

export const { toggleSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
