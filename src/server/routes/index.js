const path = require('path')
const fs = require('fs')

const files = fs.readdirSync(path.resolve(__dirname, 'endpointers'))

module.exports = app => 
	files
		.forEach(file => require(path.resolve(__dirname, 'endpointers', file))(app))
