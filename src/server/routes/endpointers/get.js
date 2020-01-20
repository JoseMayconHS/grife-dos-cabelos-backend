const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	pushNotificationControllers = require('../controllers/pushNotification')

route
	// Ambos
	// Marca
	.get('/private/both/brand/:page', brandControllers.indexAll)
	.get('/private/both/brand/by/:page', brandControllers.indexBy)
	.get('/private/both/brand/search/:word/:page', brandControllers.search)
	// Produto
	.get('/private/both/product/:page', productControllers.indexAll)
	.get('/private/both/product/by/:page', productControllers.indexBy)
	.get('/private/both/product/search/:word/:page', productControllers.search)
	.get('/private/app/swiper', productControllers.swiper)
	// Tipos
	.get('/private/both/type/:page', typeControllers.indexAll)
	// --- Dashboard ---
	// Usuário
	.get('/admin/dashboard/user/:page', userControllers.indexAll)	
	.get('/admin/dashboard/user/search/:word/:page', userControllers.search)
	// Quantidade
	.get('/admin/dashboard/qtd/user', userControllers.qtd)
	.get('/admin/dashboard/qtd/product', productControllers.qtd)
	.get('/admin/dashboard/qtd/brand', brandControllers.qtd)
	.get('/admin/dashboard/qtd/expo', pushNotificationControllers.qtd)
	//Notificações
	.get('/admin/dashboard/notifications', pushNotificationControllers.recents)

module.exports = app => app.use(route)
