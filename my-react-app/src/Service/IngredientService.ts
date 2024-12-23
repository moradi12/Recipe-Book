// Services/IngredientService.ts

import axios from 'axios';
import { Ingredient } from '../Models/Ingredient';
import { BaseService } from './BaseService';

export class IngredientService extends BaseService {
  /**
   * Fetches ingredients for a specific recipe.
   * @param recipeId - The ID of the recipe.
   * @returns A Promise that resolves to an array of Ingredients.
   */
  async fetchIngredients(recipeId: string): Promise<Ingredient[]> {
    try {
      const response = await this.axiosInstance.get<Ingredient[]>(`/recipes/${recipeId}/ingredients`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching ingredients:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch ingredients.');
      } else {
        throw new Error('An unexpected error occurred while fetching ingredients.');
      }
    }
  }

  /**
   * Adds a new ingredient to a recipe.
   * @param ingredient - The Ingredient object to add.
   * @returns A Promise that resolves to the added Ingredient.
   */
  async addIngredient(ingredient: Ingredient): Promise<Ingredient> {
    try {
      const response = await this.axiosInstance.post<Ingredient>(`/recipes/${ingredient.recipeId}/ingredients`, ingredient);
      return response.data;
    } catch (error: unknown) {
      console.error('Error adding ingredient:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add ingredient.');
      } else {
        throw new Error('An unexpected error occurred while adding ingredient.');
      }
    }
  }
}
