const Type = require('../../../data/Schemas/Type'),
  Product = require('../../../data/Schemas/Product'),
  Brand = require('../../../data/Schemas/Brand'),
  functions =  require('../../../functions'),
  limit = +process.env.LIMIT_PAGINATION || 10

exports.store = (req, res) => {
  try {

    const { name, insired } = req.body

    Type.findOne({ name })
      .then(typeAllreadyExists => {
        if (typeAllreadyExists) {
          res.status(200).json({ ok: false, message: 'Tipo já existe' })
        } else {

          Type.create({ name, insired })
            .then(created => {
              res.status(201).json({ ok: true, data: created })
            })
            .catch((er) => {
              res.status(500).send()    
            })

        }
         
      })
      .catch((e) => {
        res.status(500).send()    
      })

  } catch(err) {
    res.status(500).send()
  }
}


exports.indexAll = (req, res) => {
  try {
    const { page = 1 } = req.params,
      { app } = req.query
    if (app) {
      Type.find()
        .then(types => {
          res.status(200).json({ ok: true, data: types })
        }).catch(() => {
          res.status(500).send()
        })
    } else {
      Type.countDocuments((err, count) => {
        if (err) {
          res.status(500).send(err)
        } else {
  
          Type.find()
            .limit(limit)
            .skip((limit * page) - limit)
            .sort('-createdAt')
            .then(Documents => {
              res.status(200).json({ ok: true, data:  Documents, limit, count })
            })
            .catch(_ => {
              res.status(500).send()
            })
  
        }
      })
    }

  } catch(err) {
    res.status(500).send()
  }
}

exports.indexBy = (req, res) => {
	try {
    let where = req.query || {}
    
    const { page = 1 } = req.params
    
    Type.countDocuments(where, (err, count) => {
      if (err) {
        res.status(500).send
      } else {

        Type.find(where)
          .limit(limit)
          .skip((limit * page) - limit)
          .sort('-createdAt')
          .then(Documents => {
            res.status(200).json({ ok: true, data: where._id ? Documents[0] : Documents, limit, count })
          })
          .catch(_ => {
            res.status(500).send()
          })

      }
    })
			
	} catch(error) {
		res.status(500).send()
	}

}

exports.update = (req, res) => {
  try {

    const { id :_id } = req.params

    if (req.body.name) {

      Type.findOne({ name: req.body.name })
        .then(typeExists => {
          if (typeExists) {
            res.status(200).json({ ok: false, message: 'Já existe um tipo com esse nome' })
          } else {

            Product.updateMany({ type_id: _id }, { type: req.body.name })
              .then(() => {
                Type.updateOne({ _id }, req.body, (err) => {
                  if (err) {
                    res.status(500).send()
                  } else {
                    res.status(200).json({ ok: true })
                  }
                })
              })
              .catch(() => {
                res.status(500).send()
              })
          }
        })

    } else {
      Type.updateOne({ _id }, req.body, (err) => {
        if (err) {
          res.status(500).send()
        } else {
          res.status(200).json({ ok: true })
        }
      })
    }

  } catch(e) {
    res.status(500).send()
  }
}

exports.remove = (req, res) => {
  try {

    const { id: _id } = req.params

    if (typeof _id !== 'string')
      throw new Error()

    Type.findById(_id, 'swiper')
      .then(type => {
        if (type.swiper) {
          res.status(200).json({ ok: false, message: 'Esse tipo não pode ser apagado ⚠️' })  
        } else {

          Product.find({ type_id: _id })
            .then(list => {
              if (list && list.forEach) {
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

                const recalcBrandProducts = list.map(({ brand_id }) => {
                  return function(next) {
                    Brand.findById(brand_id)
                      .then(brand => {
                        Brand.updateOne({ _id: brand_id }, { products: brand.products - 1 })
                          .then(() => {
                            next && next()
                          })
                          .catch(() => {
                            error = true
                            next && next()
                          })
                      }).catch(_ => {
                        error = true
                        next && next()
                      })
                  }
                })

                const delDocuments = () => {
                  Product.deleteMany({ type_id: _id })
                    .then(_ => {

                      Type.deleteOne({ _id }, (err) => {
                        if (err) {
                          res.status(500).send(err)
                        } else {
                  
                          res.status(200).json({ ok: true, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                  
                        }
                      })
                    })
                    .catch(_ => {
                      res.sttaus(500).send()
                    })
                }

                functions.middleware(...forEachToFunctions, ...recalcBrandProducts, delDocuments)
              } else {
                res.status(500).send()
              }
            })
            .catch(_ => {
              res.status(500).send()
            })

        }
      })
      .catch(_ => {
        res.status(500).send()
      })
  
  } catch(e) {
    res.status(500).send()
  }
}

