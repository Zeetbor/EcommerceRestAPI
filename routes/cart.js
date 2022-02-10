const express = require('express');
const cartRouter = express.Router();

cartRouter.get('/', (req, res, next) => {
  res.send('cartPage');
});

cartRouter.put('/', (req, res, next) => {
  res.send();
})

cartRouter.post('/', (req, res, next) => {

})

cartRouter.delete('/', (req, res, next) => {
  res.send();
})

module.exports = cartRouter;
