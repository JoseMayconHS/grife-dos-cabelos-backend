const path = require('path'),
	fs = require('fs'),
	Product = require('../../../data/Schemas/Product')

module.exports = {
	indexAll(req, res) {
		try {

			Product.find()
				.then(Documents => {
					res.status(200).json(Documents)
				})
				.catch(error => {
					throw error
				})

		} catch(error) {
			res.status(500).json({ error })
		}
	},
	store(req, res) {

		function delFolder() {
			return new Promise((resolve, reject) => {
				try {
					const thumbnail = path.parse(req.files.thumbnail_s[0].originalname).name,
						dir = path.resolve(__dirname, '..', '..', '..', 'static', 'products', thumbnail)

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

		try {
			const { title,  description, brand, type, combo } = req.body,
				thumbnails = req.files,
				thumbnail = path.parse(req.files.thumbnail_s[0].originalname).name

			let { item_included, price_from, price_to, promotion } = req.body

			item_included = item_included.split(',')
			// price_from = +price_from  (Ao criar um produto, não tem preço anterior)
			price_to = +price_to
			// promotion = promotion == '0' ? false : true (Ao criar, inicialmente não estará como promoção)

			const _document = {
				title,
				item_included, description,
				brand,
				thumbnail: {
					folder: thumbnail,
					files: {
						s: thumbnails.thumbnail_s[0].filename,
						m: thumbnails.thumbnail_m[0].filename,
						l: thumbnails.thumbnail_l[0].filename,
						p: thumbnails.thumbnail_p[0].filename
					}
				},
				price: {
					// _from: price_from,
					to: price_to
				},
				type,
				combo,
				// promotion
			}

			Product.create(_document)
				.then(product => {
					res.status(201).json({ product })
				})
				.catch(err => {
					delFolder(dir)
						.finally(() => {
							res.status(400).json({ err })
						})
				})

		} catch(err) {
			delFolder(dir)
				.finally(() => {
					res.status(500).json({ err })
				})
		}
	},

	update(req, res) {
    try {
			const { id: _id } = req.params,
				document = req.body

			Product.updateOne({ _id }, document)
					.then(rows => {

						if (rows.nModified) {
							res.status(200).json({ message: 'Atualizado' })
						} else {
							res.status(200).json({ message: 'Nada foi alterado' })
						}

					})
					.catch(error => {
						throw error
					})

		} catch(error) {
			res.status(500).json({ error })
		}
  },

	indexBy(req, res) {
		try {
			const where = req.query

			Product.find(where)
				.then(Documents => {
					res.status(200).json(Documents)
				})
				.catch(error => {
					throw error
				})

			
		} catch(error) {
			res.status(500).json({ error })
		}

	}
}
