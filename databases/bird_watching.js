// file for details of database
// define all details for connecting to MongoDB

// setup the connection
// Mongoose automatically require MongoDB
let mongoose = require('mongoose');

// setup URL for connection
let mongoDB = 'mongodb://127.0.0.1/bird_watching';
mongoose.Promise = global.Promise;

try {
    connection = mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        checkServerIdentity: false,
    });
    console.log("Successfully connected to MongoDB.");
} catch (e) {
    console.log(e.message);
}

// remember to load the DB in www/bin with line below
// below var http = require('http');
// var database= require('../databases/characters')
