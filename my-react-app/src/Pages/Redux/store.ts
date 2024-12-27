// src/Pages/Redux/store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "./AuthReducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  // Add other reducers if necessary
});

export const recipeSystem = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// 1) Derive the store’s root state type:
export type RootState = ReturnType<typeof recipeSystem.getState>;

// 2) Derive the store’s dispatch type:
export type AppDispatch = typeof recipeSystem.dispatch;

export default rootReducer;
