const { Schema, model } = require('mongoose')

const Product =  new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	item_included: {
		type: [String]
	},
	thumbnail: {
		type: String,
		required: true
	},
	price: {
		_from: {
			type: Number,
			default: 0
		},
		to: {
			type: Number,
			required: true
		}
	},
	brand: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	promotion: {
		type: Boolean,
		default: false
	},
	insired: {
		type: String,
		required: true
	}
}, {
	timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('product', Product)
