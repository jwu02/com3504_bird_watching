// controller deals with the task of inserting new data
// require the controller in routes file and declare the method
let Sighting = require('../models/sighting');

exports.insert = function (req, res) {
    let sighting = new Sighting({
        poster_id: req.body.user_session_id,
        poster_name: req.body.username,
        img: req.file.path,
        description: req.body.description,
        identification: req.body.identification,
    });

    // save sighting in db
    sighting.save();

    // send data back to client
    console.log(sighting);
    res.redirect("/");
};