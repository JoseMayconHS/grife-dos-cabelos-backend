const route = require('express').Router(),
	productControllers = require('../controllers/product'),
  userControllers = require('../controllers/user'),
  brandControllers = require('../controllers/brand')

route
  // Dashboard
  .delete('/admin/dashboard/brand/:_id', brandControllers.remove)
  .delete('/admin/dashboard/product/:_id', productControllers.remove)
  .delete('/admin/dashboard/user/:_id', userControllers.remove)

module.exports = app => app.use(route)
