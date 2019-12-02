const route = require('express').Router(),
	productControllers = require('../controllers/product')

route
	.get('/product?:type', productControllers.indexBy)
	

module.exports = app => app.use(route)
