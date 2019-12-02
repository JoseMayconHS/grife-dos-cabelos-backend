const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product'),
	userControllers = require('../controllers/user'),
	product = require('../../../upload').storageProduct,
	user = require('../../../upload').storageUser,
	upProduct = multer({ storage: product }),
	upUser = multer({ storage: user }),
	fieldsThumbnails = [
		{ name: 'thumbnail_s', maxCount: 1 },
		{ name: 'thumbnail_m', maxCount: 1 },
		{ name: 'thumbnail_l', maxCount: 1 },
		{ name: 'thumbnail_p', maxCount: 1 }
	]
	

route
	.post('/product', upProduct.fields(fieldsThumbnails), productControllers.store)
	.post('/user/signup', userControllers.store)
	.post('/user/signin', userControllers.sign)


module.exports = app => app.use(route)
