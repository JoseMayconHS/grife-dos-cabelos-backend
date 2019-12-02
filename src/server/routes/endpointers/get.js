const route = require('express').Router(),
	productControllers = require('../controllers/product')

route
	.get('/product?:type', productControllers.indexBy)
	.get('/product', productControllers.indexAll)


module.exports = app => app.use(route)
