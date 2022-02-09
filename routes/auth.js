const express = require('express');

const authRouter = express.Router();

authRouter.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = authRouter;
