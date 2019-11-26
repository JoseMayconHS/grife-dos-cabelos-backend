const route = require('express').Router()

route.
	get('/get', (req, res) => {
		res.send('get')
	})


module.exports = app => app.use(route)
