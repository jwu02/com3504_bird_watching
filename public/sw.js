const filesToCache = [
    // "partials/footer.ejs",
    // "partials/header.ejs",
    "stylesheets/style.css",
    // "stylesheets/menu.css",
    "/"
];
const staticCacheName = 'BirdWatchingApp';


self.addEventListener('install', event => {
    console.log('Installing service worker');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('Caching file');
        return cache.addAll(filesToCache);
    }));
});

// get cache, check network and update if needed
self.addEventListener('fetch', event => {
    event.respondWith(caches.open(staticCacheName).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
            const fetchedResponse = fetch(event.request).then(networkResponse => {
                cache.put(event.request, networkResponse.clone());
                console.log(event.request);
                return networkResponse;
            });
            return cachedResponse || fetchedResponse;
        });
    }));
});


self.addEventListener('sync', (event) => {
    console.info('Event: Sync', event);
    if (event.tag === 'sync-sightings') {
        console.log("actually syncing OMG WOW");
    }
});