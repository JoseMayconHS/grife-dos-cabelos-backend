const path = require('path'),
	Product = require('../../../data/Schemas/Product'),
	Brand = require('../../../data/Schemas/Brand'),
	functions = require('../../../functions'),
	limit = 12

exports.indexAll = (req, res) => {
	try {

		Product.countDocuments((err, count) => {
			if (err) {
				res.status(500).send()
			} else {
				const { page = 1 } = req.params

				Product.find({ type: { $ne: 'combo' } })
					.limit(limit)
					.skip((limit * page) - limit)
					.sort('-createdAt')
					.then(Documents => {
						res.status(200).json({ ok: true, data: Documents, limit, count })
					})
					.catch(_ => {
						res.status(500).send()
					})
			}
		})

	} catch(error) {
		res.status(500).send()
	}
}

exports.store = (req, res) => {
	try {
		const { title,  description, brand_id, type } = req.body,
			thumbnail = path.parse(req.file.originalname).name

		let { item_included, price_from, price_to, promotion } = req.body

		item_included = item_included
			.split(',')
			.map(str => str.trim())
		// price_from = +price_from  (Ao criar um produto, não tem preço anterior)
		price_to = +price_to
		// promotion = promotion == '0' ? false : true (Ao criar, inicialmente não estará como promoção)

		Brand.findById(brand_id)
			.then(brand => {
				if (brand) {
					const _document = {
						title: title.trim(),
						item_included, 
						description: description.trim(),
						brand: brand.title,
						brand_id,
						thumbnail,
						price: {
							// _from: price_from,
							to: price_to
						},
						type,
						insired: new Date().toLocaleString()
						// promotion
					}
		
					Product.create(_document)
						.then(product => {
							Brand.updateOne({ _id: brand._id }, { products: brand.products + 1 })
								.then(_ => {
									res.status(201).json({ ok: true, data: product._doc })
								})
								.catch(_ => {
									Product.findByIdAndDelete(product._doc._id)
										.then(_ => {
											res.status(200).json({ ok: false, message: 'Erro ao atualizar a marca' })
										})
										.catch(_ => {
											res.status(500).send()
										})
								})
						})
						.catch(_ => {
							functions.delFolder(req, 'products')
								.finally(() => {
									res.status(400).send()
								})
						})
		
				} else {
					functions.delFolder(req, 'products')
						.finally(() => {
							res.status(200).json({ ok: false, message: 'Marca não encontrada' })
						})
				}
			})
			.catch(_ => {
				functions.delFolder(req, 'products')
					.finally(() => {
						res.status(500).send()
					})
			})

	} catch(err) {
		functions.delFolder(req, 'products')
			.finally(() => {
				res.status(500).send()
			})
	}
}

exports.update = (req, res) => {
	try {
		const { _id } = req.params,
			document = req.body

		Product.updateOne({ _id }, document)
				.then(rows => {

					if (rows.nModified) {
						res.status(200).json({ ok: true, message: 'Atualizado' })
					} else {
						res.status(200).json({ ok: false, message: 'Nada foi alterado' })
					}

				})
				.catch(_ => {
					res.status(500).send()
				})

	} catch(error) {
		res.status(500).send()
	}
}

exports.indexBy = (req, res) => {
	try {
		let where = req.query

		const { page = 1 } = req.params

		if (where.type === 'combo') {
			Product.find(where)
				.then(Documents => [
					res.status(200).json({ ok: true, data: Documents })
				])
				.catch(_ => {
					res.status(500).send()
				})
		} else {
			if (where.brand_id) where = { ...where, type: { $ne: 'combo' } }

			Product.find(where)
				.limit(limit)
				.skip((limit * page) - limit)
				.sort('-createdAt')
				.then(Documents => {
					res.status(200).json({ ok: true, data: where._id ? Documents[0] : Documents, limit })
				})
				.catch(_ => {
					res.status(500).send()
				})
		}
			
	} catch(error) {
		res.status(500).send()
	}

}

exports.remove = (req, res) => {
	try {
		const { _id } = req.params

		Product.findById(_id)
			.then(product => {
				functions.delFolder(null, 'products', product.thumbnail)
					.finally(() => {
						Product.deleteOne({ _id } 	)
							.then(_ => {
								res.status(200).send('Excluido com sucesso')
							})
							.catch(_ => {
								res.status(500).send()
							})
					})
			})
			.catch(() => {
				res.status(500).send()
			})
			
	} catch(e) {
		res.status(500).send()
	}
}

exports.search = (req, res) => {
	try {

		const { word, page = 1 } = req.params

		const condition = new RegExp(word.trim(), 'gi')

		Product.find({ type: { $ne: 'combo' } })
			.limit(limit)
			.skip((limit * page) - limit)
			.sort('-createdAt')
			.then(all => all.filter(({ title, type, brand }) => title.search(condition) >= 0 || brand.search(condition) >= 0 || type.search(condition) >= 0))
			.then(filtered => res.status(200).json({ ok: true, data: filtered, limit }))
			.catch(err => res.status(200).json({ ok: false, err }))

	} catch(err) {
		res.status(500).json(err)
	}
}
