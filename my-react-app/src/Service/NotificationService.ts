// Services/NotificationService.ts

import axios from 'axios';
import { Notification } from '../Models/Notification';
import { BaseService } from './BaseService';

export class NotificationService extends BaseService {
  /**
   * Fetches all notifications for a specific user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an array of Notifications.
   */
  async fetchNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await this.axiosInstance.get<Notification[]>(`/users/${userId}/notifications`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching notifications:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch notifications.');
      } else {
        throw new Error('An unexpected error occurred while fetching notifications.');
      }
    }
  }

  /**
   * Marks a notification as read.
   * @param notificationId - The ID of the notification to mark as read.
   * @returns A Promise that resolves when the notification is marked as read.
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.axiosInstance.patch(`/notifications/${notificationId}/read`);
    } catch (error: unknown) {
      console.error('Error marking notification as read:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to mark notification as read.');
      } else {
        throw new Error('An unexpected error occurred while marking notification as read.');
      }
    }
  }
}
