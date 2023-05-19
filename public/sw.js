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

self.addEventListener('fetch', event => {
    // adapted "get cache, check network and update if needed" code snippet from
    // week 7 - lecture 13 - PWA architectures to use a network first and update cache strategy
    event.respondWith(caches.open(staticCacheName).then(cache => {
        return fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
        }).catch(err => {
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