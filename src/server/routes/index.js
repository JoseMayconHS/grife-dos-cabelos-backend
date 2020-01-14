const path = require('path'),
	fs = require('fs'),
	functions = require('../../functions')

const files = fs.readdirSync(path.resolve(__dirname, 'endpointers'))

module.exports = app => {
	app.use('/private', functions.authenticate_user)
	app.use('/admin', functions.authenticate_adm)

	files
		.forEach(file => require(path.resolve(__dirname, 'endpointers', file))(app))
}
