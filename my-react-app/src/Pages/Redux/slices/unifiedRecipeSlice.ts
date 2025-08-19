import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeResponse } from '../../../Models/Recipe';
import RecipeService from '../../../Service/RecipeService';

interface UnifiedRecipeState {
  // User recipes
  recipes: RecipeResponse[];
  myRecipes: RecipeResponse[];
  
  // Admin recipes
  pendingRecipes: RecipeResponse[];
  allRecipes: RecipeResponse[];
  
  // Loading states
  loading: boolean;
  adminLoading: boolean;
  
  // Error states
  error: string | null;
  adminError: string | null;
  
  // Pagination
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

const initialState: UnifiedRecipeState = {
  recipes: [],
  myRecipes: [],
  pendingRecipes: [],
  allRecipes: [],
  loading: false,
  adminLoading: false,
  error: null,
  adminError: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

// Async thunks for user operations
export const fetchRecipes = createAsyncThunk<
  RecipeResponse[],
  void,
  { rejectValue: string }
>(
  'recipes/fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await RecipeService.getAllRecipes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchMyRecipes = createAsyncThunk<
  RecipeResponse[],
  void,
  { rejectValue: string }
>(
  'recipes/fetchMyRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await RecipeService.getMyRecipes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my recipes');
    }
  }
);

export const createRecipe = createAsyncThunk<
  RecipeResponse,
  any,
  { rejectValue: string }
>(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await RecipeService.createRecipe(recipeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk<
  RecipeResponse,
  { id: number; recipe: RecipeResponse },
  { rejectValue: string }
>(
  'recipes/updateRecipe',
  async ({ id, recipe }, { rejectWithValue }) => {
    try {
      const response = await RecipeService.updateRecipe(id, recipe);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await RecipeService.deleteRecipe(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe');
    }
  }
);

// Async thunks for admin operations
export const fetchPendingRecipes = createAsyncThunk<
  RecipeResponse[],
  void,
  { rejectValue: string }
>(
  'recipes/fetchPendingRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await RecipeService.getPendingRecipes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending recipes');
    }
  }
);

export const approveRecipe = createAsyncThunk<
  { id: number; message: string },
  number,
  { rejectValue: string }
>(
  'recipes/approveRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await RecipeService.approveRecipe(id);
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve recipe');
    }
  }
);

export const rejectRecipe = createAsyncThunk<
  { id: number; message: string },
  number,
  { rejectValue: string }
>(
  'recipes/rejectRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await RecipeService.rejectRecipe(id);
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject recipe');
    }
  }
);

export const fetchAllRecipesAsAdmin = createAsyncThunk<
  any,
  { page?: number; size?: number; sortBy?: string },
  { rejectValue: string }
>(
  'recipes/fetchAllRecipesAsAdmin',
  async ({ page = 0, size = 10, sortBy = 'createdAt' }, { rejectWithValue }) => {
    try {
      const response = await RecipeService.getAllRecipesAsAdmin(page, size, sortBy);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all recipes');
    }
  }
);

export const addRecipeAsAdmin = createAsyncThunk<
  { message: string; recipeId: string },
  any,
  { rejectValue: string }
>(
  'recipes/addRecipeAsAdmin',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await RecipeService.addRecipeAsAdmin(recipeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add recipe as admin');
    }
  }
);

export const updateRecipeAsAdmin = createAsyncThunk<
  { message: string; recipeId: string },
  { id: number; recipeData: any },
  { rejectValue: string }
>(
  'recipes/updateRecipeAsAdmin',
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await RecipeService.updateRecipeAsAdmin(id, recipeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update recipe as admin');
    }
  }
);

export const deleteRecipeAsAdmin = createAsyncThunk<
  { id: number; message: string },
  number,
  { rejectValue: string }
>(
  'recipes/deleteRecipeAsAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await RecipeService.deleteRecipeAsAdmin(id);
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe as admin');
    }
  }
);

const unifiedRecipeSlice = createSlice({
  name: 'unifiedRecipes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.adminError = null;
    },
    clearRecipes: (state) => {
      state.recipes = [];
    },
    clearMyRecipes: (state) => {
      state.myRecipes = [];
    },
    clearPendingRecipes: (state) => {
      state.pendingRecipes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recipes';
      })

      // Fetch my recipes
      .addCase(fetchMyRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecipes = action.payload;
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch my recipes';
      })

      // Create recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecipes.push(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create recipe';
      })

      // Update recipe
      .addCase(updateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myRecipes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.myRecipes[index] = action.payload;
        }
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update recipe';
      })

      // Delete recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecipes = state.myRecipes.filter(r => r.id !== action.payload);
        state.recipes = state.recipes.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete recipe';
      })

      // Admin: Fetch pending recipes
      .addCase(fetchPendingRecipes.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchPendingRecipes.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.pendingRecipes = action.payload;
      })
      .addCase(fetchPendingRecipes.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to fetch pending recipes';
      })

      // Admin: Approve recipe
      .addCase(approveRecipe.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(approveRecipe.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.pendingRecipes = state.pendingRecipes.filter(r => r.id !== action.payload.id);
      })
      .addCase(approveRecipe.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to approve recipe';
      })

      // Admin: Reject recipe
      .addCase(rejectRecipe.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(rejectRecipe.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.pendingRecipes = state.pendingRecipes.filter(r => r.id !== action.payload.id);
      })
      .addCase(rejectRecipe.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to reject recipe';
      })

      // Admin: Fetch all recipes
      .addCase(fetchAllRecipesAsAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAllRecipesAsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.allRecipes = action.payload.content || action.payload;
        if (action.payload.totalPages !== undefined) {
          state.pagination = {
            page: action.payload.number || 0,
            size: action.payload.size || 10,
            totalPages: action.payload.totalPages,
            totalElements: action.payload.totalElements || 0,
          };
        }
      })
      .addCase(fetchAllRecipesAsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to fetch all recipes';
      })

      // Admin: Add recipe
      .addCase(addRecipeAsAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(addRecipeAsAdmin.fulfilled, (state) => {
        state.adminLoading = false;
      })
      .addCase(addRecipeAsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to add recipe';
      })

      // Admin: Update recipe
      .addCase(updateRecipeAsAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(updateRecipeAsAdmin.fulfilled, (state) => {
        state.adminLoading = false;
      })
      .addCase(updateRecipeAsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to update recipe';
      })

      // Admin: Delete recipe
      .addCase(deleteRecipeAsAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(deleteRecipeAsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.allRecipes = state.allRecipes.filter(r => r.id !== action.payload.id);
        state.pendingRecipes = state.pendingRecipes.filter(r => r.id !== action.payload.id);
      })
      .addCase(deleteRecipeAsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload || 'Failed to delete recipe';
      });
  },
});

export const { clearError, clearRecipes, clearMyRecipes, clearPendingRecipes } = unifiedRecipeSlice.actions;
export default unifiedRecipeSlice.reducer;