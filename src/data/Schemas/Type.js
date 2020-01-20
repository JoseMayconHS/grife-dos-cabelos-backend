const { Schema, model } = require('mongoose')

const Type = new Schema({
  name: {
    type: String,
    required: true
  },
  products: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('type', Type)
