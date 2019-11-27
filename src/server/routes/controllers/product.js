const path = require('path'),
	fs = require('fs'),
	Product = require('../../../data/Schemas/Product')

module.exports = {
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
			const { title,  description, brand } = req.body,
				thumbnails = req.files,
				thumbnail = path.parse(req.files.thumbnail_s[0].originalname).name

			let { item_included, price_from, price_to, promotion } = req.body

			item_included = item_included.split('@')
			price_from = +price_from
			price_to = +price_to
			promotion = promotion == '0' ? false : true

			const _document = {
				title,
				item_included, description,
				brand,
				thumbnail: {
					folder: thumbnail,
					files: {
						s: thumbnails.thumbnail_s[0].filename,
						m: thumbnails.thumbnail_m[0].filename,
						l: thumbnails.thumbnail_l[0].filename
					}
				},
				price: {
					_from: price_from,
					to: price_to
				},
				promotion
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
	}
}