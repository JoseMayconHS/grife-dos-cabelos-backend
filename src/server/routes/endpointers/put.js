const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand')

route
	.put('/admin/dashboard/product/:_id', productControllers.update)
	.put('/private/app/user', userControllers.update)
	.put('/admin/dashboard/brand/:_id', brandControllers.update)

module.exports = app => app.use(route)
