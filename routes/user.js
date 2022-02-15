const express = require('express');
const userRouter = express.Router();
const userQueries = require("../userQueries.js")

userRouter.get('/', userQueries.getUsers);

userRouter.get('/:id', userQueries.getUserById);

userRouter.put('/:id', userQueries.updateUser);

userRouter.post('/', userQueries.createUser);

userRouter.delete('/:id', userQueries.deleteUser);

module.exports = userRouter;
