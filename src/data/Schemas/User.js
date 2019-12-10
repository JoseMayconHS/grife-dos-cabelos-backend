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
	},
	bag: {
		actual: [{
			productId: {
				type: Schema.Types.ObjectId,
				required: true
			},
			title: {
				type: String,
				required: true
			}, 
			brand: {
				type: String,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			thumbnail: String,
			qtd: Number
		}],
		saves: Object
	}
}, {
	timestamps: true
})

module.exports = model('user', User)
