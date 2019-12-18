const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand')

route
	.get('/both/brand/:page', brandControllers.indexAll)
	.get('/both/product/:page', productControllers.indexAll)
	.get('/both/product/by/:page', productControllers.indexBy)
	.get('/admin/dashboard/user/:page', userControllers.indexAll)

module.exports = app => app.use(route)
