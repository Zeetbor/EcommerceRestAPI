const db = require('../db/index.js');

const findCartIdByUser = async username => {
  try {
    const result = await db.query('SELECT * FROM carts WHERE user_id IN (SELECT id FROM users WHERE email = $1)', [username])
    if (result.rows.length) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    throw err;
  }
}

const findProductIdByName = async productName => {
  try {
    const result = await db.query('SELECT id FROM products WHERE product_name = $1', [productName])
    if (result.rows.length) {
      return result.rows[0];
    } return null;
  } catch(err){
    throw (err)
  }
}

const convertReqBody = async (reqBody, cartId) => {
  try {
    for(const element of reqBody){
      element.cart_id = cartId.id;
      const productId = await findProductIdByName(element.product_name);
      element.product_id = productId.id;
    }
    return reqBody;
  } catch(err) {
    throw err;
  }
};


module.exports = {
  findCartIdByUser,
  findProductIdByName,
  convertReqBody
}
