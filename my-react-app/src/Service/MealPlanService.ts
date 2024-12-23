// Services/MealPlanService.ts

import axios from 'axios';
import { MealPlan } from '../Models/MealPlan';
import { BaseService } from './BaseService';

export class MealPlanService extends BaseService {
  /**
   * Fetches all meal plans for a specific user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an array of MealPlans.
   */
  async fetchMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const response = await this.axiosInstance.get<MealPlan[]>(`/users/${userId}/meal-plans`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching meal plans:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch meal plans.');
      } else {
        throw new Error('An unexpected error occurred while fetching meal plans.');
      }
    }
  }

  /**
   * Creates a new meal plan.
   * @param mealPlan - The MealPlan object to create.
   * @returns A Promise that resolves to the created MealPlan.
   */
  async createMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
    try {
      const response = await this.axiosInstance.post<MealPlan>(`/users/${mealPlan.userId}/meal-plans`, mealPlan);
      return response.data;
    } catch (error: unknown) {
      console.error('Error creating meal plan:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create meal plan.');
      } else {
        throw new Error('An unexpected error occurred while creating meal plan.');
      }
    }
  }

  /**
   * Updates an existing meal plan.
   * @param mealPlan - The MealPlan object with updated data.
   * @returns A Promise that resolves to the updated MealPlan.
   */
  async updateMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
    try {
      const response = await this.axiosInstance.put<MealPlan>(`/meal-plans/${mealPlan.id}`, mealPlan);
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating meal plan:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update meal plan.');
      } else {
        throw new Error('An unexpected error occurred while updating meal plan.');
      }
    }
  }
}
