const db = require('../db');
const findUserId = require('./user.js');

const checkPayment = async (req, res, next) => {
    try {
        const userId = await findUserId(req.user.id);
        const { cardNumber, expiration} = req.body
        const cardResult = await db.query('SELECT id FROM payment WHERE card_number = $1 AND expiry = $2 AND user_id = $3', [cardNumber,expiry, userId])
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
