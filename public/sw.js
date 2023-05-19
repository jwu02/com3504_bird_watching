const filesToCache = [
    // "partials/footer.ejs",
    // "partials/header.ejs",
    "stylesheets/style.css",
    // "stylesheets/menu.css",
    "/"
];
const staticCacheName = 'BirdWatchingApp';

// Use the install event to pre-cache any initial static resources
self.addEventListener('install', event => {
    console.log('Installing service worker');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('Caching file');
        return cache.addAll(filesToCache);
    }));
});

// service worker is activated, can be used to clean up outdated caches
// clear cache on reload
// service worker is available when page is refreshed
// execution can be forced using self.skipWaiting;
self.addEventListener('activate', event => {
// Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== staticCacheName) {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    );

    // force the waiting service worker to become the active service worker
    self.skipWaiting();
})

// service worker listen to fetch events
self.addEventListener('fetch', event => {
    // adapted "get cache, check network and update if needed" code snippet from
    // week 7 - lecture 13 - PWA architectures to use a network first and update cache strategy
    event.respondWith(caches.open(staticCacheName).then(cache => {
        // request from network first
        return fetch(event.request).then(networkResponse => {
            // update cache with latest content from server
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
        }).catch(err => {  // failed to get a network response, fallback to cache
            return cache.match(event.request);
        })
    }));
});


self.addEventListener('sync', (event) => {
    console.info('Event: Sync', event);
    if (event.tag === 'sync-sightings') {
        console.log("actually syncing OMG WOW");
    }
});