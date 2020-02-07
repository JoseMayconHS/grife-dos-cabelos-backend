require('dotenv').config()
const express = require('express'),
  path = require('path'),
  knexfile = require(path.resolve(__dirname, '..', '..', 'knexfile.js')),
  cors = require('cors'),
  db = require('knex')(knexfile),
  port = process.env.PORT || 3030,
  app = express()

// require('../data')

db.migrate.latest()

app.use(cors({
  origin: 'http://www.grifedoscabelos.com.br'
}))
// app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  req.db = db
  next()
})
app.use('/files', express.static(path.resolve(__dirname, '..', 'static')))

require('./routes')(app)

app.listen(port, err => console.log(err ? 'Ocorreu um erro' : `Servidor online na porta ${port}`))
