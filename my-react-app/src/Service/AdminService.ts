// src/api/AdminService.ts

import { RecipeResponse, User } from '../Models/Recipe';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';
import axiosJWT from '../Utiles/axiosJWT';

// Base URL for the admin endpoints
const API_BASE_URL = 'http://localhost:8080/api/admin';

export async function getAllUsers(): Promise<User[]> {
  const response = await axiosJWT.get<User[]>(`${API_BASE_URL}/users`);
  return response.data;
}
/**
 * Fetches the list of pending recipes.
 */
export async function getPendingRecipes(): Promise<RecipeResponse[]> {
  const response = await axiosJWT.get<RecipeResponse[]>(`${API_BASE_URL}/recipes/pending`);
  return response.data;
}

/**
 * Approves a recipe with the provided id.
 * @param id The id of the recipe to approve.
 */
export async function approveRecipe(id: number): Promise<{ message: string }> {
  const response = await axiosJWT.put<{ message: string }>(`${API_BASE_URL}/recipes/${id}/approve`);
  return response.data;
}

/**
 * Rejects a recipe with the provided id.
 * @param id The id of the recipe to reject.
 */
export async function rejectRecipe(id: number): Promise<{ message: string }> {
  const response = await axiosJWT.put<{ message: string }>(`${API_BASE_URL}/recipes/${id}/reject`);
  return response.data;
}

/**
 * Adds a new recipe.
 * @param recipeData The data for the new recipe.
 */
export async function addRecipe(recipeData: RecipeCreateRequest): Promise<{ message: string; recipeId: string }> {
  const response = await axiosJWT.post<{ message: string; recipeId: string }>(`${API_BASE_URL}/recipes`, recipeData);
  return response.data;
}

/**
 * Fetches a paginated list of all recipes.
 * @param page The current page number (default 0).
 * @param size The size of the page (default 10).
 * @param sortBy The field to sort by (default 'createdAt').
 */
export async function getAllRecipes(
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt'
): Promise<unknown> {
  const response = await axiosJWT.get(`${API_BASE_URL}/recipes`, {
    params: { page, size, sortBy },
  });
  return response.data;
}

/**
 * Updates an existing recipe.
 * @param id The id of the recipe to update.
 * @param recipeData The updated recipe data.
 */
export async function updateRecipe(
  id: number,
  recipeData: RecipeCreateRequest
): Promise<{ message: string; recipeId: string }> {
  const response = await axiosJWT.put<{ message: string; recipeId: string }>(`${API_BASE_URL}/recipes/${id}`, recipeData);
  return response.data;
}

/**
 * Deletes a recipe by id.
 * @param id The id of the recipe to delete.
 */
export async function deleteRecipe(id: number): Promise<{ message: string }> {
  const response = await axiosJWT.delete<{ message: string }>(`${API_BASE_URL}/recipes/${id}`);
  return response.data;
}

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
