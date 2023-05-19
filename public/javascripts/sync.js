// this function will check if permissions are granted then register the sync
function registerSync() {
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result){
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(function (reg) {
        // here register your sync with a tagname and return it
        reg.sync.register("sync-sightings");
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync'. err.message);
    });
}