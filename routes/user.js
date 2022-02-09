const express = require('express');
const userRouter = express.Router();
const userQueries = require("../userQueries.js")

userRouter.get('/', userQueries.getUsers);

userRouter.get('/:id', (req, res, next) => {
  res.send();
})

userRouter.put('/:id', (req, res, next) => {
  res.send();
})

userRouter.post('/user', (req, res, next) => {

})

userRouter.delete('/user', (req, res, next) => {
  res.send();
})

module.exports = userRouter;
