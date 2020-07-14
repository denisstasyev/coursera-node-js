const express = require('express')

const Leaderships = require('../models/leaders')
const createError = require('../utils/errors')
const authenticate = require('../authenticate')

const leaderRouter = express.Router()

leaderRouter
	.route('/')
	.get((req, res, next) => {
		Leaderships.find({})
			.then(leaders => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(leaders)
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaderships.create(req.body)
			.then(leader => {
				console.log('Leader Created ', leader)
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(leader)
			})
			.catch(err => next(err))
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		next(createError(403, 'PUT operation not supported on /leaders'))
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaderships.remove({})
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

leaderRouter
	.route('/:leaderId')
	.get((req, res, next) => {
		Leaderships.findById(req.params.leaderId)
			.then(dish => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(dish)
			})
			.catch(err => next(err))
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		next(createError(403, 'POST operation not supported on /leaders/' + req.params.leaderId))
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaderships.findByIdAndUpdate(
			req.params.leaderId,
			{
				$set: req.body,
			},
			{ new: true },
		)
			.then(leader => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(leader)
			})
			.catch(err => next(err))
	})
	.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaderships.findByIdAndRemove(req.params.leaderId)
			.then(resp => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(resp)
			})
			.catch(err => next(err))
	})

module.exports = leaderRouter
