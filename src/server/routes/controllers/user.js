const bcryptjs = require('bcryptjs'),
  User = require('../../../data/Schemas/User'),
  limit = 2  

exports.indexAll = (req, res) => {
  try {

    User.countDocuments((err, count) => {
      if (err) {
        res.status(500).send()
      } else {
        const { page } = req.params

        User.find({}, 'name cellphone')
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
      .then(Documents => {

        if (!Documents) {
          try {

            const salt = bcryptjs.genSaltSync(10)

            password = bcryptjs.hashSync(password, salt)

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
  res.send('ok')
}

exports.sign = (req, res) => {
  try {

    const { username, password } = req.body

    User.findOne({ username })
      .then(user => {
        try {
          if (!user) {
           throw 'Usuário não existe'
          } else {

            if (!bcryptjs.compareSync(password, user._doc.password)) {
              throw 'Senha inválida'
            } else {
              res.status(200).json({ ok: true, data: user._doc })
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
