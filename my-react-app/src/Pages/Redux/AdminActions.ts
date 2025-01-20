// adminActions.ts
import { RecipeResponse } from "../../Models/Recipe";
import { AdminActionType } from "./AdminActionType";

/* ------------------------ Synchronous Actions ------------------------ */
export const addRecipeAction = (recipeData: RecipeResponse) => ({
  type: AdminActionType.ADD_RECIPE,
  payload: recipeData,
});

export const deleteRecipeAction = (recipeId: number) => ({
  type: AdminActionType.DELETE_RECIPE,
  payload: recipeId,
});

export const updateRecipeAction = (recipeData: RecipeResponse) => ({
  type: AdminActionType.UPDATE_RECIPE,
  payload: recipeData,
});

export const getRecipeListAction = () => ({
  type: AdminActionType.GET_RECIPE_LIST,
});

/* ------------------------ Async Actions ------------------------ */
// 1. Pending Recipes Fetch Actions
export const fetchPendingRecipesRequest = () => ({
  type: AdminActionType.FETCH_PENDING_RECIPES_REQUEST,
});

export const fetchPendingRecipesSuccess = (recipes: RecipeResponse[]) => ({
  type: AdminActionType.FETCH_PENDING_RECIPES_SUCCESS,
  payload: recipes,
});

export const fetchPendingRecipesFailure = (error: string) => ({
  type: AdminActionType.FETCH_PENDING_RECIPES_FAILURE,
  payload: error,
});

// 2. Approve Recipe Actions
export const approveRecipeRequest = (recipeId: number) => ({
  type: AdminActionType.APPROVE_RECIPE_REQUEST,
  payload: recipeId,
});

export const approveRecipeSuccess = (recipeData: RecipeResponse) => ({
  type: AdminActionType.APPROVE_RECIPE_SUCCESS,
  payload: recipeData,
});

export const approveRecipeFailure = (error: string) => ({
  type: AdminActionType.APPROVE_RECIPE_FAILURE,
  payload: error,
});

// 3. Reject Recipe Actions
export const rejectRecipeRequest = (recipeId: number) => ({
  type: AdminActionType.REJECT_RECIPE_REQUEST,
  payload: recipeId,
});

export const rejectRecipeSuccess = (recipeData: RecipeResponse) => ({
  type: AdminActionType.REJECT_RECIPE_SUCCESS,
  payload: recipeData,
});

export const rejectRecipeFailure = (error: string) => ({
  type: AdminActionType.REJECT_RECIPE_FAILURE,
  payload: error,
});

// 4. Add Recipe Async Actions
export const addRecipeRequest = (recipeData: RecipeResponse) => ({
  type: AdminActionType.ADD_RECIPE_REQUEST,
  payload: recipeData,
});

export const addRecipeSuccess = (recipeData: RecipeResponse) => ({
  type: AdminActionType.ADD_RECIPE_SUCCESS,
  payload: recipeData,
});

export const addRecipeFailure = (error: string) => ({
  type: AdminActionType.ADD_RECIPE_FAILURE,
  payload: error,
});

// 5. Fetch All Recipes Actions
export const fetchAllRecipesRequest = () => ({
  type: AdminActionType.FETCH_ALL_RECIPES_REQUEST,
});

export const fetchAllRecipesSuccess = (recipes: RecipeResponse[]) => ({
  type: AdminActionType.FETCH_ALL_RECIPES_SUCCESS,
  payload: recipes,
});

export const fetchAllRecipesFailure = (error: string) => ({
  type: AdminActionType.FETCH_ALL_RECIPES_FAILURE,
  payload: error,
});

// 6. Update Recipe Async Actions
export const updateRecipeRequest = (recipeData: RecipeResponse) => ({
  type: AdminActionType.UPDATE_RECIPE_REQUEST,
  payload: recipeData,
});

export const updateRecipeSuccess = (recipeData: RecipeResponse) => ({
  type: AdminActionType.UPDATE_RECIPE_SUCCESS,
  payload: recipeData,
});

export const updateRecipeFailure = (error: string) => ({
  type: AdminActionType.UPDATE_RECIPE_FAILURE,
  payload: error,
});

// 7. Delete Recipe Async Actions
export const deleteRecipeRequest = (recipeId: number) => ({
  type: AdminActionType.DELETE_RECIPE_REQUEST,
  payload: recipeId,
});

export const deleteRecipeSuccess = (recipeId: number) => ({
  type: AdminActionType.DELETE_RECIPE_SUCCESS,
  payload: recipeId,
});

export const deleteRecipeFailure = (error: string) => ({
  type: AdminActionType.DELETE_RECIPE_FAILURE,
  payload: error,
});
