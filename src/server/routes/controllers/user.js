const bcryptjs = require('bcryptjs'),
  pdf = require('html-pdf'),
  pdfTemplates = require('../../../data/pdf'),
  functions = require('../../../functions'),
  User = require('../../../data/Schemas/User'),
  generatePassword = require('generate-password'),
  limit = +process.env.LIMIT_PAGINATION || 10

exports.buy = (req, res) => {

  // const html = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'data', 'pdf', 'template.html'), { encoding: 'utf8' })
  const html = pdfTemplates.template(req.body)

  pdf.create(html, { directory: './', format: 'A4', orientation: 'landscape' })
    .toFile('output.pdf', (err, fileInfo) => {
      if (err) 
        return console.log(err)

      console.log(fileInfo)  

        res.status(200).sendFile(fileInfo.filename)
    })

} 

exports.changepassword = (req, res) => {
  try {
    const { _id } = req.params
    let { password } = req.body

    password = functions.criptor(password)

    User.updateOne({ _id }, { password })
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

    User.findOne({ username: username.trim() })
      .then(user => {
        if (user) {

          if (cellphone === user.cellphone) {
            res.status(200).json({ ok: true, data: user._id })  
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

      User.countDocuments((err, count) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json({ count })
        }
      })
    
  } catch(err) {
    res.status(500).send(err)
  }
}

exports.indexAll = (req, res) => {
  try {

    User.countDocuments((err, count) => {
      if (err) {
        res.status(500).send()
      } else {
        const { page } = req.params

        User.find()
          .limit(limit)
          .skip((limit * page) - limit)
          .sort('-createdAt')
          .then(Documents => {
            res.status(200).json({ ok: true, data: Documents, limit, count })
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

    User.findOne({ username: username.trim() })
      .then(userByUsername => {

        if (!userByUsername) {

          User.findOne({ cellphone })
            .then(userByCellphone => {

              if (!userByCellphone) {

                try {

                  password = functions.criptor(password)
      
                  User.create({ username: username.trim(), cellphone, password })
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
           throw 'Ninguém com este telefone'
          } 

          if (!bcryptjs.compareSync(password.trim().toLowerCase(), user._doc.password)) {
            throw 'Senha inválida'
          }

          functions.token(user._doc._id)
            .then(token => {
              res.status(200).json({ ok: true, data: { ...user._doc, password: undefined }, token: `Bearer ${token}` })
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

