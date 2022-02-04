const express = require('express');
const userRouter = express.Router();

userRouter.get('/user', (req, res, next) => {
  res.send();
});

usertRouter.get('/user:id', (req, res, next) => {
  res.send();
})

userRouter.put('/user', (req, res, next) => {
  res.send();
})

userRouter.post('/user', (req, res, next) => {

})

userRouter.delete('/user', (req, res, next) => {
  res.send();
})

module.exports = userRouter;
