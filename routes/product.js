const express = require('express');
const productRouter = express.Router();
const productQueries = require('../productQueries.js')

productRouter.get('/', productQueries.getProducts);

productRouter.get('/:id', (req, res, next) => {
  res.send();
})

productRouter.put('/:id', (req, res, next) => {
  res.send();
})

productRouter.post('/:id', (req, res, next) => {
  res.send();
})

productRouter.delete('/:id', (req, res, next) => {
  res.send();
})

module.exports = productRouter;
