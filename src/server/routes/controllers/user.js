const User = require('../../../data/Schemas/User')

module.exports = {
  store(req, res) {
    try {
      
      const { name, cellphone, password } = req.body

      User.findOne({ name })
        .then(Documents => {

          if (!Documents) {
            try {
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