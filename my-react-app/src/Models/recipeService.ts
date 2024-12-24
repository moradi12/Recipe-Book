// src/Components/Services/recipeService.ts

import { getToken } from "../Utiles/authService";
import { Recipe } from "./Recipe";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'An error occurred while fetching data');
  }
  return response.json();
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const token = getToken();
  const response = await fetch('/api/recipes', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Recipe[]>(response);
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const token = getToken();
  const response = await fetch(`/api/recipes/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Recipe>(response);
}
