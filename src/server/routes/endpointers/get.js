const route = require('express').Router(),
	productControllers = require('../controllers/product')
	userControllers = require('../controllers/user'),
	admControllers = require('../controllers/adm'),
	brandControllers = require('../controllers/brand'),
	typeControllers = require('../controllers/type'),
	pushNotificationControllers = require('../controllers/pushNotification')

route
	.get('/debug', (req, res) => res.send('<h1>Funcionando....1</h1>'))
	// Ambos
	// Marca
	.get('/app/user/generate', userControllers.generate)
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
	.get('/private/both/type/by/:page', typeControllers.indexBy)
	// --- Dashboard ---
	// Usuário
	.get('/admin/dashboard/user/:page', userControllers.indexAll)	
	.get('/admin/dashboard/user/search/:word/:page', userControllers.search)
	// Quantidade
	.get('/admin/dashboard/qtd/user', userControllers.qtd)
	.get('/admin/dashboard/qtd/product', productControllers.qtd)
	.get('/admin/dashboard/qtd/brand', brandControllers.qtd)
	.get('/admin/dashboard/qtd/expo', pushNotificationControllers.qtd)
	// Notificações
	.get('/admin/dashboard/notifications', pushNotificationControllers.recents)
	// Formulário
	.get('/admin/dashboard/form', admControllers.formSelects)
	// Cards
	.get('/admin/dashboard/cards', admControllers.cards)

module.exports = app => app.use(route)
