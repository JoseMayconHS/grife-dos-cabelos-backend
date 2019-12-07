const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product'),
	userControllers = require('../controllers/user'),
	product = require('../../../upload').storageProduct,
	fileFilter = require('../../../upload').fileFilter,
	user = require('../../../upload').storageUser,
	upProduct = multer({ storage: product, fileFilter }),
	upUser = multer({ storage: user })
	
route
	.post('/product', upProduct.single('thumbnail'), productControllers.store)
	.post('/user/signup', userControllers.store)
	.post('/user/signin', userControllers.sign)

module.exports = app => app.use(route)
