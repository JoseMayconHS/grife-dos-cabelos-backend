const route = require('express').Router(),
	productControllers = require('../controllers/product'),
  userControllers = require('../controllers/user'),
  brandControllers = require('../controllers/brand'),
  typeControllers = require('../controllers/type'),
  admControllers = require('../controllers/adm'),
  pushNotificationControllers = require('../controllers/pushNotification')

route
  // Dashboard
  .delete('/admin/dashboard/brand/:id', brandControllers.remove)
  .delete('/admin/dashboard/product/:id', productControllers.remove)
  .delete('/admin/dashboard/user/:id', userControllers.remove)
  .delete('/admin/dashboard/notification/:index', pushNotificationControllers.remove)
  .delete('/admin/dashboard/type/:id', typeControllers.remove)
  .delete('/admin/dashboard/user/:id', admControllers.removeUser)

module.exports = app => app.use(route)
