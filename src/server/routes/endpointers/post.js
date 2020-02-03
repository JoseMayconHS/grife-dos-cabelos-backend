const route = require('express').Router(),
	multer = require('multer'),
	admControllers = require('../controllers/adm'),
	productControllers = require('../controllers/product'),
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	pushNotificationControllers = require('../controllers/pushNotification'),
	product = require('../../../upload').storageProduct,
	fileFilter = require('../../../upload').fileFilter,
	brand = require('../../../upload').storageBrand,
	upProduct = multer({ storage: product, fileFilter }),
	upBrand = multer({ storage: brand, fileFilter })
	
route
	// App
	.post('/app/expo', pushNotificationControllers.store)
	.post('/app/user/signup', userControllers.store)
	.post('/app/user/signin', userControllers.sign)
	.post('/app/user/forgot', userControllers.forgot)
	// Dashboard
	.post('/dashboard/signin', admControllers.sign)
	.post('/dashboard/signup', admControllers.store)
	.post('/admin/dashboard/reconnect', admControllers.reconnect)
	.post('/admin/dashboard/product', upProduct.single('thumbnail'), productControllers.store)
	.post('/admin/dashboard/brand', upBrand.single('thumbnail'), brandControllers.store)
	.post('/admin/dashboard/type', typeControllers.store)
	.post('/admin/dashboard/expo', pushNotificationControllers.send)
	
	// .post('/app/user/buy', userControllers.buy)

module.exports = app => app.use(route)
