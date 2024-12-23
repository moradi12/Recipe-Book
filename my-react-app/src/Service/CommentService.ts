// Services/CommentService.ts

import axios from 'axios';
import { Comment } from '../Models/Comment';
import { BaseService } from './BaseService';

export class CommentService extends BaseService {
  /**
   * Fetches comments for a specific recipe.
   * @param recipeId - The ID of the recipe.
   * @returns A Promise that resolves to an array of Comments.
   */
  async fetchComments(recipeId: string): Promise<Comment[]> {
    try {
      const response = await this.axiosInstance.get<Comment[]>(`/recipes/${recipeId}/comments`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching comments:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch comments.');
      } else {
        throw new Error('An unexpected error occurred while fetching comments.');
      }
    }
  }

  /**
   * Adds a new comment to a recipe.
   * @param comment - The Comment object to add.
   * @returns A Promise that resolves to the added Comment.
   */
  async addComment(comment: Comment): Promise<Comment> {
    try {
      const response = await this.axiosInstance.post<Comment>(`/recipes/${comment.recipeId}/comments`, comment);
      return response.data;
    } catch (error: unknown) {
      console.error('Error adding comment:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add comment.');
      } else {
        throw new Error('An unexpected error occurred while adding a comment.');
      }
    }
  }
}
