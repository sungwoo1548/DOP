var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('');
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.get('/findid', function(req, res, next) {
    res.render('findid');
});

router.get('/findpw', function(req, res, next) {
    res.render('findpw');
});

module.exports = router;
