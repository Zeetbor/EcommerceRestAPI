const db = require('../db/index.js');

const getProducts = (request, response) => {
  db.query('SELECT * FROM products ORDER BY id ASC', [], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);
  db.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw (error);
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
      response.status(404).send(`Product not found`);
    }
    response.status(200).json(results.rows[0])
  })
}

const addProduct = (request, response) => {
  const {
    product_name,
    category,
    description,
    price
  } = request.body;

  db.query('INSERT INTO products (product_name, category, description, price) VALUES($1, $2, $3, $4) RETURNING *', [product_name, category, description, price], (error, results) => {
    if(error){
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
      response.status(404).send(`Could not add product`);
    }
    response.status(201).send(`Product added with ID: ${results.rows[0].id}`)
  })
}

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    product_name,
    category,
    description,
    price
  } = request.body;

  db.query('UPDATE products SET product_name = $1, category = $2, description = $3, price = $4 WHERE id =$5', [product_name, category, description, price, id], (error, results) => {
    if(error){
      throw error;
    }   if (typeof results.rows == 'undefined') {
        response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`Product not found`);
      } else {
          response.status(200).send(`Product with ID: ${results.rows[0].id} updated`)
      }
    }
  )
};

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id);
  db.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send(`Product with ID: ${id} deleted.`);
  })
};

const getAllProductsByCategory = (request, response) => {
  const category = request.params.category;
  db.query('SELECT * FROM products WHERE category = $1', [category], (error, results) => {
    if(error){
      throw error;
    } response.status(200).json(results.rows)
  })
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsByCategory
}
