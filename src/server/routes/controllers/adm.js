const bcryptjs = require('bcryptjs'),
  Adm = require('../../../data/Schemas/Adm'),
  functions = require('../../../functions')

exports.store = (req, res) => {
  try {

    const { username, email, autoLogin } = req.body
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

          functions.token(adm._doc)
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

