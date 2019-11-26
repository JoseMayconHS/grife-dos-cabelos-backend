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
		type: String
	},
	price: {
		_from: Number,
		to: Number
	},
	brand: {
		type: String,
		required: true
	},
	promotion: {
		type: Boolean,
		default: false
	}
})

module.exports = model('product', Product)
