const express = require('express');
const cartRouter = express.Router();
const pgp = require('pg-promise')({ capSQL: true });
const db = require('../db/index.js')
const {
  checkAuthenticated
} = require('../services/auth.js');
const {
  findCartIdByUser,
  findProductIdByName,
  convertReqBody
} = require('../services/cart.js')
const {
  findUserId,
} = require('../services/user.js')

cartRouter.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartIdByUser(req.user.id)
    const result = await db.query(`SELECT products.product_name, products.price, carts_products.quantity
                              FROM products
                              JOIN carts_products
                              ON products.id = carts_products.product_id
                              WHERE carts_products.cart_id = $1`,
      [cartId.id])
    res.status(200).send(result.rows)
  } catch (err) {
    next(err)
  }
});

cartRouter.put('/items/:productId', checkAuthenticated, async (req, res, next) => {
  const productId = parseInt(req.params.productId);
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const newQuantity = req.body.quantity;
    const result = await db.query('UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *', [newQuantity, cartId.id, productId]);
    res.status(200).send(result.rows);
  }
  catch(err){
    next(err)
  }
})

cartRouter.post('/newcart', checkAuthenticated, async (req, res, next) => {
    try {
      const userId = await findUserId(req.user.id);
      const result = await db.query('INSERT INTO carts (user_id) VALUES ($1)', [userId.id])
      res.status(201).send(result.rows);
    } catch(err){
      next(err);
    }
}) //To do: add check for pre-existing cart - 1 cart per user

//req.body = product_name & quantity
//get product_id from product_name
//get cart_id from user_id
//Add cart_id, product_id and quantity to carts_products

cartRouter.post('/items', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const data = await convertReqBody(req.body, cartId);
    const statement = pgp.helpers.insert(data, ['cart_id', 'product_id', 'quantity'], 'carts_products') + 'RETURNING *';
    const result = await db.query(statement)
    res.status(201).send(result.rows);
  } catch(err){
    next(err);
  }
})

cartRouter.delete('/items/:productId', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const productId = parseInt(req.params.productId);
    const result = await db.query('DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *', [cartId.id, productId]);
    res.status(204).send(result.rows[0])
  } catch(err){
    next(err)
  }
})

cartRouter.post('/checkout', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await findUserId(req.user.id);
    const cartId = await findCartIdByUser(req.user.id);
    const cartTotal = await db.query('SELECT SUM(products.price * carts_products.quantity) AS total FROM products JOIN carts_products ON products.id = carts_products.product_id WHERE carts_products.cart_id = $1', [cartId.id]);
    const data = {
      user_id: userId.id,
      total: cartTotal.rows[0].total,
      status: 'Pending Dispatch'
    };
    const statement = pgp.helpers.insert(data, null, 'orders') + 'RETURNING *';
    const result = await db.query(statement);
    res.status(201).send(result.rows[0]);
  } catch (err){
    next(err);
  }
})

module.exports = cartRouter;
