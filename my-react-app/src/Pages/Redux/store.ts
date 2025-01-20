import { combineReducers, configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../../Pages/Redux/slices/recipeReducer"; // Import the recipe reducer
import { AuthReducer } from "./AuthReducer";
import AdminReducer from "./slices/AdminReducer";

// Combine all reducers
const rootReducer = combineReducers({
  auth: AuthReducer,
  recipes: recipeReducer, // Add the recipe reducer here
  admin: AdminReducer,    // Add the admin reducer here
});

// Configure the store
export const recipeSystem = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export type RootState = ReturnType<typeof recipeSystem.getState>;
export type AppDispatch = typeof recipeSystem.dispatch;

export default recipeSystem;
