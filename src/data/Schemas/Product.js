const { Schema, model } = require('mongoose')

const validTypes = ['botox', 'progressiva', 'combo', 'manutenção', 'reconstrução', 'finalização', 'coloração']

const Product =  new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
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
	brand_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	type: {
		type: String,
		required: true,
		validate: value => validTypes.includes(value)
	},
	promotion: {
		type: Boolean,
		default: false
	},
	insired: {
		type: String,
		required: true
	},
	updated: {
		type: String
	}
}, {
	timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('product', Product)
