/**
 * @deprecated This file is deprecated. Use the new consolidated ApiService instead.
 * Import: import ApiService from '../Service/ApiService';
 * 
 * Migration guide:
 * - fetchRecipes() -> ApiService.recipes.getAllRecipes().then(r => r.data)
 * - fetchRecipeById(id) -> ApiService.recipes.getRecipeById(id).then(r => r.data)
 */

import ApiService from '../Service/ApiService';
import { Recipe } from './Recipe';

// Legacy exports for backward compatibility
export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await ApiService.recipes.getAllRecipes();
  return response.data as unknown as Recipe[];
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const response = await ApiService.recipes.getRecipeById(id);
  return response.data as unknown as Recipe;
}
