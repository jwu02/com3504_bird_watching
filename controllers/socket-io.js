let Message = require('../models/message');
const Sighting = require("../models/sighting");

exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            /**
             * create or joins a room
             */
            socket.on('create or join', (sightingId, userSessionId, username) => {
                socket.join(sightingId);
                socket.emit('joined', sightingId);
            });

            /**
             * send chat messages
             */
            socket.on('chat message', (sightingId, userSessionId, username, msg) => {
                let message = new Message({
                    sighting_id: sightingId,
                    user_id: userSessionId,
                    msg: msg,
                });

                message.save(); // save message in db

                console.log(message);// send data back to client

                io.to(sightingId).emit('chat', sightingId, userSessionId, username, msg);
            });

            /**
             * disconnect
             */

        } catch (e) {
        }
    });
}
