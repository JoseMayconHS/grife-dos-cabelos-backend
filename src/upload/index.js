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
    const ext = path.extname(file.originalname)

    cb(null, `thumbnail${ext}`)
  }
})

exports.fileFilter = function(req, file, cb) {
  const ext = path.extname(file.originalname)

  const valids = ['.svg', '.png', '.jpg', '.jpeg']

  cb(null, valids.includes(ext))
}

exports.storageBrand = multer.diskStorage({
  destination: function (req, file, cb) {
    const newFolder = path.parse(file.originalname).name,
    dir = path.resolve(__dirname, '..', 'static', 'brands', newFolder)


    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
    }

    cb(null, dir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)

    cb(null, `thumbnail${ext}`)
  }
})
