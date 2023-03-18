var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bird Watching' });
});

router.get('/add_sighting', function(req, res, next) {
  res.render('add_sighting', { title: 'Add sighting' });
});

router.post('/add_nickname_to_db', user_controller.insert);


module.exports = router;
