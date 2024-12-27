// src/Pages/Redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { AuthReducer } from './AuthReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: AuthReducer,
  // Add other reducers here (e.g., recipesReducer)
});

// Configure the store
export const recipeSystem = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for flexibility
    }),
});

// Derive the store’s root state type
export type RootState = ReturnType<typeof recipeSystem.getState>;

// Derive the store’s dispatch type
export type AppDispatch = typeof recipeSystem.dispatch;

// Default export the store
export default recipeSystem;
