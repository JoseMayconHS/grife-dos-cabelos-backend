const Brand = require('../../../data/Schemas/Brand'),
  Type = require('../../../data/Schemas/Type'),
  Product = require('../../../data/Schemas/Product'),
  functions =  require('../../../functions'),
  limit = process.env.LIMIT_PAGINATION || 10

exports.indexAll = (req, res) => {
  try {

    req.db('brand')
      .count('id')
      .first()
      .then(count => {
        count = +Object.values(count)[0]

        const { page } = req.params

        req.db('brand')
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy('id', 'desc')
          .then(brands => {
            res.status(200).json({ ok: true, data: brands, limit, count })
          })
          .catch(_ => {
            res.status(500).send()
          })

      })
      .catch(_ => {
        res.status(500).send()
      })
      
  } catch(e) {
    res.status(500).send()
  }
}

exports.qtd = (req, res) => {
  try {

    req.db('brand')
      .count('id')
      .first()
      .then(count => {
        count = +Object.values(count)[0]

        res.status(200).json({ count })
      })
      .catch(() => {
        res.status(500).send()
      })
    
  } catch(err) {
    res.status(500).send(err)
  }
}

exports.indexBy = (req, res) => {
	try {
    let where = req.query || {}
    
    const { page = 1 } = req.params

    req.db('brand')
      .count('id')
      .first()
      .then(count => {
        count = +Object.values(count)[0]

        req.db('brand')
          .where(where)
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy('id', 'desc')
          .then(brands => {
            const data = where.id ? brands[0] : brands

            if (data) {
              res.status(200).json({ ok: true, data, limit, count })
            } else {
              res.status(400).send()
            }

          })
          .catch(err => {
            res.status(500).send()
          })
      })
      .catch(_ => {
        res.status(500).send()
      })
    			
	} catch(error) {
		res.status(500).send()
	}

}

exports.store = (req, res) => {
  try {
    const { title, insired } = req.body,
      thumbnail = req.file.filename

    const _document = {
      title: title.trim(),
      thumbnail, insired
    }

    req.db('brand')
      .where({ title: title.trim() })
      .first()
      .then(already => { 

        if (already) {
          res.json({ ok: false, message: 'Marca já existe' })
        } else {

          req.db('brand')
            .insert(_document)
            .then(result => {
              res.status(201).json({ ok: true, data: { id: result[0] } })
            })
            .catch(_ => {
              functions.delFolder(req, 'brands')
                .finally(() => {
                  res.status(400).send()
                })
            })

        }

      })
      .catch(_ => {
        functions.delFolder(req, 'brands')
          .finally(() => {
            res.status(400).send()
          })
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
    const { id } = req.params

    if (typeof id !== 'string')
      throw new Error()

    req.db('product')
      .where({ brand_id: id })
      .select('thumbnail', 'type_id')
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

              req.db('type')
                .where({ id: type_id })
                .select('products')
                .first()
                .then(type => {

                  req.db('type')
                    .where({ id: type_id })
                    .update({
                      products: type.products - 1
                    })
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

            req.db('product')
              .where({ brand_id: id })
              .del()
              .then(() => {

                req.db('brand')
                  .select('thumbnail')
                  .where({ id })
                  .first()
                  .then(brand => {
                    functions.delFolder(null, 'brands', brand.thumbnail)
                      .finally(() => {

                        req.db('brand')
                          .where({ id })
                          .del()
                          .then(() => {
                            res.status(200).json({ ok: true, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                          })
                          .catch(() => {
                            res.status(500).send()
                          })

                      })
                  })
                  .catch(() => {
                    res.status(500).send()
                  })

              })
              .catch(_ => {
                res.status(500).send()
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

    const { id } = req.params

    const { title } =  req.body

    req.db('brand')
      .where({ title })
      .select('id')
      .first()
      .then(brandExists => {
        if (brandExists) {
          res.status(200).json({ ok: false, message: 'Já existe uma marca com esse nome' })
        } else {

          req.db('product')
            .where({ brand_id: id })
            .update({ brand: title })
            .then(() => {

              req.db('brand')
                .where({ id })
                .update(req.body)
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
      .catch(() => {
        res.status(500).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.search = (req, res) => {
	try {

		const { word, page = 1 } = req.params

    const condition = new RegExp(word.trim(), 'gi')
    
    req.db('brand')
      .limit(limit)
      .offset(page * limit - limit)
      .orderBy('id', 'desc')
      .then(all => all.filter(({ title }) => title.search(condition) >= 0 ))
      .then(filtered => res.status(200).json({ ok: true, data: filtered, limit }))
      .catch(_ => {
        res.status(500).send()
      })

	} catch(err) {
		res.status(500).json(err)
	}
}

exports.update_thumbnail = (req, res) => {
  try {

		const { id } = req.params,
      { filename } = req.file
      
      req.db('brand')
        .where({ id })
        .update({ thumbnail: filename })
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
