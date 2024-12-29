import { combineReducers, configureStore } from '@reduxjs/toolkit';
import recipeReducer from '../../Pages/Redux/slices/RecipeReducer'; // Import the recipe reducer
import { AuthReducer } from './AuthReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: AuthReducer,
  recipes: recipeReducer, // Add the recipe reducer here
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
