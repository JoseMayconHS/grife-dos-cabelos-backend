const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user')

route
	.put('/product/:id', productControllers.update)
	.put('/user/:id', userControllers.update)

module.exports = app => app.use(route)
