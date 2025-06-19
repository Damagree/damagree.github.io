const cacheName = "Cube Studio-Web Offline Game-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/Build.framework.js",
  "Build/Build.data",
    "Build/Build.wasm",
    "TemplateData/style.css"
];

// Install event: pre-cache required files
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Install');

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Pre-caching app shell and content');
            return cache.addAll(contentToCache);
        }).catch(function (err) {
            console.error('[Service Worker] Failed to cache during install', err);
        })
    );
});

// Activate event: clean up old caches if needed
self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== cacheName) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch event: serve from cache or fetch & cache
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                // Return from cache
                console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
                return response;
            }

            // Fetch from network and cache dynamically
            return fetch(event.request).then(function (fetchResponse) {
                // Only cache valid responses (status 200, type basic)
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                const clonedResponse = fetchResponse.clone();
                caches.open(cacheName).then(function (cache) {
                    cache.put(event.request, clonedResponse);
                });

                return fetchResponse;
            }).catch(function (err) {
                console.error('[Service Worker] Fetch failed; returning offline fallback if any.', err);
                // You can optionally return a fallback HTML page or asset here
            });
        })
    );
});
