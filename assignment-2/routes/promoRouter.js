const express = require('express')

const Promotions = require('../models/promotions')
const createError = require('../utils/errors')

const promoRouter = express.Router()

promoRouter
	.route('/')
	.get((req, res, next) => {
		Promotions.find({})
			.then(promotions => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(promotions)
			})
			.catch(err => next(err))
	})
	.post((req, res, next) => {
		Promotions.create(req.body)
			.then(promotion => {
				console.log('Dish Created ', promotion)
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(promotions)
			})
			.catch(err => next(err))
	})
	.put((req, res, next) => {
		next(createError(403, 'PUT operation not supported on /dishes'))
	})
	.delete((req, res, next) => {
		Promotions.remove({})
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

promoRouter
	.route('/:promotionId')
	.get((req, res, next) => {
		Promotions.findById(req.params.promotionId)
			.then(dish => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.post((req, res, next) => {
		next(createError(403, 'POST operation not supported on /dishes/' + req.params.dishId))
	})
	.put((req, res, next) => {
		Promotions.findByIdAndUpdate(
			req.params.dishId,
			{
				$set: req.body,
			},
			{ new: true },
		)
			.then(dish => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.delete((req, res, next) => {
		Promotions.findByIdAndRemove(req.params.dishId)
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

module.exports = promoRouter
