const Type = require('../../../data/Schemas/Type'),
  limit = 1

exports.store = (req, res) => {
  try {

    const { name } = req.body

    Type.findOne({ name })
      .then(typeAllreadyExists => {
        if (typeAllreadyExists) {
          res.status(200).json({ ok: false, message: 'Tipo já existe' })
        } else {

          Type.create({ name })
            .then(created => {
              res.status(201).json({ ok: true, data: created })
            })
            .catch(() => {
              res.status(500).send()    
            })

        }
         
      })
      .catch(() => {
        res.status(500).send()    
      })

  } catch(err) {
    res.status(500).send()
  }
}


exports.indexAll = (req, res) => {
  try {
    const { page = 1 } = req.params

    Type.countDocuments((err, count) => {
      if (err) {
        res.status(500).send(err)
      } else {

        Type.find()
          .limit(limit)
          .skip((limit * page) - limit)
          .sort('-createdAt')
          .then(Documents => {
            res.status(200).json({ ok: true, data:  Documents, limit, count })
          })
          .catch(_ => {
            res.status(500).send()
          })

      }
    })

  } catch(err) {
    res.status(500).send()
  }
}

exports.update = (req, res) => {
  try {

    const { _id } = req.params

    if (req.body.name) {

      Type.findOne({ name: req.body.name })
        .then(typeExists => {
          if (typeExists) {
            res.status(200).json({ ok: false, message: 'Já existe um tipo com esse nome' })
          } else {

            Type.updateOne({ _id }, req.body, (err) => {
              if (err) {
                res.status(500).send()
              } else {
                res.status(200).json({ ok: true })
              }
            })
          }
        })

    } else {
      Type.updateOne({ _id }, req.body, (err) => {
        if (err) {
          res.status(500).send()
        } else {
          res.status(200).json({ ok: true })
        }
      })
    }

  } catch(e) {
    res.status(500).send()
  }
}

exports.remove = (req, res) => {
  try {

    const { _id } = req.params

    Type.deleteOne({ _id }, (err) => {
      if (err) {
        res.status(500).send(err)
      } else {

        res.status(200).send()

      }
    })


  } catch(e) {
    res.status(500).send()
  }
}

