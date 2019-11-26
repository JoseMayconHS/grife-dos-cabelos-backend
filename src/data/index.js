const { connect } = require('mongoose')


connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

module.exports = connect
