const { Expo } = require('expo-server-sdk'),
  ExpoModel = require('../../../data/Schemas/Expo'),
  Adm = require('../../../data/Schemas/Adm'),
  expo = new Expo()

exports.qtd = (req, res) => {
  try {

    req.db('expo')
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

exports.send = (req, res) => {
  try {

    const { title, body, date } = req.body

    if (!title || !body) 
      throw new Error()

    if (typeof title !== 'string' || typeof body !== 'string')
      throw new Error()

    if (!title.length || !body.length)
      throw new Error()

    req.db('expo')
      .select('token')
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

          req.db('adm')
            .where({ id: req.id })
            .select('notifications')
            .first()
            .then(adm => {
              try {
  
                let newArray = [ ...JSON.parse(adm.notifications)]
  
                newArray.unshift({
                  success,
                  title, body,
                  date
                })
  
                if (newArray.length >= 10) {
                  newArray = newArray.splice(0, 10)
                }
  
                req.db('adm')
                  .where({ id: req.id })
                  .update({ notifications: JSON.stringify(newArray) })
                  .then(() => {})
                  .catch(() => {})
                  .finally(() => {
                    send()
                  })
    
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

    req.db('expo')
      .where({ token })
      .first()
      .then(already => {
        if (already) return res.status(201).json({ ok: true, message: 'Você será notificado dos avisos' })

        req.db('expo')
          .insert({ token })
          .then(() => {
            res.status(201).json({ ok: true, message: 'Você será notificado dos avisos' })
          })
          .catch(() => {
            res.status(201).json({ ok: false, message: 'Não será possivel mandar notificações' })
          })

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

    req.db('adm')
      .where({ id: req.id })
      .select('notifications')
      .first()
      .then(adm => {
        try {
          if (!adm) 
            throw new Error()

          if (!adm.notifications)
            throw new Error()

          res.status(200).json({ ok: true, data: JSON.parse(adm.notifications) })

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

exports.remove = (req, res) => {
  try {

    const { index: deleteIt } = req.params

    req.db('adm')
      .where({ id: req.id })
      .select('notifications')
      .first()
      .then(adm => {
        try {

          if (!adm) 
            throw new Error()

          if (!adm.notifications)
            throw new Error()


          const newNotifications  = JSON.parse(adm.notifications).filter((item, index) => +index !== +deleteIt)

          adm.notifications = [ ...newNotifications ]

          req.db('adm')
            .where({ id: req.id })
            .update({ notifications: JSON.stringify(newNotifications) })
            .then(() => {
              res.status(200).send()
            })
            .catch(() => {
              res.status(500).send()
            })

        } catch(e) {
          res.status(500).send()
        }
      })
      .catch(e => {
        res.status(500).send()
      })      

  } catch(e) {
    res.status(500).send()
  }
}

