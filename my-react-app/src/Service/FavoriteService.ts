// Services/FavoriteService.ts

import axios from 'axios';
import { Favorite } from '../Models/Favorite';
import { BaseService } from './BaseService';

export class FavoriteService extends BaseService {
  /**
   * Fetches all favorites for a specific user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an array of Favorites.
   */
  async fetchFavorites(userId: string): Promise<Favorite[]> {
    try {
      const response = await this.axiosInstance.get<Favorite[]>(`/users/${userId}/favorites`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching favorites:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch favorites.');
      } else {
        throw new Error('An unexpected error occurred while fetching favorites.');
      }
    }
  }

  /**
   * Adds a recipe to the user's favorites.
   * @param favorite - The Favorite object to add.
   * @returns A Promise that resolves to the added Favorite.
   */
  async addFavorite(favorite: Favorite): Promise<Favorite> {
    try {
      const response = await this.axiosInstance.post<Favorite>(`/users/${favorite.userId}/favorites`, favorite);
      return response.data;
    } catch (error: unknown) {
      console.error('Error adding favorite:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add favorite.');
      } else {
        throw new Error('An unexpected error occurred while adding favorite.');
      }
    }
  }

  /**
   * Removes a favorite by its ID.
   * @param favoriteId - The ID of the favorite to remove.
   * @returns A Promise that resolves when the favorite is removed.
   */
  async removeFavorite(favoriteId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/favorites/${favoriteId}`);
    } catch (error: unknown) {
      console.error('Error removing favorite:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to remove favorite.');
      } else {
        throw new Error('An unexpected error occurred while removing favorite.');
      }
    }
  }
}
