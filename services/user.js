const db = require('../db/index.js');

const findUserId = async username => {
  try {
    const result = await db.query('SELECT id from users WHERE email = $1', [username]);
    if(result.rows.length) {
      return result.rows[0];
    }
    return null;
  } catch(err){
    throw err;
  }
}

module.exports = {
  findUserId,
}
