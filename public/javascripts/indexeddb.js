const BIRD_WATCHING_IDB_NAME = "BirdWatching";
// name of object store for storing user nickname
const SESSION_OS_NAME = "session_details";
const NICKNAME_KEY = "nickname";
const USER_SESSION_ID_KEY = "user_session_id";
let nickname = null;
let userSessionID = null;

const SIGHTINGS_OS_NAME = "sightings";

const MESSAGES_OS_NAME = "messages";

const handleUpgrade = (ev) => {
    const db = ev.target.result;
    console.log("Upgrading IndexedDB.");
    db.createObjectStore(SESSION_OS_NAME);
    db.createObjectStore(SIGHTINGS_OS_NAME, {autoIncrement: true});
};

const handleSuccess = (ev) => {
    console.log("IndexedDB connected successfully.");

    // prompt user for nickname once IndexedDB created
    let nickname_init = getNickname();
    setUserDetailsInput();

    // put function calls in here to address request not finished issue
    initFormBehaviour();
    appendOfflineSightingsList();
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
        window.userSessionID = userSessionID;
        let userIDInput = document.getElementById("user_session_id");
        if (userIDInput) {
            userIDInput.value = userIDRequest.result;
        }
    };

    const usernameRequest = sessionDetailsStore.get(NICKNAME_KEY);
    usernameRequest.onsuccess = (event) => {
        nickname = usernameRequest.result;
        window.nickname = nickname;
        let username = document.getElementById("username");
        if (username) {
            username.value = usernameRequest.result;
        }
    };
};


///////////////// implementing offline functionality //////////////////////
let addSightingForm = document.getElementById("add-sighting-form");

// change add sighting form action depending on whether online or offline
function initFormBehaviour() {
    navigator.onLine
    const onlineFormAction = "/add_sighting_to_db";
    const offlineFormAction = "javascript:addSightingOffline()";

    if (addSightingForm) {
        // setting form action on page load
        if (navigator.onLine) {
            addSightingForm.action = onlineFormAction;
        } else {
            addSightingForm.action = offlineFormAction;
        }

        // setting action listeners to change action/behaviour on network change
        window.addEventListener('online', () => {
            addSightingForm.action = onlineFormAction;
        });
        window.addEventListener('offline', () => {
            addSightingForm.action = offlineFormAction;
        });
    }
}

function addSightingOffline() {
    // add sighting to IndexedDB
    let addSightingFormData = new FormData(addSightingForm);
    const addSightingFormFields = [
        'user_session_id',
        'username',
        'sighted_at',
        'identification',
        'description',
        'image'
    ];

    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction([SIGHTINGS_OS_NAME], "readwrite");
    const sightingsStore = transaction.objectStore(SIGHTINGS_OS_NAME);

    let imageData;

    // Retrieve the uploaded file from the input element
    const fileInput = document.getElementById('sighting_image');
    const imageFile = fileInput.files[0];

    // // Convert the image file to a binary format
    // const reader = new FileReader();
    // reader.onload = function(event) {
    //     imageData = event.target.result; // This will contain the binary data of the image
    // };
    // reader.readAsArrayBuffer(file); // Use readAsDataURL() if you want to save the image as a base64-encoded string instead

    let sightingObject = {
        user_session_id: addSightingFormData.get('user_session_id'),
        username: addSightingFormData.get('username'),
        sighted_at: addSightingFormData.get('sighted_at'),
        identification: addSightingFormData.get('identification'),
        description: addSightingFormData.get('description'),
        image: imageFile,
    };

    sightingsStore.add(sightingObject)
    // console.log(addSightingFormData.get('image'));
    window.location.replace("/");
}

function appendOfflineSightingsList() {
    const birdWatchingIDB = BIRD_WATCHING_IDB_REQ.result;
    const transaction = birdWatchingIDB.transaction(SIGHTINGS_OS_NAME, "readwrite");
    const sightingsStore = transaction.objectStore(SIGHTINGS_OS_NAME);

    const allSightingsRequest = sightingsStore.openCursor();

    allSightingsRequest.onsuccess = (event) => {
        let cursor = allSightingsRequest.result;

        // console.log(sightingDataArray);
        let sightingsListElement = document.getElementById("sightings-list");

        if (cursor) {
            let key = cursor.primaryKey;
            let sighting = cursor.value;

            let sightingRowElement = document.createElement("tr");
            sightingRowElement.class = "sighting-row";

            let sightingImageTdElement = (() => {
                // // https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
                let tdElement = document.createElement("td");
                let sightingImageElement = document.createElement("img");
                sightingImageElement.class = "img"

                let reader = new FileReader();
                reader.onload = function(e) {
                    sightingImageElement.src = e.target.result;
                };
                reader.readAsDataURL(sighting.image);

                tdElement.append(sightingImageElement);
                return tdElement;

            })();

            sightingRowElement.append(sightingImageTdElement);


            const dataToDisplay = [
                sighting.sighted_at,
                displaySightingIdentificationName(sighting.identification),
                sighting.username,
                `<a href=view_sighting/${key}>View Details</a>`
            ]

            for (const data of dataToDisplay) {
                let sightingDataElement = document.createElement("td");
                sightingDataElement.innerHTML = data;
                sightingRowElement.append(sightingDataElement);
            }

            sightingsListElement.append(sightingRowElement);
            cursor.continue();
        }
    };
}

function displaySightingIdentificationName(name) {
    if (name === "") return "UNKNOWN";
    return name;
}


// function getImageBlob(imagePath) {
//     let imageData;
//
//     // Retrieve the uploaded file from the input element
//     const fileInput = document.getElementById('sighting-image');
//     const file = fileInput.files[0];
//
//     // Convert the image file to a binary format
//     const reader = new FileReader();
//     reader.onload = function(event) {
//         imageData = event.target.result; // This will contain the binary data of the image
//     };
//     reader.readAsArrayBuffer(file); // Use readAsDataURL() if you want to save the image as a base64-encoded string instead
//
//     // // https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
//     // let xhr = new XMLHttpRequest(), blob;
//     // xhr.open("GET", imagePath, true);
//     // xhr.responseType = "blob"; // set the response type to blob
//     // xhr.addEventListener("load", function () {
//     //     if (xhr.status === 200) {
//     //         blob = xhr.response; // file as response
//     //     }
//     // }, false);
//     // xhr.send(); // send XHR
// }