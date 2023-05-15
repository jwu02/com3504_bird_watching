let mongoose = require('mongoose');
let Schema = mongoose.Schema; // create new schema

// create a schema
let MessageSchema = new Schema({
    sighting_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Sighting'},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    msg: {type: String, required: true},
}, {
    timestamps: true,
});

// need create and export model
let Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
