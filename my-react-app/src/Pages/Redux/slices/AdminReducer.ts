// AdminReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeResponse } from '../../../Models/Recipe';

interface AdminState {
  pendingRecipes: RecipeResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  pendingRecipes: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchPendingRecipesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPendingRecipesSuccess(state, action: PayloadAction<RecipeResponse[]>) {
      state.pendingRecipes = action.payload;
      state.loading = false;
    },
    fetchPendingRecipesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // You can add more admin-related reducers here (e.g., for approval, rejection, etc.)
  },
});

// Export reducer actions to use in your action creators if needed
export const {
  fetchPendingRecipesRequest,
  fetchPendingRecipesSuccess,
  fetchPendingRecipesFailure,
} = adminSlice.actions;

// Export the admin reducer as default export
export default adminSlice.reducer;
