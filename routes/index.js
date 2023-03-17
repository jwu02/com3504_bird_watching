var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bird Watching' });
});

router.get('/add_sighting', function(req, res, next) {
  res.render('add_sighting', { title: 'Add sighting' });
});

module.exports = router;
