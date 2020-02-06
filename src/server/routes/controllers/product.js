const Product = require('../../../data/Schemas/Product'),
	Type = require('../../../data/Schemas/Type'),
	Brand = require('../../../data/Schemas/Brand'),
	functions = require('../../../functions'),
	limit = 20


exports.indexAll = (req, res) => {
	try {

		const where = req.adm ? {} : { type: { $ne: 'combo' } }

		Product.countDocuments(where, (err, count) => {
			if (err) {
				res.status(500).send()
			} else {
				const { page = 1 } = req.params

				Product.find(where)
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

exports.swiper = (req, res) => {
	try {

		const { page = 1 } = req.params

		Type.findOne({ swiper: true }, '_id')
			.then(typeSwiper => {
				Product.find({ type_id: typeSwiper._id })
					.limit(7)
					.skip((7 * page) - 7)
					.sort('-createdAt')
					.then(Documents => {
						res.status(200).json({ ok: true, data: Documents })
					})
					.catch(err => {
						res.status(500).json({ ok: false })
					})
			})
			.catch(err => {
				res.status(500).json({ ok: false })
			})
	} catch(err) {
		res.status(500).send(err)
	}
}

exports.qtd = (req, res) => {
  try {

      Product.countDocuments((err, count) => {
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

exports.store = (req, res) => {
	try {
		const { title,  description, brand_id, type_id, insired } = req.body,
			thumbnail = req.file.filename

		const delDocAndFile = id => {
			Product.findByIdAndDelete(id)
				.then(_ => {
					functions.delFolder(req, 'products')
						.finally(() => {
							res.status(200).json({ ok: false, message: 'Erro ao atualizar a marca' })
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

		Brand.findById(brand_id)
			.then(brand => {
				if (brand) {

					Type.findById(type_id)
						.then(type => {

							if (type) {

								const _document = {
									title: title.trim(),
									item_included, 
									description: description.trim(),
									brand: brand.title,
									brand_id,
									type: type.name,
									type_id,
									thumbnail,
									price: {
										// _from: price_from,
										to: price_to
									},
									insired
									// promotion
								}
					
								Product.create(_document)
									.then(product => {
										Brand.updateOne({ _id: brand._id }, { products: brand.products + 1, insired })
											.then(_ => {
												Type.updateOne({ _id: type_id }, { products: type.products + 1, insired })
													.then(_ => {
														res.status(201).json({ ok: true, data: product._doc })
													})
													.catch(_ => {
														delDocAndFile(product._doc._id)
													})
											})
											.catch(_ => {
												delDocAndFile(product._doc._id)
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
										res.status(200).json({ ok: false, message: 'Tipo não encontrado' })
									})
							}

						})
						.catch(() => {
							functions.delFolder(req, 'products')
								.finally(() => {
									res.status(500).send()
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
			document = req.body,
			insired = req.body.insired

		if (document.title) {
			Product.findOne({ title: document.title })
				.then(productExists => {
					if (productExists) {
						res.status(200).json({ ok: false, message: 'Nome já existe!' })
					} else {
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
					}
				})
		} else {

			if (document.type_id || document.brand_id) {
				const { type_id, brand_id } = document

				Product.findById(_id)
					.then(product => {

						if (product) {
							if (type_id) {
					
								Type.findById(product.type_id)
									.then(beforeType => {
										Type.updateOne({ _id: beforeType._id }, { products: beforeType.products - 1, insired })
											.then(() => {
												Type.findById({ _id: type_id })
													.then(actualType => {
														Type.updateOne({ _id: type_id }, { products: actualType.products + 1, insired })
															.then(() => {
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
			
								Brand.findById(product.brand_id)
									.then(beforeBrand => {
										Brand.updateOne({ _id: beforeBrand._id }, { products: beforeBrand.products - 1, insired })
											.then(() => {
												Brand.findById({ _id: brand_id })
													.then(actualBrand => {
														Brand.updateOne({ _id: brand_id }, { products: actualBrand.products + 1, insired })
															.then(() => {
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

			} else {
				if (document.item_included) 
				document.item_included = document.item_included.split(',')

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
			}
		}

	} catch(error) {
		res.status(500).send()
	}
}

exports.indexBy = (req, res) => {
	try {
		let where = req.query || {}

		if (where.promotion) where.promotion = +where.promotion > 0 ? true : false

		if (where.brand_id && !req.adm) where = { ...where, type: { $ne: 'Combo' } }

		// if (where.brand_id)

		const { page = 1 } = req.params

		Product.countDocuments(where, (err, count) => {
			if (err) {
				res.status(500).send()
			} else {
				Product.find(where)
					.limit(limit)
					.skip((limit * page) - limit)
					.sort('-createdAt')
					.then(Documents => {
						
						const data = where._id ? Documents[0] : Documents

						if (data) {
							res.status(200).json({ ok: true, data, limit, count })
						} else {
							res.status(400).send()
						}

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

exports.remove = (req, res) => {
	try {
		const { _id } = req.paramsinsired = req.body.insired

		Product.findById(_id)
			.then(product => {
				Brand.findById(product.brand_id, 'products')
					.then(brand => {
						Brand.updateOne({ _id: product.brand_id }, { products: brand.products - 1 })
							.then(() => {
								Type.findById(product.type_id)
									.then(type => {
										Type.updateOne({ _id: product.type_id }, { products: type.products - 1 })
											.then(() => {
												functions.delFolder(null, 'products', product.thumbnail)
													.finally(() => {
														Product.deleteOne({ _id })
															.then(_ => {
																res.status(200).json({ ok: true })
															})
															.catch(_ => {
																res.status(500).send()
															})
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

		const { _id } = req.params,
			{ filename } = req.file,
			{ insired } = req.body

			Product.updateOne({ _id }, { thumbnail: filename, insired })
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
