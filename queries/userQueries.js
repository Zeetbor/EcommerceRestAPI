const db = require('../db/index.js');

const getUsers = (request, response) => {
  db.query('SELECT * FROM users ORDER BY id ASC', [], (err, results) => {
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
    response.status(200).json(results.rows);
  })
}

const createUser = (request, response) => {
  const {email, password } = request.body

  db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
    	throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { email, password } = request.body

    db.query(
      'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *',
      [email, password, id],
      (error, results) => {
        if (error) {
          throw error
        }
        if (typeof results.rows == 'undefined') {
        	response.status(404).send(`Resource not found`);
        } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        	response.status(404).send(`User not found`);
        } else {
    	 	  response.status(200).send(`User modified with ID: ${results.rows[0].id}`)
        }
      }
    )
  }

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  db.query('DELETE FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err
    }
    response.status(204).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
