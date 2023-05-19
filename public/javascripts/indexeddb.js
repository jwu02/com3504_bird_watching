const BIRD_WATCHING_IDB_NAME = "BirdWatching";
// name of object store for storing user nickname
const SESSION_OS_NAME = "session_details";
const NICKNAME_KEY = "nickname";
const USER_SESSION_ID_KEY = "user_session_id";
let nickname = null;
let userSessionID = null;

const handleUpgrade = (ev) => {
    const db = ev.target.result;
    console.log("Upgrading IndexedDB.");
    db.createObjectStore(SESSION_OS_NAME);
};

const handleSuccess = (ev) => {
    console.log("IndexedDB connected successfully.");

    // prompt user for nickname once IndexedDB created
    let nickname_init = getNickname();
    setUserDetailsInput();
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
})();

const getNickname = () => {
    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readwrite");
    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

    const nicknameRequest = sessionDetailsStore.get(NICKNAME_KEY);
    nicknameRequest.onsuccess = (event) => {
        let nickname = nicknameRequest.result;
        // prompt user for nickname if it's not defined in IndexedDB
        if (!nickname) {
            nickname = prompt("Please enter a nickname");
            sessionDetailsStore.add(nickname, NICKNAME_KEY);

            // store nickname in MongoDB
            fetch("/add_nickname_to_db", {
                method: "POST",
                headers: { // specify we are POSTing JSON-encoded data
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({nickname: nickname})
            }).then((response) => response.json())
                .then((data) => {
                    // store record ID response from server in IndexedDB
                    // need to construct transaction again to write to object store
                    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
                    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readwrite");
                    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

                    sessionDetailsStore.add(data.user_session_id, USER_SESSION_ID_KEY);
                });
        };

        let addSightingBtn = document.getElementById("add_sighting_btn");
        if (addSightingBtn) addSightingBtn.disabled = false;

        return nickname;
    }
};

const getUserID = () => {
    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readonly");
    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

    const userIDRequest = sessionDetailsStore.get(USER_SESSION_ID_KEY);
    userIDRequest.onsuccess = (event) => {
        return userIDRequest.result;
    };
}

const setUserDetailsInput = () => {
    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction([SESSION_OS_NAME], "readonly");
    const sessionDetailsStore = transaction.objectStore(SESSION_OS_NAME);

    const userIDRequest = sessionDetailsStore.get(USER_SESSION_ID_KEY);
    userIDRequest.onsuccess = (event) => {
        userSessionID = userIDRequest.result;
        let userIDInput = document.getElementById("user_session_id");
        if (userIDInput) {
            userIDInput.value = userIDRequest.result;
        }
    };

    const usernameRequest = sessionDetailsStore.get(NICKNAME_KEY);
    usernameRequest.onsuccess = (event) => {
        nickname = usernameRequest.result;
        let username = document.getElementById("username");
        if (username) {
            username.value = usernameRequest.result;
        }
    };
};




let roomId = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init_socketio() {
    // called when someone joins the room
    socket.on('joined', function (sightingId) {
        roomId = sightingId;
        console.log(userSessionID);

        console.log("Joined room successfully");
    });
    // called when a message is received
    socket.on('chat', function (room, userId, username, chatText) {
        let who = username;
        if (userId === userSessionID) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

    connectToRoom(); // function called each time sighting page loaded
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    var msg = document.getElementById('chat_input').value;

    socket.emit('chat message', roomId, userSessionID, nickname, msg); // emit message to server
}

/**
 * used to connect to a room. It gets
 * - the user name and room number from the interface using document.getElementById('').value
 * - uses socket.emit('create or join') to join the room
 */
function connectToRoom() {
    // using the sighting records IDs as unique rooms
    var sightingId = document.getElementById('sighting_id').innerHTML;
    socket.emit('create or join', sightingId, userSessionID, nickname);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}
