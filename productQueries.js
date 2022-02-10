const db = require('./db/index.js');

const getProducts = (request, response) => {
  db.query('SELECT * FROM products ORDER BY id ASC', (err, results) => {
    if(err){
      throw err
    }
    response.status(200).json(results.rows);
  })
}

module.exports = {
  getProducts,
}
