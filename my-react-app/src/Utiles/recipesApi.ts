/**
 * @deprecated This file is deprecated. Use the new consolidated ApiService instead.
 * Import: import ApiService from '../Service/ApiService';
 * 
 * Migration guide:
 * - fetchCategories() -> ApiService.recipes.getAllCategories()
 * - fetchRecipes() -> ApiService.recipes.getAllRecipes()
 * - createRecipe(data) -> ApiService.recipes.createRecipe(data)
 */

import ApiService from '../Service/ApiService';

// Legacy exports for backward compatibility
export const fetchCategories = async () => {
  const response = await ApiService.recipes.getAllCategories();
  return response.data;
};

export const fetchRecipes = async () => {
  const response = await ApiService.recipes.getAllRecipes();
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRecipe = async (recipeData: any) => {
  const response = await ApiService.recipes.createRecipe(recipeData);
  return response.data;
};
