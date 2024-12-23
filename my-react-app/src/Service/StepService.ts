// Services/StepService.ts

import axios from 'axios';
import { Step } from '../Models/Step';
import { BaseService } from './BaseService';

export class StepService extends BaseService {
  /**
   * Fetches steps (instructions) for a specific recipe.
   * @param recipeId - The ID of the recipe.
   * @returns A Promise that resolves to an array of Steps.
   */
  async fetchSteps(recipeId: string): Promise<Step[]> {
    try {
      const response = await this.axiosInstance.get<Step[]>(`/recipes/${recipeId}/steps`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching steps:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch steps.');
      } else {
        throw new Error('An unexpected error occurred while fetching steps.');
      }
    }
  }

  /**
   * Adds a new step to a recipe.
   * @param step - The Step object to add.
   * @returns A Promise that resolves to the added Step.
   */
  async addStep(step: Step): Promise<Step> {
    try {
      const response = await this.axiosInstance.post<Step>(`/recipes/${step.recipeId}/steps`, step);
      return response.data;
    } catch (error: unknown) {
      console.error('Error adding step:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add step.');
      } else {
        throw new Error('An unexpected error occurred while adding step.');
      }
    }
  }
}
