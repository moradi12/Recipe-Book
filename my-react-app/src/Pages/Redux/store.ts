import { configureStore } from "@reduxjs/toolkit";
import unifiedRecipeReducer from './slices/unifiedRecipeSlice';
import unifiedAuthReducer from './slices/unifiedAuthSlice';

// Configure the store with unified reducers
export const recipeSystem = configureStore({
  reducer: {
    auth: unifiedAuthReducer,
    recipes: unifiedRecipeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof recipeSystem.getState>;
export type AppDispatch = typeof recipeSystem.dispatch;

export default recipeSystem;
