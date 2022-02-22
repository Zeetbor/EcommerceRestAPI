const db = require('../db');
// const findUserId = require('./user.js');

const checkPayment = async (req, res, next) => {
    try {
        const getUserId = await db.query('SELECT id from users WHERE email = $1', [req.user.id]);
        const userId = parseInt(getUserId.rows[0].id)
        const cardNumber = req.body.card_number;
        const expiry = req.body.expiry;
        const cardResult = await db.query('SELECT id FROM payment WHERE card_number = $1 AND expiry = $2 AND user_id = $3', [cardNumber,expiry, userId]);
        if(cardResult.rows.length) {
          return next()
        }
        res.status(401).send()
      } catch(err) {
        next(err)
      }
}

module.exports = {
    checkPayment,
}
