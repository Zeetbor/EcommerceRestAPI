const express = require('express');
const productRouter = express.Router();
const productQueries = require('../productQueries.js')

productRouter.get('/', productQueries.getProducts);

productRouter.get('/:id', productQueries.getProductById);

productRouter.put('/:id', productQueries.updateProduct);

productRouter.post('/', productQueries.addProduct);

productRouter.delete('/:id', productQueries.deleteProduct);

productRouter.get('/category/:category', productQueries.getAllProductsByCategory);

module.exports = productRouter;
