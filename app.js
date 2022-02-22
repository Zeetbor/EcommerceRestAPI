var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
//Swagger

require('dotenv').config();
//environment variables from .env
var db = require('./db');
//db adapter file
var passport = require('passport');
//authentication middleware
var LocalStrategy = require('passport-local').Strategy;
//use passport-local Strategy
var session = require('express-session');
//helps manage everything session-related, including cookies

//ROUTERS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');

var app = express();

//sets view engine
app.set('view engine', 'pug');
app.set('view options', {
  layout: false
});
app.set('views', path.join(__dirname, 'views'));

//PASSPORT

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
// This is the basic express session({..}) initialization.

app.use(passport.initialize())
// init passport on every route call
app.use(passport.session())
// allow passport to use 'express-session

//wheb submitting from input forms passport expects request.body fields as req.username (not email) and req.password
authUser = (email, password, done) => {
  db.query('SELECT email, password FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      return next(err)
    }
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return done(null, false, {
        message: 'Incorrect email or password.'
      })
    }
    return done(null, result.rows[0])
  })
};
// The 'authUser' function contains the steps to authenticate a user, and will return the 'authenticated user'.

passport.use(new LocalStrategy(authUser));

// used to serialize the user for the session - user.email saved to session (req.session.passport = {email: '...'})
passport.serializeUser((user, done) => {
  done(null, user.email);
});

// used to deserialize the user - id is user.email saved from serializeUser function
passport.deserializeUser((id, done) => {
  done(null, {id});
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
