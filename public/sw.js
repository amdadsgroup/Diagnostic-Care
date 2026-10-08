// Diagnostic Care — Production Service Worker
// Version: 2.1.0
// Brand: Diagnostic Care — Your Healthcare Marketplace
// Helpline: 01886748564 | Moulvibazar & Bangladesh Nationwide

const CACHE_VERSION = 'diagnostic-care-v2.1.0';
const STATIC_CACHE = `dc-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dc-dynamic-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const APP_SHELL = [
  '/',
  '/manifest.json',
  OFFLINE_URL,
  '/logo.png',
  '/brand/logo-horizontal.png',
  '/brand/logo-horizontal-transparent.png',
  '/brand/logo-symbol.png',
  '/brand/logo-symbol-transparent.png',
  '/brand/logo-full.png',
  '/brand/logo-full-transparent.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
];

// Sensitive endpoints that MUST NEVER be stored in public service worker cache
const SENSITIVE_PATTERNS = [
  '/api/auth',
  '/api/booking',
  '/api/payment',
  '/api/records',
  '/api/reports',
  '/api/prescriptions',
  '/api/user',
  '/api/patient',
  '/api/vault',
];

function isSensitiveRequest(url) {
  return SENSITIVE_PATTERNS.some((pattern) => url.includes(pattern));
}

// 1. Install & Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Non-fatal pre-cache warning:', err);
      });
    })
  );
  // Do NOT blindly call skipWaiting() here so in-flight patient bookings are preserved
});

// 2. Activate & Purge Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. User-Initiated Safe Update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Fetch Interception with Multi-Tier Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Ignore non-GET, chrome extensions, and browser internal schemes
  if (request.method !== 'GET' || !url.startsWith('http')) return;

  // Strategy A: Sensitive Health Operations & Auth -> Strict Network Only
  if (isSensitiveRequest(url)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            offline: true,
            message: 'You are currently offline. Sensitive medical operations require an active internet connection. Emergency helpline: 01886748564',
            messageBn: 'ইন্টারনেট সংযোগ নেই। সংবেদনশীল তথ্য ও বুকিংয়ের জন্য ইন্টারনেট প্রয়োজন। হেল্পলাইন: ০১৮৮৬৭৪৮৫৬৪',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          }
        );
      })
    );
    return;
  }

  // Strategy B: Navigation Requests (HTML Pages) -> Network First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offlinePage = await caches.match(OFFLINE_URL);
          return offlinePage || new Response('Offline - Diagnostic Care Helpline: 01886748564', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  // Strategy C: Static Media, Icons, Fonts, CSS & JS Chunks -> Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.includes('/icons/') ||
    url.includes('/_next/static/') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy D: Safe Public API Queries -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// 5. Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'Diagnostic Care',
    body: 'You have a new update regarding your healthcare services.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/favicon-32x32.png',
    data: { url: '/' },
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (err) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      { action: 'open', title: 'Open / দেখুন' },
      { action: 'close', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 6. Notification Click Navigation
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
