const CACHE_NAME = "pwa-task-manager";
const urlsToCache = [
    '/',
    '/login',
    '/offline'
];

// Install a service worker
self.addEventListener('install', e => {
    // Perform install steps
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    )
})

// Cache and return requests
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) return response;
            return fetch(e.request);
        })
    )
})

// Update a service worker
self.addEventListener('activate', e => {
    const cacheWhiteList = ['pwa-task-manager'];
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheWhiteList.indexOf(cacheName) === -1) return caches.delete(cacheName);
                })
            )
        })
    )
})