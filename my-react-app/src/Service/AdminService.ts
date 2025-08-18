/**
 * AdminService - Centralized admin operations
 * All admin functionality now consolidated in RecipeService and UserService
 * This file is kept for backward compatibility but delegates to the main services
 */

import RecipeService from './RecipeService';
import UserService from './UserService';
import { RecipeResponse, User } from '../Models/Recipe';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';

// ===========================
// LEGACY FUNCTION EXPORTS (for backward compatibility)
// ===========================

export async function getAllUsers(): Promise<User[]> {
  const response = await UserService.getAllUsers();
  return response.data;
}

export async function getPendingRecipes(): Promise<RecipeResponse[]> {
  const response = await RecipeService.getPendingRecipes();
  return response.data;
}

export async function approveRecipe(id: number): Promise<{ message: string }> {
  const response = await RecipeService.approveRecipe(id);
  return response.data;
}

export async function rejectRecipe(id: number): Promise<{ message: string }> {
  const response = await RecipeService.rejectRecipe(id);
  return response.data;
}

export async function addRecipe(recipeData: RecipeCreateRequest): Promise<{ message: string; recipeId: string }> {
  const response = await RecipeService.addRecipeAsAdmin(recipeData);
  return response.data;
}

export async function getAllRecipes(
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt'
): Promise<unknown> {
  const response = await RecipeService.getAllRecipesAsAdmin(page, size, sortBy);
  return response.data;
}

export async function updateRecipe(
  id: number,
  recipeData: RecipeCreateRequest
): Promise<{ message: string; recipeId: string }> {
  const response = await RecipeService.updateRecipeAsAdmin(id, recipeData);
  return response.data;
}

export async function deleteRecipe(id: number): Promise<{ message: string }> {
  const response = await RecipeService.deleteRecipeAsAdmin(id);
  return response.data;
}

// ===========================
// DEFAULT EXPORT (for backward compatibility)
// ===========================
export default {
  getPendingRecipes,
  approveRecipe,
  rejectRecipe,
  addRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  getAllUsers
};
