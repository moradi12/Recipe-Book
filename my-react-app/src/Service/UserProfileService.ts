// Services/UserProfileService.ts

import axios from 'axios';
import { UserProfile } from '../Models/UserProfile';
import { BaseService } from './BaseService';

export class UserProfileService extends BaseService {
  /**
   * Fetches the user profile by user ID.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to the UserProfile.
   */
  async fetchUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.axiosInstance.get<UserProfile>(`/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user profile:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
      } else {
        throw new Error('An unexpected error occurred while fetching user profile.');
      }
    }
  }

  /**
   * Updates the user profile.
   * @param profile - The UserProfile object with updated data.
   * @returns A Promise that resolves to the updated UserProfile.
   */
  async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const response = await this.axiosInstance.put<UserProfile>(`/users/${profile.userId}`, profile);
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating user profile:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update user profile.');
      } else {
        throw new Error('An unexpected error occurred while updating user profile.');
      }
    }
  }
}
