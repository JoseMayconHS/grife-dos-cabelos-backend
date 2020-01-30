const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	{  updateProductThumbnail, fileFilter, updateBrandThumbnail } = require('../../../upload'),
	putProduct = multer({ storage: updateProductThumbnail, fileFilter }),
	putBrand = multer({ storage: updateBrandThumbnail, fileFilter })

route
	// App
	.put('/private/app/user', userControllers.update)
	// Dashboard
	.put('/admin/dashboard/product/:_id', productControllers.update)
	.put('/admin/dashboard/brand/:_id', brandControllers.update)
	.put('/admin/dashboard/type/:_id', typeControllers.update)
	.put('/admin/dashboard/product/thumbnail/:_id', putProduct.single('thumbnail'), productControllers.update_thumbnail)
	.put('/admin/dashboard/brand/thumbnail/:_id', putBrand.single('thumbnail'), brandControllers.update_thumbnail)

module.exports = app => app.use(route)
