let mongoose = require('mongoose');
let Schema = mongoose.Schema; // create new schema

// create a schema
let SightingSchema = new Schema({
    poster_id: {type: String, required: true},
    poster_name: {type: String, required: true},
    img: {type: String, required: true},
    description: {type: String, maxlength: 500},
    // location
    identification: {type: String, required: true},
    sighted_at: {type: Date, default: Date.now()},
    latitude: {type: Number, default: 53.3823417}, // The Diamond location as default values
    longitude: {type: Number, default: -1.4807941},
    messages: [{ type: Schema.Types.ObjectId, ref:'Message' }],
});

// need create and export model
let Sighting = mongoose.model('Sighting', SightingSchema);

module.exports = Sighting;
