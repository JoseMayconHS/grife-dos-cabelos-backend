const route = require('express').Router()

route.
	post('/poduct', (req, res) => {
		res.send('post')
	})


module.exports = app => app.use(route)