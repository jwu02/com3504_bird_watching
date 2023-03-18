// controller deals with the task of inserting new data
// require the controller in routes file and declare the method
let User = require('../models/user');

exports.insert = function (req, res) {
    let user = new User({
        nickname: req.body.nickname
    });

    // save user in db
    user.save().then(() => {
        // send data back to client
        console.log(user);
        // res.locals.user_session_id = user._id;
        res.end(JSON.stringify({ user_session_id: user._id }));
        // res.redirect("/");
    });

    // send data back to client
    // console.log(user);
    // res.locals.user_session_id = user._id;
    // res.redirect("/");
};