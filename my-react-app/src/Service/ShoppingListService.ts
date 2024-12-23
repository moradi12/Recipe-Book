import axios from 'axios';
import { NewShoppingListItem } from '../Models/NewShoppingListItem';
import { ShoppingList } from '../Models/ShoppingList';
import { ShoppingListItem } from '../Models/ShoppingListItem';
import { BaseService } from './BaseService';

export class ShoppingListService extends BaseService {
  /**
   * Handles API errors and throws user-friendly messages.
   * @param error - The caught error object.
   * @param defaultMessage - The default error message to throw.
   */
  private handleApiError(error: unknown, defaultMessage: string): never {
    console.error(defaultMessage, error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || defaultMessage);
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }

  /**
   * Fetches all shopping lists for a specific user.
   */
  async fetchShoppingLists(userId: string): Promise<ShoppingList[]> {
    try {
      const response = await this.axiosInstance.get<ShoppingList[]>(`/users/${userId}/shopping-lists`);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to fetch shopping lists.');
    }
  }

  /**
   * Creates a new shopping list.
   */
  async createShoppingList(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt' | 'items'>): Promise<ShoppingList> {
    try {
      const response = await this.axiosInstance.post<ShoppingList>(`/users/${list.user}/shopping-lists`, list);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to create shopping list.');
    }
  }

  /**
   * Updates an existing shopping list.
   */
  async updateShoppingList(list: ShoppingList): Promise<ShoppingList> {
    try {
      const response = await this.axiosInstance.put<ShoppingList>(`/shopping-lists/${list.id}`, list);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to update shopping list.');
    }
  }

  /**
   * Deletes a shopping list by its ID.
   */
  async deleteShoppingList(listId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/shopping-lists/${listId}`);
    } catch (error) {
      this.handleApiError(error, 'Failed to delete shopping list.');
    }
  }

  /**
   * Adds an item to a shopping list.
   */
  async addItemToList(listId: string, item: NewShoppingListItem): Promise<ShoppingList> {
    try {
      const response = await this.axiosInstance.post<ShoppingList>(`/shopping-lists/${listId}/items`, item);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to add item to shopping list.');
    }
  }

  /**
   * Updates an item in a shopping list.
   */
  async updateItemInList(listId: string, item: ShoppingListItem): Promise<ShoppingList> {
    try {
      const response = await this.axiosInstance.put<ShoppingList>(`/shopping-lists/${listId}/items/${item.id}`, item);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to update item in shopping list.');
    }
  }

  /**
   * Deletes an item from a shopping list.
   */
  async deleteItemFromList(listId: string, itemId: string): Promise<ShoppingList> {
    try {
      const response = await this.axiosInstance.delete<ShoppingList>(`/shopping-lists/${listId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Failed to delete item from shopping list.');
    }
  }
}
