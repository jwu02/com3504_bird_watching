const filesToCache = [
    // "partials/footer.ejs",
    // "partials/header.ejs",
    "stylesheets/style.css",
    // "stylesheets/menu.css",
    "/"
];
const staticCacheName = 'BirdWatchingApp';

let BIRD_WATCHING_IDB_REQ;
const BIRD_WATCHING_IDB_NAME = "BirdWatching";
const SIGHTINGS_OS_NAME = "sightings";
const MESSAGES_OS_NAME = "messages";

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
    initIndexedDB();

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


function syncSightings() {
    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction(SIGHTINGS_OS_NAME, "readwrite");
    const sightingsStore = transaction.objectStore(SIGHTINGS_OS_NAME);

    const allSightingsRequest = sightingsStore.openCursor();

    allSightingsRequest.onsuccess = (event) => {
        let cursor = allSightingsRequest.result;

        if (cursor) {
            let sightingKey = cursor.primaryKey;
            let sighting = cursor.value;

            const sightingFormData = new FormData();
            for (const dictKey in sighting) {
                sightingFormData.append(dictKey, sighting[dictKey]);
            }

            fetch("/add_sighting_to_db", {
                method: "POST",
                body: sightingFormData
            }).then((response) => {
                if (response.ok) {
                    // delete sighting record from IndexedDB if saved to server
                    const deleteSightingRequest = cursor.delete();
                    deleteSightingRequest.addEventListener('success', () => {
                        console.log(`Sighting ${sightingKey} deleted from IndexedDB: ${sighting}`);
                    });
                }
            }).catch(err => console.log(err));

            cursor.continue();
        }
    }
}


self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sightings') {
        event.waitUntil(syncSightings());
    }
});


const handleUpgrade = (ev) => {
    const db = ev.target.result;
    console.log("Upgrading IndexedDB.");
    db.createObjectStore(SESSION_OS_NAME);
    db.createObjectStore(SIGHTINGS_OS_NAME, {autoIncrement: true});
};


function initIndexedDB() {
    // 1 is the developer version of the DB
    BIRD_WATCHING_IDB_REQ = indexedDB.open(BIRD_WATCHING_IDB_NAME, 1);
    BIRD_WATCHING_IDB_REQ.addEventListener("upgradeneeded", handleUpgrade);
    BIRD_WATCHING_IDB_REQ.addEventListener("success", ()=>{
        console.log("IndexedDB connected successfully in service worker.");
    });
    BIRD_WATCHING_IDB_REQ.addEventListener("error", err => {
        console.log(JSON.stringify(err));
    });
}