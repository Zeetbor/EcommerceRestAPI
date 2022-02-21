const db = require('./db/index.js')

const getAllCartsByUserId = (request, response) => {
  const id = request.params.userid;
  db.query('')

}

module.exports = {
  getAllCartsByUserId,
}
