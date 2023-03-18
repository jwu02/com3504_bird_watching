const BIRD_WATCHING_IDB_NAME = "BirdWatching";
// name of object store for storing user nickname
const SESSION_OS_NAME = "session_details";

const handleUpgrade = (ev) => {
    const db = ev.target.result;
    console.log("Upgrading IndexedDB.");
    db.createObjectStore(SESSION_OS_NAME);
}

const handleSuccess = (ev) => {
    console.log("IndexedDB connected successfully.");

    // prompt user for nickname once IndexedDB created
    const nickname = getNickname();
};

function handleError (err) {
    console.log(JSON.stringify(err));
};

// IIFE (immediately invoked function expression)
const BIRD_WATCHING_IDB_REQ = (() => {
    // 1 is the developer version of the DB
    const req = indexedDB.open(BIRD_WATCHING_IDB_NAME, 1);
    req.addEventListener("upgradeneeded", handleUpgrade);
    req.addEventListener("success", handleSuccess);
    req.addEventListener("error", handleError);

    return req;
})()

const getNickname = () => {
    const NICKNAME_KEY = "nickname";
    const USER_SESSION_ID_KEY = "user_session_id";

    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readwrite");
    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

    const nickname_request = sessionDetailsStore.get(NICKNAME_KEY);
    nickname_request.onsuccess = (event) => {
        let nickname = nickname_request.result;
        // prompt user for nickname if it's not defined in IndexedDB
        if (!nickname) {
            nickname = prompt("Please enter a nickname");
            sessionDetailsStore.add(nickname, NICKNAME_KEY);

            fetch("/add_nickname_to_db", {
                method: "POST",
                headers: { // specify we are POSTing JSON-encoded data
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({nickname: nickname})
            }).then((response) => response.json())
                .then((data) => {
                    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
                    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readwrite");
                    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

                    sessionDetailsStore.add(data.user_session_id, USER_SESSION_ID_KEY);
                });
        }

        let addSightingBtn = document.getElementById("add_sighting_btn");
        addSightingBtn.disabled = false;

        return nickname;
    }
}
