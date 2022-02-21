const express = require('express');
const cartRouter = express.Router();
const pgp = require('pg-promise')({
  capSQL: true
});
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

//GET cart
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

//POST new cart
cartRouter.post('/newcart', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await findUserId(req.user.id);
    const cartId = await findCartIdByUser(req.user.id)
    const statement = pgp.helpers.concat([
      // {
      //   query: 'DELETE FROM carts_products WHERE cart_id = $1',
      //   values: [cartId.id]
      // },
      // {
      //   query: 'DELETE FROM carts WHERE user_id = $1',
      //   values: [userId.id]
      // },
      {
        query: 'INSERT INTO carts (user_id) VALUES ($1)',
        values: [userId.id]
      }
    ]);
    const result = await db.query(statement)
    res.status(201).send(result.rows);
  } catch (err) {
    next(err);
  }
});

//req.body = product_name & quantity
//get product_id from product_name
//get cart_id from user_id
//Add cart_id, product_id and quantity to carts_products

//POST add items to cart
cartRouter.post('/items', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const data = await convertReqBody(req.body, cartId);
    const statement = pgp.helpers.insert(data, ['cart_id', 'product_id', 'quantity'], 'carts_products') + 'RETURNING *';
    const result = await db.query(statement);
    res.status(201).send(result.rows);
  } catch (err) {
    next(err);
  }
})

//PUT cart item quantity
cartRouter.put('/items/:productId', checkAuthenticated, async (req, res, next) => {
  const productId = parseInt(req.params.productId);
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const newQuantity = req.body.quantity;
    console.log(newQuantity)
    const result = await db.query('UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *', [newQuantity, cartId.id, productId]);
    res.status(200).send(result.rows);
  } catch (err) {
    next(err)
  }
})

//DELETE item from cart
cartRouter.delete('/items/:productId', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartIdByUser(req.user.id);
    const productId = parseInt(req.params.productId);
    const result = await db.query('DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *', [cartId.id, productId]);
    res.status(204).send(result.rows[0])
  } catch (err) {
    next(err)
  }
})

//DELETE entire cart
cartRouter.delete('/items', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await findUserId(req.user.id);
    const cartId = await findCartIdByUser(req.user.id)
    const statement = pgp.helpers.concat([
      {
        query: 'DELETE FROM carts_products WHERE cart_id = $1',
        values: [cartId.id]
      },
      {
        query: 'DELETE FROM carts WHERE user_id = $1',
        values: [userId.id]
      },
    ]);
    const result = db.query(statement);
    res.status(204).send(result.rows[0])
  } catch (err) {
    next(err)
  }
})

//POST checkout
cartRouter.post('/checkout', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await findUserId(req.user.id);
    const cartId = await findCartIdByUser(req.user.id);
    const cartTotal = await db.query('SELECT SUM(products.price * carts_products.quantity) AS total FROM products JOIN carts_products ON products.id = carts_products.product_id WHERE carts_products.cart_id = $1', [cartId.id]);
    const orderId = await db.query('SELECT MAX (orders.id) FROM orders');
    const data = {
      user_id: userId.id,
      total: cartTotal.rows[0].total,
      status: 'Pending Dispatch'
    };
    console.log(cartId.id)
    const statement = pgp.helpers.concat([{
        query: 'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3)',
        values: [data.user_id, data.total, data.status]
      },
      {
        query: 'INSERT INTO orders_products (order_id, product_id, quantity) SELECT orders.id, carts_products.product_id, carts_products.quantity FROM orders, carts_products WHERE orders.id = (SELECT MAX(orders.id) FROM orders) AND carts_products.cart_id = $1;',
        values: [cartId.id]
      },
      {
        query: 'DELETE FROM carts_products WHERE cart_id = $1',
        values: [cartId.id]
      },
      {
        query: 'DELETE FROM carts WHERE id = $1',
        values: [cartId.id]
      }
    ]);
    // const statement = pgp.helpers.insert(data, null, 'orders') + 'RETURNING *';
    const result = await db.query(statement);
    res.status(201).send(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = cartRouter;
