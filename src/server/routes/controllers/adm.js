const bcryptjs = require('bcryptjs'),
  functions = require('../../../functions')

exports.cards = (req, res)   => {
  try {

    const getCount = (table, cb) => {
      req.db(table)
        .count('id')
        .first()
        .then(count => {

          count = +Object.values(count)[0]
      
          cb(count)

        })
        .catch(ee => {
          cb('falhou ❌')
        })
    }

    const fields = ['brand', 'type', 'user', 'product']

    const middle = []

    for (let fn = 0; fn <= 3; fn++) {
      middle[fn] = function(next) {
        getCount(fields[fn], value => {
          fields[fn] = value

          next && next()
        })

      }
    }

    functions.middleware(...middle, () => {
      const data = { 
        brands: fields[0],
        types: fields[1],
        clients: fields[2],
        products: fields[3]
      }

      res.status(200).json({ ok: true, data })
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
      req.db('adm')
        .count('id')
        .first()
        .then((count) => {
          try {
            if (+Object.values(count)[0]) 
              throw 'Não pode criar mais de uma conta! ⚠️'

            cb()

          } catch(message) {
            res.status(200).json({ ok: false, message: typeof message === 'string' ? message : 'Ocorreu um erro', already: true })
          }

        })
        .catch(() => {
          res.status(500).send()
        })
    }

    const create = () => {
      req.db('adm')
        .where({ username: username.trim().toLowerCase() })
        .select('id')
        .first()
        .then(admByUsername => {

          if (admByUsername) {
            res.status(200).json({ ok: false, message: 'Nome já existe 🤪', already: true })
          } else {

            req.db('adm')
              .where({ email: email.trim().toLowerCase() })
              .select('id')
              .first()
              .then(admByEmail => {

                if (admByEmail) {
                  res.status(200).json({ ok: false, message: 'Email já existe 🤪', already: true })
                } else {

                  password = functions.criptor(password.trim().toLowerCase())

                  req.db('adm')
                    .insert({ username: username.trim(), email: email.trim().toLowerCase(), password })
                    .then(() => {

                      req.db('type')
                        .insert({ name: 'Combo', insired, swiper: true })
                        .then(() => {})
                        .catch(() => {})
                        .finally(() => { 

                          res.status(201).json({ ok: true })

                        })

                    })
                    .catch(_ => {
                      res.status(200).json({ ok: false, message: 'Não criado 😢' })
                    })

                }

              })
              .catch(() => {
                res.status(500).send()  
              })

          }

        })
        .catch(() => {
          res.status(500).send()  
        })
    }

    alReadyAccount(() => create())

  } catch(err) {
    res.status(500).send(err)
  }
}

exports.sign = (req, res) => {
  try {

    const { email, password } = req.body

    req.db('adm')
      .where({ email: email.trim() })
      .first()
      .then(adm => {
        try {
          if (!adm) {
            throw 'Email não existe 🙄'
          }

          if (!bcryptjs.compareSync(password.trim().toLowerCase(), adm.password)) {
            throw 'Senha inválida 🙄'
          }

          functions.token({ adm: adm.adm, value: adm.id })
            .then(token => {
              res.status(200).json({ ok: true, data: { ...adm, password: undefined, token: `Bearer ${token}` } })
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

    if (!req.id)
      throw new Error()

    req.db('adm')
      .where({ id: req.id })
      .first()
      .then(adm => {
        functions.token({ adm: adm.adm, value: adm.id })
          .then(token => {
            res.status(200).json({ ok: true, data: { ...adm, password: undefined, token: `Bearer ${token}` } })
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


    req.db('type')
      .select('id', 'name')
      .then(typesDocument => {

        req.db('brand')
          .select('id', 'title')
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
