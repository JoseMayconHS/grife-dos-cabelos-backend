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
  }
}