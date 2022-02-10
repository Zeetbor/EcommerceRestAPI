const express = require('express');
const orderRouter = express.Router();

orderRouter.get('/', (req, res, next) => {
  res.send('order page');
});

orderRouter.put('/:id', (req, res, next) => {
  res.send();
})

orderRouter.post('/:id', (req, res, next) => {

})

orderRouter.delete('/:id', (req, res, next) => {
  res.send();
})

module.exports = orderRouter;
