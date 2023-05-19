let roomId = null;
let socket = io();

/**
 * called by <body onload> in viewing.ejs
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init_socketio() {
    // called when someone joins the room
    socket.on('joined', function (sightingId) {
        roomId = sightingId;
        console.log("Joined room successfully");
    });
    // called when a message is received
    socket.on('chat', function (room, userId, username, chatText) {
        writeOnHistory('<b>' + window.nickname + ':</b> ' + chatText);
    });

    connectToRoom(); // function called each time sighting page loaded
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    var msg = document.getElementById('chat_input').value;

    socket.emit('chat message', roomId, window.userSessionID, window.nickname, msg); // emit message to server
}

/**
 * used to connect to a room. It gets
 * - the user name and room number from the interface using document.getElementById('').value
 * - uses socket.emit('create or join') to join the room
 */
function connectToRoom() {
    // using the sighting records IDs as unique rooms
    var sightingId = document.getElementById('sighting_id').innerHTML;
    socket.emit('create or join', sightingId, window.userSessionID, window.nickname);
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
