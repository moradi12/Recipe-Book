// src/redux/slices/recipeSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeResponse } from '../../../Models/Recipe';
import RecipeService from '../../../Service/RecipeService';

interface RecipeState {
  recipes: RecipeResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

/**
 * Fetch all recipes as an array (NO pagination).
 * If your backend endpoint currently returns a paginated JSON,
 * you could adapt this to handle the paginated structure. 
 */
export const fetchRecipes = createAsyncThunk<RecipeResponse[], void, { rejectValue: string }>(
  'recipes/fetchRecipes',
  async (_, thunkAPI) => {
    try {
      // Calls a method that returns an array of recipes (unpaginated).
      const response = await RecipeService.getAllRecipes(); 
      return response.data; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipes'
      );
    }
  }
);

/**
 * Add a new recipe (create).
 */
export const addRecipe = createAsyncThunk<
  RecipeResponse,
  { recipe: RecipeResponse; token: string },
  { rejectValue: string }
>(
  'recipes/addRecipe',
  async ({ recipe, token }, thunkAPI) => {
    try {
      const response = await RecipeService.createRecipe(recipe, token);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add recipe'
      );
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchRecipes
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<RecipeResponse[]>) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recipes';
      });

    // addRecipe
    builder
      .addCase(addRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecipe.fulfilled, (state, action: PayloadAction<RecipeResponse>) => {
        state.loading = false;
        state.recipes.push(action.payload); // Insert newly created recipe
      })
      .addCase(addRecipe.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add recipe';
      });
  },
});

export default recipeSlice.reducer;
