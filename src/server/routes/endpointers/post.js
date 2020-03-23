const route = require('express').Router(),
	multer = require('multer'),
	admControllers = require('../controllers/adm'),
	productControllers = require('../controllers/product'),
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	pushNotificationControllers = require('../controllers/pushNotification'),
	fileFilter = require('../../../upload').fileFilter,
	storages = require('../../../upload').storages,
	productStorage = storages.product,
	brandStorage = storages.brand,
	upProduct = multer({ storage: productStorage.local, fileFilter }),
	upBrand = multer({ storage: brandStorage.local, fileFilter }),
	upProductS3 = multer({ storage: productStorage.s3.init, fileFilter }),	
	upBrandS3 = multer({ storage: brandStorage.s3.init, fileFilter })
		
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
	.post('/admin/dashboard/product', upProductS3.single('thumbnail'), productControllers.store)
	.post('/admin/dashboard/brand', upBrandS3.single('thumbnail'), brandControllers.store)
	.post('/admin/dashboard/type', typeControllers.store)
	.post('/admin/dashboard/expo', pushNotificationControllers.send)

	// .post('/app/user/buy', userControllers.buy)

module.exports = app => app.use(route)
