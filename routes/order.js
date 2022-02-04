const express = require('express');
const orderRouter = express.Router();

orderRouter.get('/order', (req, res, next) => {
  res.send();
});

orderRouter.put('/order', (req, res, next) => {
  res.send();
})

orderRouter.post('/order', (req, res, next) => {

})

orderRouter.delete('/order', (req, res, next) => {
  res.send();
})

module.exports = orderRouter;
