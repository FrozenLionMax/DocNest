// DocNest Healthcare Universal Service Worker
// Version: 1.0.0 — drugs.systems

const CACHE_NAME = 'docnest-cache-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/patient',
  '/doctor/dashboard',
  '/compounder/dispense'
];

// Install Event — Pre-cache static shell & offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache assets warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Network First with Cache Fallback for navigation; Stale-While-Revalidate for assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For HTML navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and store in cache
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For static assets (images, icons, fonts, scripts)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && (url.pathname.startsWith('/_next/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.svg'))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        // Fallback for missing offline image
        if (event.request.destination === 'image') {
          return caches.match('/icon-192.png');
        }
      });
    })
  );
});

// Background Sync — Queue and sync clinical actions when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-clinical-queue') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_CLINICAL_QUEUE' });
        });
      })
    );
  }
});

// Periodic Sync — Keep OPD queue fresh in background
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-opd-status') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch('/doctor/tv').then((response) => {
          if (response.status === 200) {
            cache.put('/doctor/tv', response);
          }
        }).catch(() => null);
      })
    );
  }
});

// Push Notifications — Clinical appointment & token alerts
self.addEventListener('push', (event) => {
  let data = { title: 'DocNest Token Alert', body: 'Your OPD token number is approaching.' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {}

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/patient' },
    actions: [
      { action: 'open', title: 'View Token' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/patient';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
