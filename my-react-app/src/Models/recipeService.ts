// src/Components/Services/recipeService.ts

import { getToken } from "../Utiles/authService";
import { Recipe } from "./Recipe";

/**
 * Fetches all recipes from the backend.
 * @returns Promise resolving to an array of Recipe objects.
 * @throws Error if the fetch operation fails.
 */
export async function fetchRecipes(): Promise<Recipe[]> {
  const token = getToken();
  const response = await fetch('/api/recipes', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  const data: Recipe[] = await response.json();
  return data;
}

/**
 * Fetches a single recipe by its ID.
 * @param id - The ID of the recipe to fetch.
 * @returns Promise resolving to a Recipe object.
 * @throws Error if the fetch operation fails.
 */
export async function fetchRecipeById(id: number): Promise<Recipe> {
  const token = getToken();
  const response = await fetch(`/api/recipes/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipe details');
  }

  const data: Recipe = await response.json();
  return data;
}
