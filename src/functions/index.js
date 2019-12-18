const path = require('path'),
  fs = require('fs')

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
