const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand')

route
	.get('/private/both/brand/:page', brandControllers.indexAll)
	.get('/private/both/product/:page', productControllers.indexAll)
	.get('/private/both/product/by/:page', productControllers.indexBy)
	.get('/admin/dashboard/user/:page', userControllers.indexAll)

module.exports = app => app.use(route)
