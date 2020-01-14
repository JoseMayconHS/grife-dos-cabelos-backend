const { Expo } = require('expo-server-sdk'),
  ExpoModel = require('../../../data/Schemas/Expo'),
  Adm = require('../../../data/Schemas/Adm'),
  expo = new Expo()

exports.qtd = (req, res) => {
  try {

      ExpoModel.countDocuments((err, count) => {
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

exports.send = (req, res) => {
  try {

    const { title, body, date } = req.body

    if (!title || !body) 
      throw new Error()

    if (typeof title !== 'string' || typeof body !== 'string')
      throw new Error()

    if (!title.length || !body.length)
      throw new Error()

    ExpoModel.find({}, 'token')
      .then(async tokens => {
        const messagens = []

        for (let token_obj of tokens) {
          
          const { token } = token_obj

          if (Expo.isExpoPushToken(token)) {
            messagens.push({
              to: token,
              priority: 'high',
              sound: 'default',
              title, body
            })
          }

        }

        const addInAdmData = (success, send) => {
          Adm.findById(req._id)
          .then(adm => {
            try {

              let newArray = [ ...adm.notifications]

              newArray.unshift({
                success,
                title, body,
                date
              })

              if (newArray.length >= 10) {
                newArray = newArray.splice(0, 10)
              }

              

              adm.notifications = newArray

              Adm.updateOne({ _id: req._id }, adm, () => send())

            } catch(e) {
              send()
            }
          })
          .catch(() => {
            send()
          })
        }

        const chunks = expo.chunkPushNotifications(messagens)

        for (let chunk of chunks) {
          try {
            await expo.sendPushNotificationsAsync(chunk)
          } catch(e) {
            return addInAdmData(false, () => res.status(500).send())
          }
        }

        return addInAdmData(true, () => res.status(200).send())
    
      })
      .catch(() => {
        res.status(500).send()
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.store = (req, res) => {
  try {

    const { token } = req.body

    if (!Expo.isExpoPushToken(token))
      return res.status(400).send()

    
    ExpoModel.updateOne({ token }, { token }, { upsert: true })
      .then(() => {
        res.status(201).json({ ok: true, message: 'Você será notificado dos avisos' })
      })
      .catch(() => {
        res.status(201).json({ ok: false, message: 'Não será possivel mandar notificações' })
      })

  } catch(e) {
    res.status(500).send()
  }
}

exports.recents = (req, res) => {
  try {

    Adm.findById(req._id, 'notifications')
      .then(adm => {
        try {
          if (!adm) 
            throw new Error()

          if (!adm.notifications)
            throw new Error()

          res.status(200).json({ ok: true, data: adm.notifications })

        } catch(e) {
          res.status(200).json({ ok: false })
        }
      })
      .catch(e => {
        res.status(200).json({ ok: false })
      })

  } catch(e) {
    res.status(200).json({ ok: false })
  }
}

