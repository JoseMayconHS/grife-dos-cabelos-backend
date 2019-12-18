const { Schema, model } = require('mongoose')

const User = new Schema({
	username: {
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
			thumbnail: {
				type: String,
				required: true
			},
			qtd: {
				type: Number,
				default: 1
			}
		}],
		saves: Object
	}
}, {
	timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('user', User)
