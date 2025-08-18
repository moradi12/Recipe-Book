// PWA Service for managing Progressive Web App features
export interface PWACapabilities {
  isSupported: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsWebShare: boolean;
  supportsFileShare: boolean;
  isOnline: boolean;
}

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface OfflineAction {
  id: string;
  type: 'CREATE_RECIPE' | 'UPDATE_RECIPE' | 'DELETE_RECIPE' | 'LIKE_RECIPE' | 'COMMENT_RECIPE';
  url: string;
  method: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

class PWAService {
  private static instance: PWAService;
  private deferredPrompt: InstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private installCallbacks: ((canInstall: boolean) => void)[] = [];
  private onlineCallbacks: ((isOnline: boolean) => void)[] = [];
  private notificationPermission: NotificationPermission = 'default';

  private constructor() {
    this.init();
  }

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  private async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA: Service Worker registered successfully');
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          console.log('PWA: Service Worker update found');
        });
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as InstallPromptEvent;
      this.notifyInstallCallbacks(true);
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App was installed');
      this.deferredPrompt = null;
      this.notifyInstallCallbacks(false);
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('PWA: App is online');
      this.notifyOnlineCallbacks(true);
      this.syncOfflineActions();
    });

    window.addEventListener('offline', () => {
      console.log('PWA: App is offline');
      this.notifyOnlineCallbacks(false);
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });
    }

    // Check notification permission
    if ('Notification' in window) {
      this.notificationPermission = window.Notification.permission;
    }
  }

  // ===========================
  // CAPABILITY DETECTION
  // ===========================

  public getCapabilities(): PWACapabilities {
    return {
      isSupported: 'serviceWorker' in navigator,
      isInstalled: this.isAppInstalled(),
      isStandalone: this.isStandalone(),
      canInstall: !!this.deferredPrompt,
      supportsNotifications: 'Notification' in window,
      supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      supportsWebShare: 'share' in navigator,
      supportsFileShare: 'canShare' in navigator,
      isOnline: navigator.onLine
    };
  }

  private isAppInstalled(): boolean {
    // Check if running as installed PWA
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  private isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // ===========================
  // APP INSTALLATION
  // ===========================

  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('PWA: No install prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        this.deferredPrompt = null;
        this.notifyInstallCallbacks(false);
        return true;
      } else {
        console.log('PWA: User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('PWA: Install prompt failed:', error);
      return false;
    }
  }

  public onInstallAvailable(callback: (canInstall: boolean) => void): () => void {
    this.installCallbacks.push(callback);
    
    // Immediately call with current state
    callback(!!this.deferredPrompt);
    
    // Return unsubscribe function
    return () => {
      const index = this.installCallbacks.indexOf(callback);
      if (index > -1) {
        this.installCallbacks.splice(index, 1);
      }
    };
  }

  private notifyInstallCallbacks(canInstall: boolean) {
    this.installCallbacks.forEach(callback => callback(canInstall));
  }

  // ===========================
  // NOTIFICATIONS
  // ===========================

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('PWA: Notifications not supported');
      return 'denied';
    }

    if (window.Notification.permission === 'granted') {
      return 'granted';
    }

    if (window.Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await window.Notification.requestPermission();
      this.notificationPermission = permission;
      return permission;
    } catch (error) {
      console.error('PWA: Failed to request notification permission:', error);
      return 'denied';
    }
  }

  public async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.warn('PWA: Service Worker not registered');
      return null;
    }

    try {
      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        console.warn('PWA: Notification permission denied');
        return null;
      }

      // Check if already subscribed
      const existingSubscription = await this.registration.pushManager.getSubscription();
      if (existingSubscription) {
        return existingSubscription;
      }

      // Subscribe to push notifications
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
      });

      console.log('PWA: Subscribed to push notifications');
      return subscription;
    } catch (error) {
      console.error('PWA: Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  public async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('PWA: Unsubscribed from push notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('PWA: Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  public showLocalNotification(title: string, options: NotificationOptions = {}): void {
    if (this.notificationPermission === 'granted') {
      new window.Notification(title, {
        icon: '/images/icons/recipe-book-192x192.png',
        badge: '/images/icons/recipe-book-72x72.png',
        ...options
      });
    }
  }

  // ===========================
  // OFFLINE FUNCTIONALITY
  // ===========================

  public async addOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const offlineAction: OfflineAction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      retryCount: 0,
      ...action
    };

    try {
      // Store in IndexedDB for persistence
      await this.storeOfflineAction(offlineAction);
      console.log('PWA: Offline action stored:', offlineAction);

      // Try to sync immediately if online
      if (navigator.onLine) {
        this.syncOfflineActions();
      }
    } catch (error) {
      console.error('PWA: Failed to store offline action:', error);
    }
  }

  public async syncOfflineActions(): Promise<void> {
    if (!navigator.onLine) {
      console.log('PWA: Cannot sync - app is offline');
      return;
    }

    try {
      const pendingActions = await this.getPendingOfflineActions();
      console.log(`PWA: Syncing ${pendingActions.length} offline actions`);

      for (const action of pendingActions) {
        try {
          await this.executeOfflineAction(action);
          await this.removeOfflineAction(action.id);
          console.log('PWA: Synced offline action:', action.type);
        } catch (error) {
          console.error('PWA: Failed to sync action:', action, error);
          
          // Increment retry count
          action.retryCount++;
          if (action.retryCount < 3) {
            await this.storeOfflineAction(action);
          } else {
            console.warn('PWA: Removing failed action after 3 retries:', action);
            await this.removeOfflineAction(action.id);
          }
        }
      }
    } catch (error) {
      console.error('PWA: Failed to sync offline actions:', error);
    }
  }

  public onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.onlineCallbacks.push(callback);
    
    // Immediately call with current state
    callback(navigator.onLine);
    
    // Return unsubscribe function
    return () => {
      const index = this.onlineCallbacks.indexOf(callback);
      if (index > -1) {
        this.onlineCallbacks.splice(index, 1);
      }
    };
  }

  private notifyOnlineCallbacks(isOnline: boolean) {
    this.onlineCallbacks.forEach(callback => callback(isOnline));
  }

  // ===========================
  // WEB SHARE API
  // ===========================

  public async shareContent(shareData: {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
  }): Promise<boolean> {
    if (!('share' in navigator)) {
      console.warn('PWA: Web Share API not supported');
      return false;
    }

    try {
      // Check if files can be shared
      if (shareData.files && shareData.files.length > 0) {
        if ('canShare' in navigator && !navigator.canShare(shareData)) {
          console.warn('PWA: Cannot share files');
          delete shareData.files;
        }
      }

      await navigator.share(shareData);
      console.log('PWA: Content shared successfully');
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('PWA: Share cancelled by user');
      } else {
        console.error('PWA: Share failed:', error);
      }
      return false;
    }
  }

  // ===========================
  // BACKGROUND SYNC
  // ===========================

  public async requestBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in this.registration)) {
      console.warn('PWA: Background sync not supported');
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log('PWA: Background sync registered:', tag);
    } catch (error) {
      console.error('PWA: Failed to register background sync:', error);
    }
  }

  // ===========================
  // UTILITY METHODS
  // ===========================

  private handleServiceWorkerMessage(data: any) {
    switch (data.type) {
      case 'INSTALL_AVAILABLE':
        this.notifyInstallCallbacks(true);
        break;
      case 'APP_INSTALLED':
        this.notifyInstallCallbacks(false);
        break;
      default:
        console.log('PWA: Unknown service worker message:', data);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // IndexedDB operations for offline actions
  private async storeOfflineAction(action: OfflineAction): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('RecipeBookOffline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['actions'], 'readwrite');
        const store = transaction.objectStore('actions');
        
        const addRequest = store.put(action);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('actions')) {
          db.createObjectStore('actions', { keyPath: 'id' });
        }
      };
    });
  }

  private async getPendingOfflineActions(): Promise<OfflineAction[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('RecipeBookOffline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['actions'], 'readonly');
        const store = transaction.objectStore('actions');
        
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  }

  private async removeOfflineAction(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('RecipeBookOffline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['actions'], 'readwrite');
        const store = transaction.objectStore('actions');
        
        const deleteRequest = store.delete(id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  }

  private async executeOfflineAction(action: OfflineAction): Promise<void> {
    const response = await fetch(action.url, {
      method: action.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
      },
      body: action.data ? JSON.stringify(action.data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}

export default PWAService.getInstance();
export { PWAService };