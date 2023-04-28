let mongoose = require('mongoose');
let Schema = mongoose.Schema; // create new schema

// create a schema
let SightingSchema = new Schema({
    poster_id: {type: String, required: true},
    poster_name: {type: String, required: true},
    img: {type: String, required: true},
    description: {type: String, max: 100},
    // location
    identification: {type: String, required: true},
    sighted_at: {type: Date, default: Date.now()},
});

// need create and export model
let Sighting = mongoose.model('Sighting', SightingSchema);

module.exports = Sighting;