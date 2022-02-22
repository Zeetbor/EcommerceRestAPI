const express = require('express');
const orderRouter = express.Router();
const db = require('../db/index.js');

const {
  checkAuthenticated
} = require('../services/auth.js');
const {
  findUserId,
} = require('../services/user.js')


orderRouter.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await findUserId(req.user.id)
    const result = await db.query(`SELECT * FROM orders WHERE user_id = $1`,
      [userId.id])
    res.status(200).send(result.rows);
  } catch(err){
    next(err);
  }
});

orderRouter.get('/:id', checkAuthenticated, async (req, res, next) => {
  const orderId = parseInt(req.params.id);
  console.log(orderId);
  try {

    const result = await db.query(`SELECT * FROM orders WHERE id = $1`,
      [orderId]);
    res.status(200).send(result.rows);
  } catch(err){
    next(err);
  }
});

module.exports = orderRouter;
