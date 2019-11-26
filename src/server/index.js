require('dotenv').config()
const express = require('express')

require('../data')

const port = process.env.PORT

const app = express()

app.use(express.json())

require('./routes')(app)

app.listen(port, err => console.log(err ? 'Ocorreu um erro' : 'Servidor online'))
