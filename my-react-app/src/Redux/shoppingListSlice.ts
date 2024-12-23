// src/Redux/shoppingListSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingList } from '../Models/ShoppingList';
import { ShoppingListService } from '../Service/ShoppingListService';

interface ShoppingListState {
  lists: ShoppingList[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  lists: [],
  loading: false,
  error: null,
};

export const fetchShoppingLists = createAsyncThunk<
  ShoppingList[], // Return type
  string,         // Argument type (userId)
  { rejectValue: string } // ThunkAPI config
>(
  'shoppingList/fetchShoppingLists',
  async (userId: string, { rejectWithValue }) => {
    const service = new ShoppingListService();
    try {
      const lists = await service.fetchShoppingLists(userId);
      return lists;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

/**
 * Adds a new shopping list.
 */
export const addShoppingList = createAsyncThunk<
  ShoppingList, // Return type
  Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt' | 'items'>, // Argument type
  { rejectValue: string } // ThunkAPI config
>(
  'shoppingList/addShoppingList',
  async (newList, { rejectWithValue }) => {
    const service = new ShoppingListService();
    try {
      const createdList = await service.createShoppingList(newList);
      return createdList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to add shopping list.');
    }
  }
);

/**
 * Updates an existing shopping list.
 */
export const updateShoppingList = createAsyncThunk<
  ShoppingList, // Return type
  ShoppingList, // Argument type
  { rejectValue: string } // ThunkAPI config
>(
  'shoppingList/updateShoppingList',
  async (updatedList, { rejectWithValue }) => {
    const service = new ShoppingListService();
    try {
      const updated = await service.updateShoppingList(updatedList);
      return updated;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update shopping list.');
    }
  }
);

/**
 * Deletes a shopping list by ID.
 */
export const deleteShoppingList = createAsyncThunk<
  string, // Return type (listId)
  string, // Argument type (listId)
  { rejectValue: string } // ThunkAPI config
>(
  'shoppingList/deleteShoppingList',
  async (listId, { rejectWithValue }) => {
    const service = new ShoppingListService();
    try {
      await service.deleteShoppingList(listId);
      return listId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete shopping list.');
    }
  }
);

// Create the slice
const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    // Define synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchShoppingLists
      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingList[]>) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle addShoppingList
      .addCase(addShoppingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShoppingList.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(addShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle updateShoppingList
      .addCase(updateShoppingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShoppingList.fulfilled, (state, action: PayloadAction<ShoppingList>) => {
        state.loading = false;
        state.lists = state.lists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        );
      })
      .addCase(updateShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle deleteShoppingList
      .addCase(deleteShoppingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShoppingList.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer to be included in the store
export default shoppingListSlice.reducer;
