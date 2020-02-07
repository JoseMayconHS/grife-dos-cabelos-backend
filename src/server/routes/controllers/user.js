const bcryptjs = require('bcryptjs'),
  pdf = require('html-pdf'),
  pdfTemplates = require('../../../data/pdf'),
  functions = require('../../../functions'),
  User = require('../../../data/Schemas/User'),
  generatePassword = require('generate-password'),
  limit = +process.env.LIMIT_PAGINATION || 10

exports.changepassword = (req, res) => {
  try {
<<<<<<< HEAD
    const { id } = req.params
=======
    const { id: _id } = req.params
>>>>>>> mongodb
    let { password } = req.body

    password = functions.criptor(password)

    req.db('user')
      .where({ id })
      .update({ password })
      .then(() => {
        res.status(200).json({ ok: true })
      })
      .catch(() => {
        res.status(400).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.generate = (req, res) => {
  try {
    const password = generatePassword.generate({
      length: 8,
      numbers: true,
      uppercase: false
    })

    res.status(200).json({ ok: true, data: password }) 
  } catch(e) {
    res.status(500).send()
  }
}

exports.forgot = (req, res) => {
  try {

    const { username, cellphone } = req.body

    req.db('user')
      .where({ username: username.trim() })
      .first()
      .then(user => {
        if (user) {

          if (cellphone === user.cellphone) {
            res.status(200).json({ ok: true, data: user.id })  
          } else {
            res.status(200).json({ ok: false, message: 'Este telefone é diferente' })  
          }

        } else {
          res.status(200).json({ ok: false, message: 'Usuário não encontrado' })
        }
      }).catch(() => {
        res.status(500).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.qtd = (req, res) => {
  try {

    req.db('user')
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

exports.indexAll = (req, res) => {
  try {

    req.db('user')
      .count('id')
      .first()
      .then(count => {
        count = +Object.values(count)[0]

        const { page } = req.params

        req.db('user')
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy('id', 'desc')
          .then(users => {
            res.status(200).json({ ok: true, data: users, limit, count })
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

exports.store = (req, res) => {
  try {
    
    const { username, cellphone } = req.body

    let { password } = req.body

    req.db('user')
      .where({ username: username.trim() })
      .first()
      .then(userByUsername => {

        if (!userByUsername) {

          req.db('user')
            .where({ cellphone: cellphone.trim() })
            .first()
            .then(userByCellphone => {

              if (!userByCellphone) {

                try {

                  password = functions.criptor(password)

                  req.db('user')
                    .insert({ username: username.trim(), cellphone, password })
                    .then(user => {
                      res.status(201).json({ ok: true, data: user })
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
            .catch(_ => {
              res.status(500).send()
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

    req.db('user')
      .where({ id: req.id })
      .first()
      .then(user => {
        try {

          if (req.body.username) {
            if (req.body.username === user.username)
              throw 'O nome é o mesmo'
          }

          if (req.body.cellphone) {
            if (req.body.cellphone === user.cellphone)
              throw 'O número de telefone é o mesmo'
          }

          if (req.body.password) {
            req.body.password = functions.criptor(req.body.password)
          }

          req.db('user')
            .where({ id: req.id })
            .update({ ...req.body })
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
      .catch(() => {
        res.status(500).send()
      }) 

  } catch(e) {
    res.status(500).send()
  }
}

exports.sign = (req, res) => {
  try {

    const { cellphone, password } = req.body

    req.db('user')
      .where({ cellphone: cellphone.trim() })
      .first()
      .then(user => {
        try {
          if (!user) {
           throw 'Ninguém com este telefone'
          } 

          if (!bcryptjs.compareSync(password.trim().toLowerCase(), user.password)) {
            throw 'Senha inválida'
          }

          functions.token(user.id)
            .then(token => {
              res.status(200).json({ ok: true, data: { ...user, password: undefined }, token: `Bearer ${token}` })
            })
            .catch(() => {
              res.status(200).json({ ok: false, message: 'Erro ao gerar token' })
            })              
                    
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

<<<<<<< HEAD
    const { id } = req.params
=======
    const { id: _id } = req.params
>>>>>>> mongodb

    req.db('user')
      .where({ id })
      .del()
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

exports.search = (req, res) => {
	try {

		const { word, page = 1 } = req.params

		const condition = new RegExp(word.trim(), 'gi')

		User.find()
			.limit(limit)
			.skip((limit * page) - limit)
			.sort('-createdAt')
			.then(all => all.filter(({ username }) => username.search(condition) >= 0))
			.then(filtered => res.status(200).json({ ok: true, data: filtered, limit }))
			.catch(err => res.status(400).send(err))

	} catch(err) {
		res.status(500).json(err)
	}
}

