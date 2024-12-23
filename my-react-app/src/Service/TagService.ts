// Services/TagService.ts

import axios from 'axios';
import { Tag } from '../Models/Tag';
import { BaseService } from './BaseService';

export class TagService extends BaseService {
  /**
   * Fetches all available tags.
   * @returns A Promise that resolves to an array of Tags.
   */
  async fetchTags(): Promise<Tag[]> {
    try {
      const response = await this.axiosInstance.get<Tag[]>(`/tags`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching tags:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tags.');
      } else {
        throw new Error('An unexpected error occurred while fetching tags.');
      }
    }
  }

  /**
   * Adds a new tag.
   * @param tag - The Tag object to add.
   * @returns A Promise that resolves to the added Tag.
   */
  async addTag(tag: Tag): Promise<Tag> {
    try {
      const response = await this.axiosInstance.post<Tag>(`/tags`, tag);
      return response.data;
    } catch (error: unknown) {
      console.error('Error adding tag:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add tag.');
      } else {
        throw new Error('An unexpected error occurred while adding tag.');
      }
    }
  }
}
