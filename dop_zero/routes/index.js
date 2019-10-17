var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  
    title: 'Express',
    user_id : req.session.user_id,
    loginState: req.session.loginState
  });
  console.log("세션ID=", req.sessionID)
});

module.exports = router;