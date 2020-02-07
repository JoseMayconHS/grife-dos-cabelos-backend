const Product = require('../../../data/Schemas/Product'),
	Type = require('../../../data/Schemas/Type'),
	Brand = require('../../../data/Schemas/Brand'),
	functions = require('../../../functions'),
	limit = +process.env.LIMIT_PAGINATION || 10


exports.indexAll = (req, res) => {
	try {

		const whereNot = req.adm ? {} : { type: 'Combo' }

		req.db('product')
			.count('id')
			.whereNot(whereNot)
			.first()
			.then(count => {
				count = +Object.values(count)[0]

				const { page } = req.params

				req.db('product')
					.whereNot(whereNot)
					.limit(limit)
					.offset(page * limit - limit)
					.orderBy('id', 'desc')
					.then(products => {

						products = products.map(product => ({
							...product,
							price: JSON.parse(product.price),
							item_included: JSON.parse(product.item_included)
						}))

						res.status(200).json({ ok: true, data: products, limit, count })
					})
					.catch(_ => {
						res.status(500).send()
					})

			})
			.catch(_ => {
				res.status(500).send()
			})

	} catch(error) {
		res.status(500).send()
	}
}

exports.swiper = (req, res) => {
	try {

		// Product.find()
		// 	.then(Documents => {
		// 		res.status(200).json({ ok: true, data: Documents })
		// 	})
		// 	.catch(err => {
		// 		res.status(500).send()
		// 	})
		

		Type.findOne({ swiper: true }, '_id')
			.then(typeSwiper => {

				req.db('product')
					.where({ type_id: typeSwiper.id })
					.limit(10)
					.orderBy('id', 'desc')
					.then(productsCombos => {
						res.status(200).json({ ok: true, data: productsCombos })
					})
					.catch(err => {
						res.status(500).send()
					})

			})
			.catch(err => {
				res.status(500).send()
			})

	} catch(err) {
		res.status(500).send(err)
	}
}

exports.qtd = (req, res) => {
  try {

    req.db('product')
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

exports.store = (req, res) => {
	try {
		const { title,  description, brand_id, type_id, insired } = req.body,
			thumbnail = req.file.filename

		const delDocAndFile = id => {

			req.db('product')
				.where({ id })
				.del()
				.then(() => {
					functions.delFolder(req, 'products')
						.finally(() => {
							res.status(200).json({ ok: false, message: 'Erro ao criar produto' })
						})
				})
				.catch(_ => {
					functions.delFolder(req, 'products')
						.finally(() => {
							res.status(500).send()
						})
				})

		}

		let { item_included, price_from, price_to, promotion } = req.body

		item_included = item_included
			.split(',')
			.map(str => str.trim())
		// price_from = +price_from  (Ao criar um produto, não tem preço anterior)
		price_to = +price_to
		// promotion = promotion == '0' ? false : true (Ao criar, inicialmente não estará como promoção)

		const delFolder = fn => {
			functions.delFolder(req, 'products')
				.finally(() => {
					fn()
				})
		}

		req.db('brand')
			.where({ id: brand_id })
			.select('title', 'products')
			.first()
			.then(brand => {
				if (brand) {

					req.db('type')
					.where({ id: type_id })
					.select('name', 'products')
					.first()
					.then(type => {
						if (type) {

							const _document = {
								title: title.trim(),
								item_included: JSON.stringify(item_included), 
								description: description.trim(),
								brand: brand.title,
								brand_id,
								type: type.name,
								type_id,
								thumbnail,
								price: JSON.stringify({
									// _from: price_from,
									to: price_to
								}),
								insired
								// promotion
							}

							req.db('product')
								.insert(_document)
								.then(result => {

									req.db('brand')
										.where({ id: brand_id })
										.update({ products: brand.products + 1, insired })
										.then(() => {
											req.db('type')
												.where({ id: type_id })
												.update({ products: brand.products + 1, insired })
												.then(() => {
													res.status(201).json({ ok: true, data: { id: result[0] } })
												})
												.catch(_ => {
													delDocAndFile(result[0])
												})
										})
										.catch(_ => {
											delDocAndFile(result[0])
										})

								})
								.catch(() => {
									delFolder(() => {
										res.status(500).send()
									})
								})

						} else {
							delFolder(() => {
								res.status(200).json({ ok: false, message: 'Tipo não encontrado' })
							})
						}
					})
					.catch(() => {
						delFolder(() => {
							res.status(500).send()
						})
					})
		

				} else {
					delFolder(() => {
						res.status(200).json({ ok: false, message: 'Marca não encontrada' })
					})
				}
			})
			.catch(() => {
				delFolder(() => {
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
		const { id: _id } = req.params,
			document = req.body,
			insired = req.body.insired

		if (document.title) {

			req.db('product')
				.where({ title: document.title })
				.first()
				.then(productExists => {
					if (productExists) {
						res.status(200).json({ ok: false, message: 'Nome já existe!' })
					} else {

						req.db('product')
							.where({ id })
							.update(document)
							.then((rows) => {

								res.status(200).json({ ok: true, message: 'Atualizado' })

							})
							.catch(_ => {
								res.status(500).send()
							})

					}
				})
				.catch(() => {
					res.status(500).send()	
				})

		} else {

			if (document.type_id || document.brand_id) {
				const { type_id, brand_id } = document

				req.db('product')
					.where({ id })
					.first()
					.then(product => {

						if (product) {
							if (type_id) {

								req.db('type')
									.where({ id: product.type_id })
									.select('id', 'products')
									.first()
									.then(beforeType => {

										req.db('type')
											.where({ id: beforeType.id })
											.update({ products: beforeType.products - 1, insired })
											.then(() => {

												req.db('type')
													.where({ id: type_id })
													.first()
													.then(actualType => {

														req.db('type')
															.where({ id: type_id })
															.update({ products: actualType.products + 1, insired })
															.then(() => {

																req.db('product')
																	.where({ id })
																	.update(document)
																	.then(() => {
																		res.status(200).json({ ok: true, message: 'Atualizado' })
																	})
																	.catch(_ => {
																		res.status(500).send()
																	})
																	
															}).catch(() => {
																res.status(500).send()	
															})
															
													}).catch(() => {
														res.status(500).send()	
													})
													
											}).catch(() => {
												res.status(500).send()	
											})

									}).catch(() => {
										res.status(500).send()	
									})

							} else if (brand_id) {
			
								req.db('brand')
									.where({ id: product.brand_id })
									.select('id', 'products')
									.first()
									.then(beforeBrand => {

										req.db('brand')
											.where({ id: beforeBrand.id })
											.update({ products: beforeBrand.products - 1, insired })
											.then(() => {

												req.db('brand')
													.where({ id: brand_id })
													.first()
													.then(actualBrand => {

														req.db('brand')
															.where({ id: brand_id })
															.update({ products: actualBrand.products + 1, insired })
															.then(() => {

																req.db('product')
																	.where({ id })
																	.update(document)
																	.then(() => {
																		res.status(200).json({ ok: true, message: 'Atualizado' })
																	})
																	.catch(_ => {
																		res.status(500).send()
																	})
																	
															}).catch(() => {
																res.status(500).send()	
															})
															
													}).catch(() => {
														res.status(500).send()	
													})
													
											}).catch(() => {
												res.status(500).send()	
											})

									}).catch(() => {
										res.status(500).send()	
									})

							} else {
								res.status(400).send()
							}
						} else {
							res.status(400).send()		
						}

					}).catch(() => {
						res.status(500).send()	
					})

				
			} else if (document.price) { 

				const price = JSON.stringify(document.price)

				req.db('product')
					.where({ id })
					.update({ price })
					.then(() => {
						res.status(200).json({ ok: true, message: 'Atualizado' })
					})
					.catch(_ => {
						res.status(500).send()
					})

			} else {

				if (document.item_included) 
					document.item_included = JSON.stringify(document.item_included.split(','))

				req.db('product')
					.where({ id })
					.update(document)
					.then(() => {
						res.status(200).json({ ok: true, message: 'Atualizado' })
					})
					.catch(_ => {
						res.status(500).send()
					})
					
			}
		}

	} catch(error) {
		res.status(500).send()
	}
}

exports.indexBy = (req, res) => {
	try {
		let where = req.query || {}

		if (where.promotion) where.promotion = +where.promotion

		let whereNot = {}

		if (where.brand_id && !req.adm) whereNot = { type: 'Combo' }

		// if (where.brand_id)

		const { page = 1 } = req.params

		req.db('product')
			.count('id')
			.whereNot(whereNot)
			.first()
			.then(count => {

				count = +Object.values(count)[0]

				req.db('product')
          .where(where)
          .limit(limit)
          .offset(page * limit - limit)
					.orderBy('id', 'desc')
					.whereNot(whereNot)
          .then(products => {

						const data = where.id ? products[0] : products

            if (data) {
              products = products.map(product => ({
								...product,
								price: JSON.parse(product.price),
								item_included: JSON.parse(product.item_included)
							}))
	
							const data = where.id ? products[0] : products
	
							res.status(200).json({ ok: true, data, limit, count })
            } else {
              res.status(400).send()
            }

          })
          .catch(err => {
            res.status(500).send()
          })

			})
			.catch(_ => {
        res.status(500).send()
      })
	
	} catch(error) {
		res.status(500).send()
	}

}

exports.remove = (req, res) => {
	try {
		const { id: _id } = req.params = req.body.insired

		req.db('product')
			.where({ id })
			.select('type_id', 'brand_id')
			.first()
			.then(product => {

				const updateBrand = (next) => {
					req.db('brand')
						.where({ id: product.brand_id })
						.select('products')
						.first()
						.then(brand => {

							req.db('brand')
								.where({ id: product.brand_id })
								.update({ products: brand.products - 1 })
								.then(() => {

									typeof next === 'function' && next()
									
								}).catch(() => {
									res.status(500).send()
								})
								
						}).catch(() => {
							res.status(500).send()
						})
				}

				const updateType = (next) => {
					req.db('type')
						.where({ id: product.type_id })
						.select('products')
						.first()
						.then(type => {

							req.db('type')
								.where({ id: product.type_id })
								.update({ products: type.products - 1 })
								.then(() => {

									typeof next === 'function' && next()
									
								}).catch(() => {
									res.status(500).send()
								})
								
						}).catch(() => {
							res.status(500).send()
						})
				}

				const delProduct = () => {
					req.db('product')
						.where({ id })
						.del()
						.then(() => {
							res.status(200).json({ ok: true, message: 'apagado com sucesso' })
						})
						.catch(() => {
							res.status(500).send()
						})
				}

				functions.middleware(updateBrand, updateType, delProduct)
					
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
			.catch(err => res.status(400).send(err))

	} catch(err) {
		res.status(500).json(err)
	}
}

exports.update_thumbnail = (req, res) => {
	try {

		const { id: _id } = req.params,
			{ filename } = req.file,
			{ insired } = req.body

			req.db('product')
				.where({ id })
				.update({ thumbnail: filename, insired })
				.then(() => {
					res.status(200).json({ ok: true })
				})
				.catch(() => {
					res.status(200).json({ ok: false, message: 'Erro ao atualizar dado' })
				})
				
	} catch(e) {
		res.status(500).send()
	}
}
