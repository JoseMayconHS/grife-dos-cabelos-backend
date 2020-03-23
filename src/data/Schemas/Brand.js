const { Schema, model } = require('mongoose')

const Brand = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  }, 
  products: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  insired: {
		type: String,
		required: true
	}
}, {
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' }
})

// Brand.pre("remove", function() {
//   console.log('remove')
//   return s3
//     .deleteObject({
//       Bucket: process.env.BUCKET_NAME,
//       Key: this.thumbnail
//     })
//     .promise()
//     .then(response => {
//       console.log(response.status);
//     })
//     .catch(response => {
//       console.log(response.status);
//     });

// });

module.exports = model('brand', Brand)

