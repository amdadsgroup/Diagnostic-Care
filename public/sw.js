// Diagnostic Care — Service Worker for Mobile PWA & Offline Emergency Kit
// Helpline: 01886748564 | Moulvibazar & Bangladesh Nationwide

const CACHE_NAME = 'diagnostic-care-v1.3';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/logo.png',
  OFFLINE_URL,
];

// 1. Install & Cache Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache pre-fetch non-fatal warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate & Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch with Stale-While-Revalidate and Offline Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and chrome-extension schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // For API calls, use network first, do not fallback to html
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            offline: true,
            message: 'ইন্টারনেট সংযোগ নেই। হেল্পলাইন: 01886748564',
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

  // Static Assets (Images, Icons) -> Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.url.includes('/logo.png')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
        );
      })
    );
    return;
  }

  // Page navigations -> Network First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const offlinePage = await caches.match(OFFLINE_URL);
        return (
          offlinePage ||
          new Response(
            `<!DOCTYPE html>
            <html lang="bn">
            <head><meta charset="utf-8"/><title>অফলাইন — Diagnostic Care</title></head>
            <body style="font-family:sans-serif;text-align:center;padding:50px 20px;background:#F8FAFC;">
              <h2>⚠️ আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন</h2>
              <p>ডায়াগনস্টিক কেয়ারের হেল্পলাইন সার্বক্ষণিক খোলা আছে:</p>
              <h3 style="color:#0B2545;">📞 01886748564</h3>
              <p>সংযোগ ফিরে আসলে পৃষ্ঠাটি রিলোড দিন।</p>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          )
        );
      })
    );
    return;
  }

  // Default Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
