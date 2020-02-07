const Type = require('../../../data/Schemas/Type'),
  Product = require('../../../data/Schemas/Product'),
  Brand = require('../../../data/Schemas/Brand'),
  functions =  require('../../../functions'),
  limit = +process.env.LIMIT_PAGINATION || 10

exports.store = (req, res) => {
  try {

    const { name, insired } = req.body

    req.db('type')
      .where({ name })
      .first()
      .then(typeAllreadyExists => {
        if (typeAllreadyExists) {
          res.status(200).json({ ok: false, message: 'Tipo já existe' })
        } else {

          req.db('type')
            .insert({ name, insired })
            .then(() => {
              res.status(201).json({ ok: true })
            })
            .catch(() => {
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

      req.db('type')
        .then(types => {
          res.status(200).json({ ok: true, data: types })
        }).catch(() => {
          res.status(500).send()
        })
        
    } else {

      req.db('type')
        .count('id')
        .first()
        .then(count => {
          count = +Object.values(count)[0] 

          req.db('type')
            .limit(limit)
            .offset(page * limit - limit)
            .orderBy('id', 'desc')
            .then(products => {
              res.status(200).json({ ok: true, data: products, limit, count })
            })
            .catch(_ => {
              res.status(500).send()
            })
        })
        .catch(_ => {
          res.status(500).send()
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

    req.db('type')
      .where(where)
      .count('id')
      .first()
      .then(count => {
        count = +Object.values(count)[0] 

        req.db('type')
          .where(where)
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy('id', 'desc')
          .then(types => {

            const data = where.id ? types[0] : types

            if (data) {
              res.status(200).json({ ok: true, data, limit, count })
            } else {
              res.status(400).send()
            }

          })
          .catch(_ => {
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

exports.update = (req, res) => {
  try {

<<<<<<< HEAD
    const { id } = req.params
=======
    const { id :_id } = req.params
>>>>>>> mongodb

    if (req.body.name) {

      req.db('type')
        .where({ name: req.body.name })
        .first()
        .then(typeExists => {
          if (typeExists) {
            res.status(200).json({ ok: false, message: 'Já existe um tipo com esse nome' })
          } else {

            req.db('product')
              .where({ type_id: id })
              .update({ type: req.body.name })
              .then(() => {

                req.db('type')
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

    } else {

      req.db('type')
        .where({ id })
        .update(req.body)
        .then(() => {
          res.status(200).json({ ok: true })
        })
        .catch(() => {
          res.status(500).send()
        })

    }

  } catch(e) {
    res.status(500).send()
  }
}

exports.remove = (req, res) => {
  try {

<<<<<<< HEAD
    let { id } = req.params
=======
    const { id: _id } = req.params
>>>>>>> mongodb

    id = +id

    // if (typeof _id !== 'string')
    //   throw new Error()
    req.db('type')
      .where({ id })
      .select('swiper')
      .first()
      .then(sweiperType => {
        if (+sweiperType.swiper) {
          return res.status(200).json({ ok: false, message: 'Este tipo não pode ser apagado! ⚠️' })
        }

        req.db('product')
          .where({ type_id: id })
          .select('thumbnail', 'type_id')
          .then(list => {
            if (list && list.forEach) {
              let error = false

              const forEachToFunctions = list.map(({ thumbnail }) => {
                return function(next) {
                  functions.delFolder(req, 'products', thumbnail)
                    .finally(() => {
                      next && next()
                    })
                  }
                })

              const recalcBrandProducts = list.map(({ brand_id }) => {
                return function(next) {

                  req.db('brand')
                    .where({ id: brand_id })
                    .first()
                    .then(brand => {

                      req.db('brand')
                        .where({ id: brand_id })
                        .update({ products: brand.products - 1 })
                        .then(() => {
                          next && next()
                        })
                        .catch(_ => {
                          res.status(500).send()
                        })
                        
                    }).catch(_ => {
                      error = true
                      next && next()
                    })
                    
                }
              })

              const delDocuments = () => {

                req.db('product')
                  .where({ type_id: id })
                  .del()
                  .then(_ => {

                    req.db('type')
                      .where({ id })
                      .del()
                      .then(() => {
                        res.status(200).json({ ok: !error, message: error ? 'Ocorreu alguns erros' : 'apagado com sucesso' })
                      })
                      .catch(() => {
                        res.status(500).send()
                      })

                  })
                  .catch(_ => {
                    res.status(500).send()
                  })
                  
              }

              functions.middleware(...forEachToFunctions, ...recalcBrandProducts, delDocuments)

            }
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

