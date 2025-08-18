import { useState, useEffect, useCallback } from 'react';
import PWAService, { PWACapabilities } from '../Service/PWAService';
import { notify } from '../Utiles/notif';

export const usePWA = () => {
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    isSupported: false,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    supportsNotifications: false,
    supportsBackgroundSync: false,
    supportsWebShare: false,
    supportsFileShare: false,
    isOnline: true
  });
  
  const [isInstalling, setIsInstalling] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSubscribedToPush, setIsSubscribedToPush] = useState(false);

  // Update capabilities
  const updateCapabilities = useCallback(() => {
    const newCapabilities = PWAService.getCapabilities();
    setCapabilities(newCapabilities);
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!capabilities.canInstall) {
      notify.warning('App installation is not available');
      return false;
    }

    try {
      setIsInstalling(true);
      const success = await PWAService.installApp();
      
      if (success) {
        notify.success('App installed successfully!');
        updateCapabilities();
      } else {
        notify.info('App installation cancelled');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to install app:', error);
      notify.error('Failed to install app');
      return false;
    } finally {
      setIsInstalling(false);
    }
  }, [capabilities.canInstall, updateCapabilities]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    try {
      const permission = await PWAService.requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        notify.success('Notifications enabled!');
      } else {
        notify.warning('Notifications permission denied');
      }
      
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      notify.error('Failed to enable notifications');
      return 'denied';
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    try {
      const subscription = await PWAService.subscribeToPushNotifications();
      
      if (subscription) {
        setIsSubscribedToPush(true);
        notify.success('Push notifications enabled!');
        
        // TODO: Send subscription to backend
        console.log('Push subscription:', subscription);
        
        return subscription;
      } else {
        notify.warning('Failed to enable push notifications');
        return null;
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      notify.error('Failed to enable push notifications');
      return null;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPushNotifications = useCallback(async () => {
    try {
      const success = await PWAService.unsubscribeFromPushNotifications();
      
      if (success) {
        setIsSubscribedToPush(false);
        notify.success('Push notifications disabled');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      notify.error('Failed to disable push notifications');
      return false;
    }
  }, []);

  // Show local notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    PWAService.showLocalNotification(title, options);
  }, []);

  // Share content
  const shareContent = useCallback(async (shareData: {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
  }) => {
    if (!capabilities.supportsWebShare) {
      // Fallback to copy to clipboard
      if (shareData.url) {
        try {
          await navigator.clipboard.writeText(shareData.url);
          notify.success('Link copied to clipboard!');
          return true;
        } catch (error) {
          notify.error('Failed to copy link');
          return false;
        }
      }
      return false;
    }

    try {
      const success = await PWAService.shareContent(shareData);
      if (success) {
        notify.success('Content shared successfully!');
      }
      return success;
    } catch (error) {
      console.error('Failed to share content:', error);
      notify.error('Failed to share content');
      return false;
    }
  }, [capabilities.supportsWebShare]);

  // Add offline action
  const addOfflineAction = useCallback(async (
    type: 'CREATE_RECIPE' | 'UPDATE_RECIPE' | 'DELETE_RECIPE' | 'LIKE_RECIPE' | 'COMMENT_RECIPE',
    url: string,
    method: string,
    data?: any
  ) => {
    try {
      await PWAService.addOfflineAction({ type, url, method, data });
      
      if (!capabilities.isOnline) {
        notify.info('Action saved for when you\'re back online');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add offline action:', error);
      notify.error('Failed to save action for offline sync');
      return false;
    }
  }, [capabilities.isOnline]);

  // Sync offline actions
  const syncOfflineActions = useCallback(async () => {
    try {
      await PWAService.syncOfflineActions();
      notify.success('Offline actions synced!');
      return true;
    } catch (error) {
      console.error('Failed to sync offline actions:', error);
      notify.error('Failed to sync offline actions');
      return false;
    }
  }, []);

  // Request background sync
  const requestBackgroundSync = useCallback(async (tag: string) => {
    try {
      await PWAService.requestBackgroundSync(tag);
      return true;
    } catch (error) {
      console.error('Failed to request background sync:', error);
      return false;
    }
  }, []);

  // Check if app is installed
  const checkInstallStatus = useCallback(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    
    setCapabilities(prev => ({ ...prev, isInstalled }));
    return isInstalled;
  }, []);

  // Check notification permission
  const checkNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      setNotificationPermission(window.Notification.permission);
    }
  }, []);

  // Initialize PWA features
  useEffect(() => {
    updateCapabilities();
    checkNotificationPermission();

    // Listen for install availability
    const unsubscribeInstall = PWAService.onInstallAvailable((canInstall) => {
      setCapabilities(prev => ({ ...prev, canInstall }));
    });

    // Listen for online status changes
    const unsubscribeOnline = PWAService.onOnlineStatusChange((isOnline) => {
      setCapabilities(prev => ({ ...prev, isOnline }));
      
      if (isOnline) {
        notify.success('You\'re back online!');
        // Auto-sync offline actions when coming back online
        syncOfflineActions();
      } else {
        notify.warning('You\'re offline. Some features may not be available.');
      }
    });

    // Check for display mode changes (app installed)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      updateCapabilities();
    };
    
    mediaQuery.addListener(handleDisplayModeChange);

    // Cleanup
    return () => {
      unsubscribeInstall();
      unsubscribeOnline();
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, [updateCapabilities, syncOfflineActions]);

  // Auto-sync offline actions when app starts and is online
  useEffect(() => {
    if (capabilities.isOnline && capabilities.isSupported) {
      // Small delay to allow app to initialize
      setTimeout(() => {
        syncOfflineActions();
      }, 2000);
    }
  }, [capabilities.isOnline, capabilities.isSupported, syncOfflineActions]);

  return {
    // Capabilities
    capabilities,
    isInstalling,
    notificationPermission,
    isSubscribedToPush,
    
    // Installation
    installApp,
    checkInstallStatus,
    
    // Notifications
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    showNotification,
    
    // Sharing
    shareContent,
    
    // Offline functionality
    addOfflineAction,
    syncOfflineActions,
    requestBackgroundSync,
    
    // Utilities
    updateCapabilities,
    checkNotificationPermission
  };
};