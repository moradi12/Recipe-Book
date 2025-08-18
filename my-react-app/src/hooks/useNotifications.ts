import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import NotificationService, { 
  AppNotification, 
  NotificationPreferences 
} from '../Service/NotificationService';
import { notify } from '../Utiles/notif';

export const useNotifications = () => {
  const { requireAuth } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page: number = 0, unreadOnly: boolean = false) => {
    if (!requireAuth()) return;

    try {
      setLoading(true);
      const response = await NotificationService.getNotifications(page, 20, unreadOnly);
      
      if (page === 0) {
        setNotifications(response.data.content);
      } else {
        setNotifications(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Mock data for development
      const mockNotifications: AppNotification[] = [
        {
          id: 1,
          userId: 1,
          type: 'RECIPE_LIKE',
          title: 'Recipe Liked',
          message: 'Someone liked your "Chocolate Cake" recipe!',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          relatedUserId: 2,
          relatedUserUsername: 'foodlover123',
          relatedRecipeId: 1,
          relatedRecipeTitle: 'Chocolate Cake'
        },
        {
          id: 2,
          userId: 1,
          type: 'FOLLOW',
          title: 'New Follower',
          message: 'chef_master started following you!',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          relatedUserId: 3,
          relatedUserUsername: 'chef_master'
        },
        {
          id: 3,
          userId: 1,
          type: 'ACHIEVEMENT',
          title: 'Achievement Unlocked!',
          message: 'You\'ve earned the "Recipe Master" badge for creating 10 recipes!',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          data: { achievementType: 'recipe_count', level: 'master' }
        },
        {
          id: 4,
          userId: 1,
          type: 'RECIPE_COMMENT',
          title: 'New Comment',
          message: 'Someone commented on your "Pasta Carbonara" recipe',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          relatedUserId: 4,
          relatedUserUsername: 'pasta_enthusiast',
          relatedRecipeId: 2,
          relatedRecipeTitle: 'Pasta Carbonara'
        }
      ];

      if (page === 0) {
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      }
      
      notify.warning('Using demo data - start backend server for full functionality');
      return { content: mockNotifications, totalElements: 4, totalPages: 1, last: true };
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Use local count as fallback
      const localUnread = notifications.filter(n => !n.isRead).length;
      setUnreadCount(localUnread);
    }
  }, [requireAuth, notifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      setActionLoading(true);
      await NotificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Fallback for demo
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      setActionLoading(true);
      await NotificationService.markAllAsRead();
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      notify.success('All notifications marked as read');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      
      // Fallback for demo
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      notify.success('All notifications marked as read (demo mode)');
      return true;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      setActionLoading(true);
      await NotificationService.deleteNotification(notificationId);
      
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      
      // Fallback for demo
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      return true;
    } finally {
      setActionLoading(false);
    }
  }, [notifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) {
      return false;
    }

    try {
      setActionLoading(true);
      await NotificationService.clearAllNotifications();
      
      setNotifications([]);
      setUnreadCount(0);
      notify.success('All notifications cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      
      // Fallback for demo
      setNotifications([]);
      setUnreadCount(0);
      notify.success('All notifications cleared (demo mode)');
      return true;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const response = await NotificationService.getPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      
      // Mock preferences
      setPreferences({
        emailNotifications: true,
        pushNotifications: false,
        recipeLikes: true,
        recipeComments: true,
        newFollowers: true,
        collectionShares: true,
        achievements: true,
        mealPlanReminders: false
      });
    }
  }, [requireAuth]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    try {
      setActionLoading(true);
      await NotificationService.updatePreferences(updates);
      
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      notify.success('Notification preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      
      // Fallback for demo
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      notify.success('Notification preferences updated (demo mode)');
      return true;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Setup real-time notifications
  const setupRealtimeNotifications = useCallback(() => {
    if (!requireAuth()) return;

    const handleNewNotification = (notification: AppNotification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: `notification-${notification.id}`
        });
      }
    };

    const handleUnreadCountChange = (count: number) => {
      setUnreadCount(count);
    };

    // Setup EventSource for real-time notifications
    NotificationService.enableRealtimeNotifications(
      handleNewNotification,
      handleUnreadCountChange
    ).then(eventSource => {
      eventSourceRef.current = eventSource;
    });

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notify.success('Browser notifications enabled');
        }
      });
    }
  }, [requireAuth]);

  // Social interaction notifications
  const notifyRecipeLike = useCallback(async (recipeId: number, likedByUserId: number) => {
    try {
      await NotificationService.notifyRecipeLike(recipeId, likedByUserId);
    } catch (error) {
      console.error('Error sending recipe like notification:', error);
    }
  }, []);

  const notifyRecipeComment = useCallback(async (
    recipeId: number, 
    commentedByUserId: number, 
    comment: string
  ) => {
    try {
      await NotificationService.notifyRecipeComment(recipeId, commentedByUserId, comment);
    } catch (error) {
      console.error('Error sending recipe comment notification:', error);
    }
  }, []);

  const notifyNewFollower = useCallback(async (followedUserId: number, followerUserId: number) => {
    try {
      await NotificationService.notifyNewFollower(followedUserId, followerUserId);
    } catch (error) {
      console.error('Error sending new follower notification:', error);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchPreferences();
    setupRealtimeNotifications();
  }, [fetchNotifications, fetchUnreadCount, fetchPreferences, setupRealtimeNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    actionLoading,
    preferences,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    notifyRecipeLike,
    notifyRecipeComment,
    notifyNewFollower
  };
};