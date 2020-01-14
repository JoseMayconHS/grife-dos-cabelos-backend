const { Schema, model } = require('mongoose')

const Adm = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  adm: {
    type: Boolean,
    required: true,
    default: true
  },
  notifications: {
    type: [Object],
    default: [{
      date: 'Notificação de exemplo',
      success: true,
      title: 'Primeira notificação 😃',
      body: 'Você erra 💯% dos chutes que não dá! ⚽'
    }]
  }
}, {
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

module.exports = model('adm', Adm)
