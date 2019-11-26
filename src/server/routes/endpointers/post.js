const route = require('express').Router()

route.
	get('/post', (req, res) => {
		res.send('post')
	})


module.exports = app => app.use(route)