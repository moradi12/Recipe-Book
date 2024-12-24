// Utiles/api/recipes.ts
import axios, { AxiosError } from 'axios';
import { APIRecipeResponse, RecipeResponse } from '../../Models/Recipe';
import apiClient from "../apiClient";

// Mapping function
const mapAPIRecipeToRecipe = (apiData: APIRecipeResponse): RecipeResponse => {
  console.log(apiData); // Debugging: Log the API response
  return {
    id: apiData.id,
    name: apiData.title, // Assuming 'title' serves as 'name'
    title: apiData.title,
    description: apiData.description,
    ingredients: apiData.ingredients,
    preparationSteps: apiData.preparationSteps,
    cookingTime: apiData.cookingTime,
    servings: apiData.servings,
    dietaryInfo: apiData.dietaryInfo,
    containsGluten: apiData.containsGluten,
    status: apiData.status,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    createdBy: {
      id: 0,
      username: apiData.createdByUsername,
      email: '',
    },
    categories: apiData.categories ? apiData.categories.map(cat => ({ id: cat.id, name: cat.name })) : [],
  };
};

// Fetch recipe by ID
export const getRecipeById = async (id: number): Promise<RecipeResponse> => {
  const response = await axios.get<APIRecipeResponse>(`/api/recipes/${id}`);
  return mapAPIRecipeToRecipe(response.data);
};

// Fetch paginated recipes
export const getPaginatedRecipes = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'id',
  sortDirection: string = 'asc'
): Promise<{ content: RecipeResponse[]; totalPages: number; totalElements: number }> => {
  try {
    const response = await apiClient.get<{ content: APIRecipeResponse[]; totalPages: number; totalElements: number }>('', {
      params: { page, size, sortBy, sortDirection },
    });

    // Validate response content
    if (!response.data.content) {
      throw new Error('No recipes found');
    }

    // Map API response to internal structure
    return {
      content: response.data.content.map(mapAPIRecipeToRecipe),
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw new Error('Failed to fetch paginated recipes');
  }
};
