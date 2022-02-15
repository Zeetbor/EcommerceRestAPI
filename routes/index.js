var express = require('express');
var router = express.Router();
const db = require("../db");
const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.status(200).send('Authenticated.')
  // successRedirect: '/',
  // failureRedirect: '/login',
});

router.post('/register', (req,res,next) => {
  const {email, password} = req.body;
  db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password], (err, results) => {
    if(err){
      throw err;
    } res.status(201).send(`User ${email} registered.`)
  })
})

module.exports = router;
