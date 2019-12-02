const bcryptjs = require('bcryptjs'),
  User = require('../../../data/Schemas/User')

module.exports = {
  store(req, res) {
    try {
      
      const { name, cellphone } = req.body

      let { password } = req.body

      User.findOne({ name })
        .then(Documents => {

          if (!Documents) {
            try {

              const salt = bcryptjs.genSaltSync(10)

              password = bcryptjs.hashSync(password, salt)

              User.create({ name, cellphone, password })
              .then(user => {
                res.status(201).json(user)
              })
              .catch(error => {
                throw error
              })
            } catch(error) {
              res.status(500).json({ error })
            }
            
          } else {
            res.status(400).json({ message: 'Usuário não criado' })
          }

        })

    } catch(error) {
      res.status(500).json({ error })
    }
  },

  sign(req, res) {
    try {

      const { username: name, password } = req.body

      User.findOne({ name })
        .then(User => {
          try {
            if (!User) {
             throw 'Usuário não existe'
            } else {
  
              if (!bcryptjs.compareSync(password, User.password)) {
                throw 'Senha inválida'
              } else {
                res.status(200).json(User)
              }
  
            }
          } catch(message) {
            res.status(400).json({ message })
          }
        })


    } catch(error) {
      res.status(500).json({ error })
    }
  }
}