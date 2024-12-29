import { RecipeResponse } from "../../Models/Recipe";
import { AdminActionType } from "./AdminActionType";

export const addRecipeAction = (recipeData: RecipeResponse) => ({
  type: AdminActionType.addRecipe,
  payload: recipeData,
});

export const deleteRecipeAction = (recipeId: number) => ({
  type: AdminActionType.deleteRecipe,
  payload: recipeId,
});

export const updateRecipeAction = (recipeData: RecipeResponse) => ({
  type: AdminActionType.updateRecipe,
  payload: recipeData,
});

export const getRecipeListAction = () => ({
  type: AdminActionType.getRecipeList,
});
