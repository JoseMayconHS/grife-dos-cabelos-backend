const route = require('express').Router(),
	multer = require('multer'),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	admControllers = require('../controllers/adm'),
	{  updateProductThumbnail, fileFilter, updateBrandThumbnail } = require('../../../upload'),
	putProduct = multer({ storage: updateProductThumbnail, fileFilter }),
	putBrand = multer({ storage: updateBrandThumbnail, fileFilter })

route
	.put('/app/user/changepassword/:id', userControllers.changepassword)
	// App
	.put('/private/app/user', userControllers.update)
	// Dashboard
	.put('/admin/dashboard/product/:id', productControllers.update)
	.put('/admin/dashboard/brand/:id', brandControllers.update)
	.put('/admin/dashboard/type/:id', typeControllers.update)
	.put('/admin/dashboard/user/:id', admControllers.toggleUserSignUp)
	.put('/admin/dashboard/product/thumbnail/:id', putProduct.single('thumbnail'), productControllers.update_thumbnail)
	.put('/admin/dashboard/brand/thumbnail/:id', putBrand.single('thumbnail'), brandControllers.update_thumbnail)

module.exports = app => app.use(route)
