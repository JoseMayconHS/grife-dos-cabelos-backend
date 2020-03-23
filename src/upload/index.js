const multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
	path = require('path'),
  fs = require('fs'),
  Product = require('../data/Schemas/Product'),
  Brand = require('../data/Schemas/Brand'),
  dirProduct = path.resolve(__dirname, '..', 'static', 'products'),
  dirBrand = path.resolve(__dirname, '..', 'static', 'brands')

const s3 = new aws.S3(
  // {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_DEFAULT_REGION
  // }
)

exports.storages = {
  product: {
    local: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dirProduct)
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
    
        cb(null, `product_${Date.now()}${ext}`)
      }
    }),
    s3: {
      init: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const ext = path.extname(file.originalname)
      
          cb(null, `product_${Date.now()}${ext}`)
        }
      }),
      update: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const { id: _id } = req.params

          Product.findById({ _id }, 'thumbnail')
            .then(product => {
              if (!product)
                return cb(new Error())

              const delFromS3 = (ready) => {
                s3
                  .deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: product.thumbnail
                  }).promise()
                  .finally(() => {
                    ready()
                    // res.status(200).json({ ok: true, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                  }) 
              }

              delFromS3(() => {
                const ext = path.extname(file.originalname)

                cb(null, `product_${Date.now()}${ext}`)
              })
            })
            .catch((e) => {
              cb(e)
            })
        }
      })
    }
  },

  brand: {
    local: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dirBrand)
      },
      filename: function (req, file, cb) {

        const ext = path.extname(file.originalname)
    
        cb(null, `brand_${Date.now()}${ext}`)
      }
    }),
    s3: {
      init: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const ext = path.extname(file.originalname)
      
          cb(null, `brand_${Date.now()}${ext}`)
        }
      }),
      update: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const { id: _id } = req.params

          Brand.findById({ _id }, 'thumbnail')
            .then(brand => {
              if (!brand)
                return cb(new Error())

              const delFromS3 = (ready) => {
                s3
                  .deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: brand.thumbnail
                  }).promise()
                  .finally(() => {
                    ready()
                    // res.status(200).json({ ok: true, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                  }) 
              }

              delFromS3(() => {
                const ext = path.extname(file.originalname)

                cb(null, `brand_${Date.now()}${ext}`)
              })
            })
            .catch((e) => {
              cb(e)
            })
        }
      })
    }
  }
}

exports.fileFilter = function(req, file, cb) {

  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type."));
  }

}

exports.updateProductThumbnail = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, dirProduct)
  },
  filename: function(req, file, cb) {
    const { id: _id } = req.params

    Product.findById({ _id }, 'thumbnail')
      .then(product => {
        if (!product)
          return cb(new Error())

        const ext = path.extname(product.thumbnail)

        const n_ext = path.extname(file.originalname)

        const dir = path.resolve(__dirname, '..', 'static', 'products', product.thumbnail)
        try {
          fs.unlinkSync(dir)
        } catch(e) {

        }

        // if (ext !== n_ext) {
        //   dir = path.resolve(__dirname, '..', 'static', 'products', product.thumbnail)
          // try {
          //   fs.unlinkSync(dir)
          // } catch(e) {

          // }
        // }

        // const filename = path.parse(product.thumbnail).name

        // cb(null, `product_${Date.now()}${n_ext}`)
        cb(null, `product_${Date.now()}${n_ext}`)  
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
    const { id: _id } = req.params

    Brand.findById({ _id }, 'thumbnail')
      .then(brand => {
        if (!brand)
          return cb(new Error())

        const ext = path.extname(brand.thumbnail)

        const n_ext = path.extname(file.originalname)

        const dir = path.resolve(__dirname, '..', 'static', 'brands', brand.thumbnail)

        try {
          fs.unlinkSync(dir)
        } catch(e) {

        }

        // if (ext !== n_ext) {
        //   dir = path.resolve(__dirname, '..', 'static', 'brands', brand.thumbnail)
        //   try {
        //     fs.unlinkSync(dir)
        //   } catch(e) {

        //   }
        // }

        // const filename = path.parse(brand.thumbnail).name

        // cb(null, `brand_${Date.now()}${n_ext}`)
        cb(null, `brand_${Date.now()}${ext}`)  
      })
      .catch((e) => {
        cb(e)
      })

  }
})
