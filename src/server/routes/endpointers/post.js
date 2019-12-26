const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product'),
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	pushNotificationControllers = require('../controllers/pushNotification'),
	product = require('../../../upload').storageProduct,
	fileFilter = require('../../../upload').fileFilter,
	brand = require('../../../upload').storageBrand,
	upProduct = multer({ storage: product, fileFilter }),
	upBrand = multer({ storage: brand, fileFilter })
	
route
	.post('/admin/dashboard/product', upProduct.single('thumbnail'), productControllers.store)
	.post('/admin/dashboard/brand', upBrand.single('thumbnail'), brandControllers.store)
	.post('/admin/dashboard/expo', pushNotificationControllers.store)
	.post('/admin/dashboard/expo/send', pushNotificationControllers.send)
	.post('/app/user/signup', userControllers.store)
	.post('/app/user/signin', userControllers.sign)

module.exports = app => app.use(route)
