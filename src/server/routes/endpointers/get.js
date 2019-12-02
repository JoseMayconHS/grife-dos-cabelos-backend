const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user')

route
	.get('/product?:type', productControllers.indexBy)
	.get('/product', productControllers.indexAll)
	.get('/user?:page', userControllers.indexAll)

module.exports = app => app.use(route)
