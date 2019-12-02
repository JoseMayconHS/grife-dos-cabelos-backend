const { Schema, model } = require('mongoose')

const User = new Schema({
	name: {
		type: String,
		required: true
	},
	cellphone: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

module.exports = model('user', User)
