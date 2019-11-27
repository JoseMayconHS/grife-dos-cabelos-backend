const multer = require('multer'),
	path = require('path'),
  fs = require('fs')

exports.storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {

    const newFolder = path.parse(file.originalname).name,
      dir = path.resolve(__dirname, '..', 'static', 'products', newFolder)


    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
    }

    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}.jpg`)
  }
})

exports.storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '..', 'static', 'users'))
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})
