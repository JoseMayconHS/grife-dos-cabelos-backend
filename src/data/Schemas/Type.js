const { Schema, model } = require('mongoose')

const Type = new Schema({
  name: {
    unique: true,
    type: String,
    required: true
  },
  products: {
    type: Number,
    default: 0
  },
  swiper: {
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

Type.pre('save', function(next) {
  if (this.name === 'Combo')
    this.swiper = true

  next() 
})

// Type.pre('updateOne', async function(next) {


//   if (this._conditions._id) {
//     const { _id  } = this._conditions
//     const typeActual = await model('type', Type).findById(_id, 'swiper')


//     if (typeActual.swiper) {
//       next(new Error())
//     } else {
//       next()
//     } 
//   } else {
//     next()
//   } 
// })

module.exports = model('type', Type)
