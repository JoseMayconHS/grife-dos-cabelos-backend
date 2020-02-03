const bcryptjs = require('bcryptjs'),
  Adm = require('../../../data/Schemas/Adm'),
  Brand = require('../../../data/Schemas/Brand'),
  Product = require('../../../data/Schemas/Product'),
  Type = require('../../../data/Schemas/Type'),
  User = require('../../../data/Schemas/User'),
  functions = require('../../../functions')

exports.cards = (req, res)   => {
  try {

    Brand.countDocuments((err1, brands) => {
      Type.countDocuments((err2, types) => {
        User.countDocuments((err3, clients) => {
          Product.countDocuments((err4, products) => {
            res.status(200).json({ ok: true, data: { 
              brands: typeof +brands === 'number' ? +brands : 'falhou ❌',
              types: typeof +types === 'number' ? +types : 'falhou ❌',
              clients: typeof +clients === 'number' ? +clients : 'falhou ❌',
              products: typeof +products === 'number' ? +products : 'falhou ❌',
             }})
          })
        })
      })
    })

  }catch(e) {
    res.status(500).send()
  }
}

exports.store = (req, res) => {
  try {

    const { username, email, autoLogin, insired } = req.body
    let { password } = req.body

    const alReadyAccount = cb => {
      Adm.countDocuments((err, count) => {
        try {
          if (err)
            return res.status(500).send()

          if (count)
            throw 'Não pode criar mais de uma conta! ⚠️'
  
          cb()
  
        } catch(message) {
          res.status(200).json({ ok: false, message, already: true })
        }
  
      })
    }

    const create = () => {
      Adm.findOne({ username: username.trim() })
        .then(admByUsername => {
          
          if (!admByUsername) {

            Adm.findOne({ email: email.trim().toLowerCase() })
              .then(admByEmail => {

                if (!admByEmail) {

                  password = functions.criptor(password.trim().toLowerCase())

                  Adm.create({ username: username.trim(), email: email.trim().toLowerCase(), password })
                    .then(({ _doc: data }) => {

                      Type.create({
                        name: 'Combo',
                        insired
                      })
                      .then(() => {})
                      .catch(() => {})
                      .finally(() => {

                        if (autoLogin) {

                          functions.token(data)
                            .then(token => {
                              res.status(201).json({ ok: true, data: { ...data, password: undefined, token: `Bearer ${token}` } })
                            })
                            .catch(() => {
                              res.status(201).json({ ok: true, data: { ...data, password: undefined } })
                            })
  
                        } else {
                          res.status(201).json({ ok: true, data: { ...data, password: undefined } })
                        }

                      })

                    })
                    .catch(_ => {
                      res.status(200).json({ ok: false, message: 'Não criado 😢' })
                    })

                } else {
                  res.status(200).json({ ok: false, message: 'Email já existe 🤪', already: true })
                }

              })
              .catch(err => {
                res.status(500).send(err)    
              })

          } else {

            res.status(200).json({ ok: false, message: 'Nome já existe 🤪', already: true })

          }

        })
        .catch(err => {
          res.status(500).send(err)    
        })
    }

    alReadyAccount(create)

  } catch(err) {
    res.status(500).send(err)
  }
}

exports.sign = (req, res) => {
  try {

    const { email, password } = req.body

    Adm.findOne({ email: email.trim() })
      .then(adm => {
        try {

          if (!adm) {
            throw 'Email não existe 🙄'
          }

          if (!bcryptjs.compareSync(password.trim().toLowerCase(), adm.password)) {
            throw 'Senha inválida 🙄'
          }

          functions.token({ adm: adm._doc.adm, value: adm._doc._id })
            .then(token => {
              res.status(200).json({ ok: true, data: { ...adm._doc, password: undefined, token: `Bearer ${token}` } })
            })
            .catch(() => {
              res.status(200).json({ ok: false, message: 'Erro ao gerar token 💥' })
            })

        } catch(message) {
          res.status(200).json({ ok: false, message })
        }
        
      })
      .catch(err => {
        res.status(500).send(err)
      })

  } catch(err) {
    res.status(500).send(err)
  }
}

exports.reconnect = (req, res) => {
  try {

    if (!req._id)
      throw new Error()

    Adm.findById(req._id)  
      .then(adm => {
        functions.token({ adm: adm._doc.adm, value: adm._doc._id })
          .then(token => {
            res.status(200).json({ ok: true, data: { ...adm._doc, password: undefined, token: `Bearer ${token}` } })
          })
          .catch(() => {
            res.status(200).json({ ok: false, message: 'Erro ao gerar token 💥' })
          })
      })
      .catch(() => {
        res.status(500).send()    
      })

  } catch(err) {
    res.status(500).send(err)
  }
}

exports.formSelects = (req, res) => {
  try {

    Type.find({}, 'name')
      .then(typesDocument => {

        Brand.find({}, 'title')
          .then(brandsDocument => {

            res.status(200).json({ 
              ok: true, 
              data: { types: typesDocument, brands: brandsDocument } 
            })

          })
          .catch(() => {
            res.status(200).json({ ok: false, message: 'Erro ao buscar marcas disponíveis' })
          })

      })
      .catch(() => {
        res.status(200).json({ ok: false, message: 'Erro ao buscar tipos disponíveis' })
      })

  } catch(e) {
    res.status(500).send()
  }
}
