const INDEXEDDB_NAME = "BirdWatching";
// name of object store for storing user nickname
const SESSION_OS_NAME = "session_details";

const handleUpgrade = (ev) => {
    const db = ev.target.result;
    console.log("Upgrading IndexedDB.");
    db.createObjectStore(SESSION_OS_NAME);
}

const handleSuccess = (ev) => {
    console.log("IndexedDB connected successfully.");
    checkNicknameExist();
};

function handleError (err) {
    console.log(JSON.stringify(err));
};

// 1 is the developer version of the DB
const requestIndexedDB = indexedDB.open(INDEXEDDB_NAME, 1);
requestIndexedDB.addEventListener("upgradeneeded", handleUpgrade);
requestIndexedDB.addEventListener("success", handleSuccess);
requestIndexedDB.addEventListener("error", handleError);

function checkNicknameExist() {
    const birdWatchingIDB = requestIndexedDB.result
    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readwrite");
    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);
    const nickname_request = sessionDetailsStore.get("nickname");
    nickname_request.onsuccess = (event) => {
        if (nickname_request.result === undefined) {
            const nickname = prompt("Please enter a nickname");
            sessionDetailsStore.add(nickname, "nickname");
        }

        let add_sighting_btn = document.getElementById("add_sighting_btn");
        add_sighting_btn.disabled = false;
    }
}
