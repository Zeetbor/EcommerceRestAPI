const db = require('./db/index.js');

const getUsers = (request, response) => {
  db.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      throw err
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (err, results) => {
    if (err) {
      throw err
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (err, results) => {
      if (err) {
        throw err
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  db.query('DELETE FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
