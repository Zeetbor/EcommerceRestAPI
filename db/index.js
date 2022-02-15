const {Pool, Client} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ecommerce',
  password: 'postgres',
  port: 5433,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Ecommerce',
//   password: 'postgres',
//   port: 5433,
// })
// client.connect()
//
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })
