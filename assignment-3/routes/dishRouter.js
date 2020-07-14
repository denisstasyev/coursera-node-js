const express = require('express')

const Dishes = require('../models/dishes')
const createError = require('../utils/errors')
const authenticate = require('../authenticate')

const dishRouter = express.Router()

dishRouter
	.route('/')
	.get((req, res, next) => {
		Dishes.find({})
			.populate('comments.author')
			.then(dishes => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				// res.writeHead(200, { 'Content-Type': 'application/json' })\
				//
				// The res object in Express is a subclass of Node.js's http.ServerResponse
				// (read the http.js source). You are allowed to call res.setHeader(name, value)
				// as often as you want until you call res.writeHead(statusCode). After writeHead,
				// the headers are baked in and you can only call res.write(data), and finally res.end(data)
				// https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
				res.json(dishes)
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Dishes.create(req.body)
			.then(dish => {
				console.log('Dish Created ', dish)
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		next(createError(403, 'PUT operation not supported on /dishes'))
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Dishes.remove({})
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

dishRouter
	.route('/:dishId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.populate('comments.author')
			.then(dish => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		next(createError(403, 'POST operation not supported on /dishes/' + req.params.dishId))
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Dishes.findByIdAndUpdate(
			req.params.dishId,
			{
				$set: req.body,
			},
			{ new: true },
		) // {new: true} tells to return new updated item
			.then(dish => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

dishRouter
	.route('/:dishId/comments')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.populate('comments.author')
			.then(dish => {
				if (dish != null) {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(dish.comments)
				} else {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				}
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(dish => {
				if (dish != null) {
					req.body.author = req.user._id
					dish.comments.push(req.body)
					dish.save()
						.then(dish => {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							res.json(dish)
						})
						.catch(err => next(err))
				} else {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				}
			})
			.catch(err => next(err))
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		next(
			createError(
				403,
				'PUT operation not supported on /dishes/' + req.params.dishId + '/comments',
			),
		)
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(dish => {
				if (dish != null) {
					for (let i = dish.comments.length - 1; i >= 0; i--) {
						dish.comments.id(dish.comments[i]._id).remove()
					}
					dish.save()
						.then(dish => {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							res.json(dish)
						})
						.catch(err => next(err))
				} else {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				}
			})
			.catch(err => next(err))
	})

dishRouter
	.route('/:dishId/comments/:commentId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.populate('comments.author')
			.then(dish => {
				if (dish != null && dish.comments.id(req.params.commentId) != null) {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(dish.comments.id(req.params.commentId))
				} else if (dish == null) {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				} else {
					next(createError(404, 'Comment ' + req.params.commentId + ' not found'))
				}
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		next(
			createError(
				403,
				'POST operation not supported on /dishes/' +
					req.params.dishId +
					'/comments/' +
					req.params.commentId,
			),
		)
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(dish => {
				if (
					dish != null &&
					dish.comments.id(req.params.commentId) != null &&
					dish.comments.id(req.params.commentId).author.equals(req.user._id)
				) {
					if (req.body.rating) {
						dish.comments.id(req.params.commentId).rating = req.body.rating
					}
					if (req.body.comment) {
						dish.comments.id(req.params.commentId).comment = req.body.comment
					}
					dish.save()
						.then(dish => {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							res.json(dish)
						})
						.catch(err => next(err))
				} else if (dish == null) {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				} else {
					next(createError(404, 'Comment ' + req.params.commentId + ' not found'))
				}
			})
			.catch(err => next(err))
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(dish => {
				if (
					dish != null &&
					dish.comments.id(req.params.commentId) != null &&
					dish.comments.id(req.params.commentId).author.equals(req.user._id)
				) {
					dish.comments.id(req.params.commentId).remove()
					dish.save()
						.then(dish => {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							res.json(dish)
						})
						.catch(err => next(err))
				} else if (dish == null) {
					next(createError(404, 'Dish ' + req.params.dishId + ' not found'))
				} else {
					next(createError(404, 'Comment ' + req.params.commentId + ' not found'))
				}
			})
			.catch(err => next(err))
	})

module.exports = dishRouter
