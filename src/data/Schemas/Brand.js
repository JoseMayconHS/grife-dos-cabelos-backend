const { Schema, model } = require('mongoose')

const Brand = new Schema({
  title: {
    type: String,
    required: true
  }, 
  products: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    required: true
  }
}, {
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('brand', Brand)

