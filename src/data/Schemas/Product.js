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
		folder: {
			type: String,
			required: true
		},
		files: {
			s: {
				type: String,
				required: true
			},
			m: {
				type: String,
				required: true
			},
			l: {
				type: String,
				required: true
			}
		}
	},
	price: {
		_from: Number,
		to: {
			type: Number,
			required: true
		}
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
