const multer = require('multer'),
	path = require('path'),
  fs = require('fs'),
  Product = require('../data/Schemas/Product'),
  Brand = require('../data/Schemas/Brand'),
  dirProduct = path.resolve(__dirname, '..', 'static', 'products'),
  dirBrand = path.resolve(__dirname, '..', 'static', 'brands')

exports.storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirProduct)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)

    cb(null, `product_${Date.now()}${ext}`)
  }
})

exports.fileFilter = function(req, file, cb) {
  const ext = path.extname(file.originalname)

  const valids = ['.png', '.jpg', '.jpeg']

  cb(null, valids.includes(ext))
}

exports.storageBrand = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirBrand)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)

    cb(null, `brand_${Date.now()}${ext}`)
  }
})

exports.updateProductThumbnail = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, dirProduct)
  },
  filename: function(req, file, cb) {
    const { _id } = req.params

    Product.findById({ _id }, 'thumbnail')
      .then(product => {
        if (!product)
          return cb(new Error())

        const ext = path.extname(product.thumbnail)

        const n_ext = path.extname(file.originalname)

        if (ext !== n_ext) {
          dir = path.resolve(__dirname, '..', 'static', 'products', product.thumbnail)
          try {
            fs.unlinkSync(dir)
          } catch(e) {

          }
        }

        const filename = path.parse(product.thumbnail).name

        // cb(null, `product_${Date.now()}${n_ext}`)
        cb(null, `${filename}${n_ext}`)  
      })
      .catch((e) => {
        cb(e)
      })

  }
})

exports.updateBrandThumbnail = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, dirBrand)
  },
  filename: function(req, file, cb) {
    const { _id } = req.params

    Brand.findById({ _id }, 'thumbnail')
      .then(brand => {
        if (!brand)
          return cb(new Error())

        const ext = path.extname(brand.thumbnail)

        const n_ext = path.extname(file.originalname)

        if (ext !== n_ext) {
          dir = path.resolve(__dirname, '..', 'static', 'brands', brand.thumbnail)
          try {
            fs.unlinkSync(dir)
          } catch(e) {

          }
        }

        const filename = path.parse(brand.thumbnail).name

        // cb(null, `brand_${Date.now()}${n_ext}`)
        cb(null, `${filename}${n_ext}`)  
      })
      .catch((e) => {
        cb(e)
      })

  }
})
