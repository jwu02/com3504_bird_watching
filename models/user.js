let mongoose = require('mongoose');
let Schema = mongoose.Schema; // create new schema

// create a schema
let UserSchema = new Schema({
    nickname: {type: String, required: true, max: 100}
});

// need create and export model
let User = mongoose.model('User', UserSchema);

module.exports = User;