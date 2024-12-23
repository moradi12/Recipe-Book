import axios, { AxiosInstance } from "axios";
import { Recipe, RecipeResponse } from "../Models/Recipe";
import { getToken } from "../Utiles/authService"; // Import getToken from authService

// Base URL of the backend API
const BASE_URL = "http://localhost:8080/api/recipes";

// Create an Axios instance with the base URL and default headers
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const RecipeService = {
  // Create a new recipe
  createRecipe: async (recipe: Partial<Recipe>): Promise<RecipeResponse | null> => {
    try {
      const token = getToken();
      const response = await axiosInstance.post<RecipeResponse>("/", recipe, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating recipe:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  },

  // Fetch all recipes
  getAllRecipes: async (): Promise<RecipeResponse[] | null> => {
    try {
      const token = getToken();
      const response = await axiosInstance.get<RecipeResponse[]>("/", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching recipes:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  },

  // Update an existing recipe
  updateRecipe: async (id: number, recipe: Partial<Recipe>): Promise<RecipeResponse | null> => {
    try {
      const token = getToken();
      const response = await axiosInstance.put<RecipeResponse>(`/${id}`, recipe, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating recipe:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  },

  // Delete a recipe
  deleteRecipe: async (id: number): Promise<boolean> => {
    try {
      const token = getToken();
      await axiosInstance.delete(`/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting recipe:", error.response ? error.response.data : error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  },
};
