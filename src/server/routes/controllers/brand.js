const path = require('path'),
  Brand = require('../../../data/Schemas/Brand'),
  Product = require('../../../data/Schemas/Product'),
  functions =  require('../../../functions'),
  limit = 12

exports.indexAll = (req, res) => {
  try {

    Brand.countDocuments((err, count) => {
      if (err) {
        res.status(500).send()
      } else {
        const { page } = req.params

        Brand.find()
          .limit(limit)
          .skip((limit * page) - limit)
          .sort('-createdAt')
          .then(Documents => {
            res.status(200).json({ data: Documents, limit, count })
          })
          .catch(_ => {
            res.status(500).send()
          })
      }
    })

  } catch(e) {
    res.status(500).send()
  }
}

exports.store = (req, res) => {
  try {
    const { title } = req.body,
      thumbnail = path.parse(req.file.originalname).name

    const _document = {
      title,
      thumbnail
    }
    
    Brand.findOne({ title })
      .then(already => {
        if (already) {
          return res.json({ ok: false, message: 'Marca já existe' })
        }

        Brand.create(_document)
          .then(brand => {
            res.status(201).json({ ok: true, data: brand._doc })
          })
          .catch(_ => {
            functions.delFolder(req, 'brands')
              .finally(() => {
                res.status(400).send()
              })
          })

      })
      .catch(_ => {
        res.status(500).send()
      })

  } catch(err) {
    functions.delFolder(req, 'brands')
      .finally(() => {
        res.status(500).send()
      })
  }
}

exports.remove = (req, res) => {
  try {
    const { _id } = req.params

    if (typeof _id !== 'string')
      throw new Error()

    Product.find({ brand_id: _id })
      .then(list => {
        if (list.forEach) {
          let error = false
          const forEachToFunctions = list.map(({ thumbnail }) => {
            return function(next) {
              functions.delFolder(req, 'products', thumbnail)
                .then(() => {
                  next && next()
                })
                .catch(() => {
                  error = true
                  next && next()
                })
            }
          })

          const delDocuments = () => {
            Product.deleteMany({ brand_id: _id })
              .then(_ => {

                Brand.findById(_id)
                  .then(brand => {
                    functions.delFolder(null, 'brands', brand.thumbnail)
                    .finally(() => {
                      Brand.findByIdAndDelete(_id)
                        .then(() => {
                          res.status(200).json({ ok: true, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                        })
                        .catch(() => {
                          res.satus(500).send()
                        })
                    })
                  })
                  .catch(() => {
                    res.status(500).send()
                  })
              })
              .catch(_ => {
                res.sttaus(500).send()
              })
          }

          functions.middleware(...forEachToFunctions, delDocuments)
        } else {
          res.status(500).send()
        }
      })
      .catch(_ => {
        res.status(500).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.update = (req, res) => {
  try {

    const { _id } = req.params

    Brand.findById(_id)
      .then(({ _doc }) => {

        Product.updateMany({ brand: _doc.title }, { brand: req.body.title })
          .then(() => {
            Brand.updateOne({ _id }, req.body)
              .then(() => {
                res.status(200).send()
              })
              .catch(() => {
                res.status(500).send()
              })
          })
          .catch(() => {
            res.status(500).send()
          })

      })
      .catch(() => {
        res.status(400).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}
