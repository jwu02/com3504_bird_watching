// this function will check if permissions are granted then register the sync
function registerSync() {
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result){
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(async function (reg) {
        // here register your sync with a tagname and return it
        reg.sync.register("sync-sightings");

        // if (reg.periodicSync) {
        //     // Periodic Background Sync is supported.
        //     const status = await navigator.permissions.query({name: 'periodic-background-sync'});
        //     if (status.state === 'granted') { // Do something
        //         await reg.periodicSync.register('sync-sightings', { minInterval: 100 });
        //         console.log("periodic sync registration finished");
        //     } else { // NO permission.
        //     }
        // } else { // Periodic Background Sync isn't supported.
        //     console.log("Periodic sync is not supported");
        // }
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync'. err.message);
    });
}