var express = require('express');
var router = express.Router();
const db = require("../db");
const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.render('login');
  res.status(200).send('Authenticated.')
});

module.exports = router;
