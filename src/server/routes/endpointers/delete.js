const route = require('express').Router(),
	productControllers = require('../controllers/product'),
  userControllers = require('../controllers/user'),
  brandControllers = require('../controllers/brand'),
  typeControllers = require('../controllers/type'),
  pushNotificationControllers = require('../controllers/pushNotification')

route
  // Dashboard
  .delete('/admin/dashboard/brand/:_id', brandControllers.remove)
  .delete('/admin/dashboard/product/:_id', productControllers.remove)
  .delete('/admin/dashboard/user/:_id', userControllers.remove)
  .delete('/admin/dashboard/notification/:index', pushNotificationControllers.remove)
  .delete('/admin/dashboard/type/:_id', typeControllers.remove)

module.exports = app => app.use(route)
