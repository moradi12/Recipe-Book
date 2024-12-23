// src/Redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
    // Add other reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store as default
export default store;
