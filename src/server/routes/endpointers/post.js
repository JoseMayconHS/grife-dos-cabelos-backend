const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product'),
	product = require('../../../upload').storageProduct,
	user = require('../../../upload').storageUser,
	upProduct = multer({ storage: product }),
	upUser = multer({ storage: user }),
	fieldsThumbnails = [
		{ name: 'thumbnail_s', maxCount: 1 },
		{ name: 'thumbnail_m', maxCount: 1 },
		{ name: 'thumbnail_l', maxCount: 1 }
	]
	

route.
	post('/product', upProduct.fields(fieldsThumbnails), productControllers.store)


module.exports = app => app.use(route)