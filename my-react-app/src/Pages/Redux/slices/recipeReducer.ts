import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../../Models/Recipe';

// Define the initial state
interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

// Create a slice for recipes
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    fetchRecipesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRecipesSuccess(state, action: PayloadAction<Recipe[]>) {
      state.loading = false;
      state.error = null;
      state.recipes = action.payload;
    },
    fetchRecipesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.recipes.push(action.payload);
    },
    deleteRecipe(state, action: PayloadAction<number>) {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
  },
});

// Export actions generated from the slice
export const {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  addRecipe,
  deleteRecipe,
} = recipeSlice.actions;

// Export the reducer function
export default recipeSlice.reducer;
