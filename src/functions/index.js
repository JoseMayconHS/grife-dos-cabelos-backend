require('dotenv').config()

const path = require('path'),
  fs = require('fs'),
  jwt = require('jsonwebtoken'),
  bcryptjs = require('bcryptjs')

exports.delFolder = (req, foldername, execption = false) => {
  return new Promise((resolve, reject) => {
    try {
      const thumbnail = execption ? execption : path.parse(req.file.originalname).name,
        dir = path.resolve(__dirname, '..', 'static', foldername, thumbnail)

      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)

        files
          .forEach(file => {
            fs.unlinkSync(path.resolve(dir, file))
          })

        fs.rmdirSync(dir)
      }
      resolve()
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

exports.token = _id => {
  return new Promise((resolve, reject) => {
    try {
      const exp = Math.floor(Date.now() / 1000) + (60 * 120)

      jwt.sign({ _id, exp }, process.env.WORD_SECRET, (err, token) => {
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
        req._id = decoded._id

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
        if (decoded._id.adm) {
          req._id = decoded._id.value

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
