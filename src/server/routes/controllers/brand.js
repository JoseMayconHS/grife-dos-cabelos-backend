const Brand = require('../../../data/Schemas/Brand'),
  Type = require('../../../data/Schemas/Type'),
  Product = require('../../../data/Schemas/Product'),
  functions =  require('../../../functions'),
  limit = +process.env.LIMIT_PAGINATION || 10

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
          .sort('-created_at')
          .then(Documents => {
            res.status(200).json({ ok: true, data: Documents, limit, count })
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

exports.qtd = (req, res) => {
  try {

      Brand.countDocuments((err, count) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json({ count })
        }
      })
    
  } catch(err) {
    res.status(500).send(err)
  }
}

exports.indexBy = (req, res) => {
	try {
    let where = req.query || {}
    
    const { page = 1 } = req.params
    
    Brand.countDocuments(where, (err, count) => {
      if (err) {
        res.status(500).send
      } else {

        Brand.find(where)
          .limit(limit)
          .skip((limit * page) - limit)
          .sort('-created_at')
          .then(Documents => {

            const data = where._id ? Documents[0] : Documents

            if (data) {
              res.status(200).json({ ok: true, data, limit, count })
            } else {
              res.status(400).send()
            }

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

exports.store = (req, res) => {
  try {
    console.log({ body: req.body, file: req.file })
    
    const { title, insired } = req.body,
      thumbnail = req.file.filename

      

    const _document = {
      title: title.trim(),
      thumbnail, insired
    }
    
    Brand.findOne({ title: title.trim() })
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
    console.log({ err })
    functions.delFolder(req, 'brands')
      .finally(() => {
        res.status(500).send()
      })
  }
}

exports.remove = (req, res) => {
  try {
    const { id: _id } = req.params

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

          const recalcTypeProducts = list.map(({ type_id }) => {
            return function(next) {
              Type.findById(type_id)
                .then(type => {
                  Type.updateOne({ _id: type_id }, { products: type.products - 1 })
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

          // const recalcBrandProducts = list.map(({ brand_id }) => {
          //   return function(next) {
          //     Brand.findById(brand_id)
          //       .then(brand => {
          //         Brand.updateOne({ _id: brand_id }, { products: brand.products - 1 })
          //           .then(() => {
          //             next && next()
          //           })
          //           .catch(() => {
          //             error = true
          //             next && next()
          //           })
          //       }).catch(_ => {
          //         error = true
          //         next && next()
          //       })
          //   }
          // })

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

          functions.middleware(...forEachToFunctions, ...recalcTypeProducts,  delDocuments)
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

    const { id: _id } = req.params

    const { title } =  req.body

    Brand.findOne({ title })
      .then(brandExists => {
        if (brandExists) {
          res.status(200).json({ ok: false, message: 'Já existe uma marca com esse nome' })
        } else {
          Product.updateMany({ brand_id: _id }, { brand: title })
            .then(() => {
              Brand.updateOne({ _id }, req.body)
                .then(() => {
                  res.status(200).json({ ok: true })
                })
                .catch(() => {
                  res.status(500).send()
                })
            })
            .catch(() => {
              res.status(500).send()
            })
        }
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.search = (req, res) => {
	try {

		const { word, page = 1 } = req.params

		const condition = new RegExp(word.trim(), 'gi')

		Brand.find()
			.limit(limit)
			.skip((limit * page) - limit)
			.sort('-created_at')
			.then(all => all.filter(({ title }) => title.search(condition) >= 0 ))
			.then(filtered => res.status(200).json({ ok: true, data: filtered, limit }))
			.catch(err => res.status(400).send(err))

	} catch(err) {
		res.status(500).json(err)
	}
}

exports.update_thumbnail = (req, res) => {
  try {

		const { id: _id } = req.params,
			{ filename } = req.file

			Brand.updateOne({ _id }, { thumbnail: filename })
				.then(() => {
					res.status(200).json({ ok: true })
				})
				.catch(() => {
					res.status(200).json({ ok: false, message: 'Erro ao atualizar dado' })
				})
	} catch(e) {
		res.status(500).send()
	}
}
