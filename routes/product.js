const express = require('express');
const productRouter = express.Router();

productRouter.get('/products', (req, res, next) => {
  res.send();
});

productRouter.get('/product:id', (req, res, next) => {
  res.send();
})

productRouter.put('/products', (req, res, next) => {
  res.send();
})

productRouter.post('/products', (req, res, next) => {
  res.send();
})

productRouter.delete('/products', (req, res, next) => {
  res.send();
})

module.exports = productRouter;
