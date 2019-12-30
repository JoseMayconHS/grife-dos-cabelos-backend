const { Expo } = require('expo-server-sdk'),
  ExpoModel = require('../../../data/Schemas/Expo'),
  expo = new Expo()

exports.send = (req, res) => {
  try {

    const { title, body } = req.body

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
              sound: 'default',
              title, body
            })
          }

        }

        const chunks = expo.chunkPushNotifications(messagens)

        for (let chunk of chunks) {
          try {
            await expo.sendPushNotificationsAsync(chunk)
          } catch(e) {

          }
        }

        res.status(200).send()
    
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
