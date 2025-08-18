import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';

export interface AppNotification {
  id: number;
  userId: number;
  type: 'RECIPE_LIKE' | 'RECIPE_COMMENT' | 'FOLLOW' | 'COLLECTION_SHARE' | 'ACHIEVEMENT' | 'MEAL_PLAN_REMINDER';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  relatedUserId?: number;
  relatedUserUsername?: string;
  relatedRecipeId?: number;
  relatedRecipeTitle?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  recipeLikes: boolean;
  recipeComments: boolean;
  newFollowers: boolean;
  collectionShares: boolean;
  achievements: boolean;
  mealPlanReminders: boolean;
}

class NotificationService extends BaseApiService {
  private static instance: NotificationService;

  private constructor() {
    super('http://localhost:8080/api/notifications');
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ===========================
  // NOTIFICATIONS CRUD
  // ===========================

  public async getNotifications(
    page: number = 0, 
    size: number = 20, 
    unreadOnly: boolean = false
  ): Promise<AxiosResponse<{
    content: AppNotification[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      unreadOnly: unreadOnly.toString()
    });
    return this.get<{
      content: AppNotification[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`?${params}`);
  }

  public async getUnreadCount(): Promise<AxiosResponse<{ count: number }>> {
    return this.get<{ count: number }>('/unread-count');
  }

  public async markAsRead(notificationId: number): Promise<AxiosResponse<AppNotification>> {
    return this.put<AppNotification>(`/${notificationId}/read`, {});
  }

  public async markAllAsRead(): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>('/mark-all-read', {});
  }

  public async deleteNotification(notificationId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${notificationId}`);
  }

  public async clearAllNotifications(): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>('/clear-all');
  }

  // ===========================
  // NOTIFICATION PREFERENCES
  // ===========================

  public async getPreferences(): Promise<AxiosResponse<NotificationPreferences>> {
    return this.get<NotificationPreferences>('/preferences');
  }

  public async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<AxiosResponse<NotificationPreferences>> {
    return this.put<NotificationPreferences>('/preferences', preferences);
  }

  // ===========================
  // PUSH NOTIFICATIONS
  // ===========================

  public async subscribeToPush(subscription: PushSubscription): Promise<AxiosResponse<{ message: string }>> {
    return this.post<{ message: string }>('/push/subscribe', {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    });
  }

  public async unsubscribeFromPush(): Promise<AxiosResponse<{ message: string }>> {
    return this.post<{ message: string }>('/push/unsubscribe', {});
  }

  // ===========================
  // NOTIFICATION CREATION (Admin/System)
  // ===========================

  public async sendNotification(notification: {
    userId: number;
    type: AppNotification['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    relatedUserId?: number;
    relatedRecipeId?: number;
  }): Promise<AxiosResponse<AppNotification>> {
    return this.post<AppNotification>('/send', notification);
  }

  public async broadcastNotification(notification: {
    type: AppNotification['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    targetUsers?: number[];
  }): Promise<AxiosResponse<{ message: string; sentCount: number }>> {
    return this.post<{ message: string; sentCount: number }>('/broadcast', notification);
  }

  // ===========================
  // REAL-TIME NOTIFICATIONS
  // ===========================

  public async enableRealtimeNotifications(
    onNotification: (notification: AppNotification) => void,
    onUnreadCountChange: (count: number) => void
  ): Promise<EventSource | null> {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.warn('No authentication token found for real-time notifications');
        return null;
      }

      const eventSource = new EventSource(
        `${this.baseURL}/stream?token=${encodeURIComponent(token)}`
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            onNotification(data.notification);
          } else if (data.type === 'unread_count') {
            onUnreadCountChange(data.count);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
      };

      return eventSource;
    } catch (error) {
      console.error('Error setting up real-time notifications:', error);
      return null;
    }
  }

  // ===========================
  // SOCIAL INTERACTION NOTIFICATIONS
  // ===========================

  public async notifyRecipeLike(recipeId: number, likedByUserId: number): Promise<void> {
    try {
      await this.post('/interactions/recipe-like', {
        recipeId,
        likedByUserId
      });
    } catch (error) {
      console.error('Error sending recipe like notification:', error);
    }
  }

  public async notifyRecipeComment(
    recipeId: number, 
    commentedByUserId: number, 
    comment: string
  ): Promise<void> {
    try {
      await this.post('/interactions/recipe-comment', {
        recipeId,
        commentedByUserId,
        comment: comment.substring(0, 100) // Limit comment preview
      });
    } catch (error) {
      console.error('Error sending recipe comment notification:', error);
    }
  }

  public async notifyNewFollower(followedUserId: number, followerUserId: number): Promise<void> {
    try {
      await this.post('/interactions/new-follower', {
        followedUserId,
        followerUserId
      });
    } catch (error) {
      console.error('Error sending new follower notification:', error);
    }
  }

  public async notifyCollectionShare(
    collectionId: number, 
    sharedByUserId: number, 
    sharedWithUserIds: number[]
  ): Promise<void> {
    try {
      await this.post('/interactions/collection-share', {
        collectionId,
        sharedByUserId,
        sharedWithUserIds
      });
    } catch (error) {
      console.error('Error sending collection share notification:', error);
    }
  }

  public async notifyAchievement(
    userId: number, 
    achievementType: string, 
    achievementName: string
  ): Promise<void> {
    try {
      await this.post('/interactions/achievement', {
        userId,
        achievementType,
        achievementName
      });
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  }
}

export default NotificationService.getInstance();
export { NotificationService };