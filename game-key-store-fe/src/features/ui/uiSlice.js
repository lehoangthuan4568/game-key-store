// src/features/ui/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
});

export const { toggleCart, openCart, closeCart } = uiSlice.actions;

export const selectIsCartOpen = (state) => state.ui.isCartOpen;

export default uiSlice.reducer;