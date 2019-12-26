const { Schema, model } = require('mongoose')

const Expo = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('expo', Expo)
