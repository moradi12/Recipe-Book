// Service Worker for Recipe Book PWA
const CACHE_NAME = 'recipe-book-v1.0.0';
const OFFLINE_CACHE = 'recipe-book-offline-v1.0.0';

// Assets to cache on install
const CORE_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/images/icons/recipe-book-192x192.png',
  '/images/icons/recipe-book-512x512.png'
];

// Runtime caching patterns
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: [
    /\.(js|css|woff2?|ttf|eot|ico)$/,
    /\/images\/icons\//,
    /\/images\/screenshots\//
  ],
  
  // Network first for API calls
  NETWORK_FIRST: [
    /\/api\//,
    /\/auth\//
  ],
  
  // Stale while revalidate for content
  STALE_WHILE_REVALIDATE: [
    /\/recipes\//,
    /\/collections\//,
    /\/users\//
  ]
};

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Core assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache core assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determine caching strategy
  const strategy = getCacheStrategy(request);
  
  switch (strategy) {
    case 'CACHE_FIRST':
      event.respondWith(cacheFirst(request));
      break;
    case 'NETWORK_FIRST':
      event.respondWith(networkFirst(request));
      break;
    case 'STALE_WHILE_REVALIDATE':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// Push notification event
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    icon: '/images/icons/recipe-book-192x192.png',
    badge: '/images/icons/recipe-book-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Recipe',
        icon: '/images/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/icons/close-icon.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.title = data.title || 'Recipe Book';
    options.body = data.body || 'You have a new notification!';
    options.tag = data.tag || 'general';
    options.data.url = data.url;
  } else {
    options.title = 'Recipe Book';
    options.body = 'Check out the latest recipes!';
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'close') {
    return;
  }
  
  const urlToOpen = data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there's already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-recipes') {
    event.waitUntil(doBackgroundSync());
  }
});

// Share target handling
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-recipe' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

// Cache strategies implementation

function getCacheStrategy(request) {
  const url = request.url;
  
  // Check cache first patterns
  for (let pattern of CACHE_STRATEGIES.CACHE_FIRST) {
    if (pattern.test(url)) {
      return 'CACHE_FIRST';
    }
  }
  
  // Check network first patterns
  for (let pattern of CACHE_STRATEGIES.NETWORK_FIRST) {
    if (pattern.test(url)) {
      return 'NETWORK_FIRST';
    }
  }
  
  // Check stale while revalidate patterns
  for (let pattern of CACHE_STRATEGIES.STALE_WHILE_REVALIDATE) {
    if (pattern.test(url)) {
      return 'STALE_WHILE_REVALIDATE';
    }
  }
  
  return 'NETWORK_FIRST';
}

async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return getOfflineFallback(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network first fallback to cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('Network failed for stale-while-revalidate:', error);
    });
  
  return cachedResponse || networkPromise || getOfflineFallback(request);
}

async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return caches.match('/offline.html') || 
           new Response('You are offline. Please check your connection.', {
             status: 200,
             headers: { 'Content-Type': 'text/html' }
           });
  }
  
  // Return offline JSON for API requests
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Some features may not be available.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Return cached or default response
  return new Response('Resource not available offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync');
  
  try {
    // Get pending offline actions from IndexedDB
    const pendingActions = await getPendingOfflineActions();
    
    for (let action of pendingActions) {
      try {
        await performOfflineAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
    
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    const files = formData.getAll('images');
    
    // Store shared content for the app to handle
    const shareData = {
      title,
      text,
      url,
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      timestamp: Date.now()
    };
    
    // Store in cache for the app to retrieve
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.put('/shared-content', new Response(JSON.stringify(shareData)));
    
    // Redirect to the app with share indicator
    return Response.redirect('/?shared=true', 302);
  } catch (error) {
    console.error('Failed to handle share target:', error);
    return Response.redirect('/', 302);
  }
}

// Utility functions for IndexedDB operations
async function getPendingOfflineActions() {
  // Implement IndexedDB operations for offline action queue
  return [];
}

async function performOfflineAction(action) {
  // Implement the actual API call for the pending action
  return fetch(action.url, action.options);
}

async function removePendingAction(actionId) {
  // Remove the action from IndexedDB after successful sync
  return true;
}

// Install prompt handling
let deferredPrompt = null;

self.addEventListener('beforeinstallprompt', event => {
  console.log('Service Worker: Before install prompt');
  event.preventDefault();
  deferredPrompt = event;
  
  // Notify the app that install is available
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'INSTALL_AVAILABLE'
      });
    });
  });
});

// App installed
self.addEventListener('appinstalled', event => {
  console.log('Service Worker: App was installed');
  deferredPrompt = null;
  
  // Track app installation
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'APP_INSTALLED'
      });
    });
  });
});

console.log('Service Worker: Loaded successfully');