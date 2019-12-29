const bcryptjs = require('bcryptjs'),
  functions = require('../../../functions'),
  User = require('../../../data/Schemas/User'),
  limit = 12

exports.indexAll = (req, res) => {
  try {

    User.countDocuments((err, count) => {
      if (err) {
        res.status(500).send()
      } else {
        const { page } = req.params

        User.find({})
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
    
    const { username, cellphone } = req.body

    let { password } = req.body

    User.findOne({ username })
      .then(userByUsername => {

        if (!userByUsername) {

          User.findOne({ cellphone })
            .then(userByCellphone => {

              if (!userByCellphone) {

                try {

                  password = functions.criptor(password)
      
                  User.create({ username, cellphone, password })
                    .then(user => {
                      res.status(201).json({ ok: true, data: user._doc })
                    })
                    .catch(_ => {
                      res.status(200).json({ ok: false, message: 'Não criado' })
                    })
      
                } catch(error) {
                  res.status(500).send()
                }

              } else {
                res.status(200).json({ ok: false, message: 'Telefone já cadastrado' })
              }

            })
          
        } else {
          res.status(200).json({ ok: false, message: 'Nome já existe' })
        }

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

    User.findById(req._id)
      .then(user => {
        try {

          if (req.body.username) {
            if (req.body.username === user._doc.username)
              throw 'O nome é o mesmo'
          }

          if (req.body.cellphone) {
            if (req.body.cellphone === user._doc.cellphone)
              throw 'O número de telefone é o mesmo'
          }

          if (req.body.password) {
            req.body.password = functions.criptor(req.body.password)
          }

          User.updateOne({ _id: req._id }, req.body)
            .then(_ => {
              res.status(200).json({ ok: true, message: 'Alterado com sucesso' })
            })
            .catch(_ => {
              res.status(200).json({ ok: false, message: 'Nome já existe' })
            })

        } catch(message) {
          res.status(200).json({ ok: false, message })
        }
      })    

  } catch(e) {
    res.status(500).send()
  }
}

exports.sign = (req, res) => {
  try {

    const { username, password } = req.body

    User.findOne({ username: username.trim() })
      .then(user => {
        try {
          if (!user) {
           throw 'Usuário não existe'
          } else {

            if (!bcryptjs.compareSync(password.toLowerCase(), user._doc.password)) {
              throw 'Senha inválida'
            } else {
              functions.token(user._doc._id)
                .then(token => {
                  res.status(200).json({ ok: true, data: { ...user._doc, password: undefined }, token: `Bearer ${token}` })
                })
                .catch(() => {
                  res.status(500).send()
                })              
            }

          }
        } catch(message) {
          res.status(200).json({ ok: false, message })
        }
      })
      .catch(_ => {
        res.status(500).send()
      })


  } catch(error) {
    res.status(500).send()
  }
}

exports.remove = (req, res) => {
  try {

    const { _id } = req.params

    User.deleteOne({ _id })
      .then(() => {
        res.status(200).send('Excluido com sucesso')
      })
      .catch(() => {
        res.status(500).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}
