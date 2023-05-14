var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user');
var sighting_controller = require('../controllers/sighting');
var Sighting = require('../models/sighting');

var multer = require('multer');

// storage defines the storage options to be used for file upload with multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // make the file name the date + the file extension
    filename = Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  Sighting.find({}).then(function(results) {

    res.render('index', { title: 'Bird Watching', sightings_list: results });
  });
});

router.get('/add_sighting', function(req, res, next) {
  res.render('add_sighting', { title: 'Add sighting' });
});

router.post('/add_sighting_to_db', upload.single('image'), sighting_controller.insert);

router.get('/view_sighting/:id', function(req, res, next) {
  Sighting.findById(req.params.id).then(function(result) {
    res.render('viewing', { title: 'View sighting', sighting: result });
  });
});

router.post('/add_nickname_to_db', user_controller.insert);


module.exports = router;
