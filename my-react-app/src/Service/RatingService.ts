// Services/RatingService.ts

import axios from 'axios';
import { Rating } from '../Models/Rating';
import { BaseService } from './BaseService';

export class RatingService extends BaseService {
  /**
   * Fetches ratings for a specific recipe.
   * @param recipeId - The ID of the recipe.
   * @returns A Promise that resolves to an array of Ratings.
   */
  async fetchRatings(recipeId: string): Promise<Rating[]> {
    try {
      const response = await this.axiosInstance.get<Rating[]>(`/recipes/${recipeId}/ratings`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching ratings:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch ratings.');
      } else {
        throw new Error('An unexpected error occurred while fetching ratings.');
      }
    }
  }

  /**
   * Submits a new rating for a recipe.
   * @param rating - The Rating object to submit.
   * @returns A Promise that resolves to the submitted Rating.
   */
  async submitRating(rating: Rating): Promise<Rating> {
    try {
      const response = await this.axiosInstance.post<Rating>(`/recipes/${rating.recipeId}/ratings`, rating);
      return response.data;
    } catch (error: unknown) {
      console.error('Error submitting rating:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to submit rating.');
      } else {
        throw new Error('An unexpected error occurred while submitting rating.');
      }
    }
  }
}
