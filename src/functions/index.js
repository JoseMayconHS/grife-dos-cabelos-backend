require('dotenv').config()

const path = require('path'),
  fs = require('fs'),
  jwt = require('jsonwebtoken'),
  bcryptjs = require('bcryptjs')

exports.delFolder = (req, foldername, execption = false) => {
  return new Promise((resolve, reject) => {
    try {
      const thumbnail = execption ? execption : req.file.filename,
        dir = path.resolve(__dirname, '..', 'static', foldername, thumbnail)

      try {
        fs.unlink(dir, (err) => {
          return err ? reject() : resolve()
        })
      } catch(e) {
        reject()
      }

    } catch(err) {
      reject()
    }
  })
}

exports.middleware = (...steps) => {
  const stepByStep = index => {
    steps && index < steps.length && steps[index](() => stepByStep(index + 1))
  }

  stepByStep(0)
}

exports.token = id => {
  return new Promise((resolve, reject) => {
    try {
      const exp = Math.floor((Date.now() / 1000) + (60 * 60 * 24 * 7))

      jwt.sign({ id, exp }, process.env.WORD_SECRET || 'cpb', (err, token) => {
        if (err)
          return reject()
  
        resolve(token)
      })
    } catch(e) {
      reject()
    }
  })
}

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.WORD_SECRET, (err, decoded) => {
        if (err)
          return reject()

        resolve(decoded)
      })
    } catch(e) {
      reject()
    }
  })
}

exports.authenticate_user = (req, res, next) => {
  try {

    const { authorization } = req.headers

    if (authorization.split(' ').length !== 2)
      throw 'Token mal formatado'

    const [ Bearer, hash ] = authorization.split(' ')

    if (!/^Bearer$/.test(Bearer))
      throw 'Token não é desta aplicação'

    this.verifyToken(hash)  
      .then(decoded => {
        req.id = decoded.id

        if (decoded.id.adm) req.adm = true

        next()
      })
      .catch(() => {
        res.status(401).send()
      })

  } catch(e) {
    res.status(401).send(e)
  }
}

exports.authenticate_adm = (req, res, next) => {
  try {

    const { authorization } = req.headers

    if (authorization.split(' ').length !== 2)
      throw 'Token mal formatado'

    const [ Bearer, hash ] = authorization.split(' ')

    if (!/^Bearer$/.test(Bearer))
      throw 'Token não é desta aplicação'

    this.verifyToken(hash)  
      .then(decoded => {
        if (decoded.id.adm) {
          req.id = decoded.id.value
          req.adm = true

          return next()
        }
        
        res.status(401).send()
      })
      .catch(() => {
        res.status(401).send()
      })

  } catch(e) {
    res.status(401).send(e)
  }
}

exports.criptor = password => {
  const salt = bcryptjs.genSaltSync(10)

  return bcryptjs.hashSync(password.trim().toLowerCase(), salt)
}
