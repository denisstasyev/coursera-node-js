const express = require('express')
const passport = require('passport')

const Users = require('../models/users')
const createError = require('../utils/errors')
const authenticate = require('../authenticate')

const userRouter = express.Router()

userRouter.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	User.find({})
		.then(users => {
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.json(users)
		})
		.catch(err => next(err))
})

/**
 * Send in body of HTTP request:
 *
 * {
 *   "username": "q",
 *   "password": "test"
 * }
 *
 * to register account
 */
userRouter.post('/signup', (req, res, next) => {
	Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			next(createError(500, 'Cannot create new user'))
			// res.statusCode = 500
			// res.setHeader('Content-Type', 'application/json')
			// res.json({ err: err })
		} else {
			if (req.body.firstname) {
				user.firstname = req.body.firstname
			}
			if (req.body.lastname) {
				user.lastname = req.body.lastname
			}
			user.save((err, user) => {
				if (err) {
					next(createError(500, 'Cannot create new user'))
					// res.statusCode = 500
					// res.setHeader('Content-Type', 'application/json')
					// res.json({ err: err })
				}
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json({ success: true, status: 'Registration Successful!' })
				})
			})
		}
	})
})

/**
 * Send in body of HTTP request:
 *
 * {
 *   "username": "q",
 *   "password": "test"
 * }
 *
 * and get token (token_from_request) to login. Then send in each request HTTP header:
 *
 *   Authorization: Bearer token_from_request
 *
 * to validate that you are valid user
 */
userRouter.post('/login', passport.authenticate('local'), (req, res) => {
	const token = authenticate.getToken({ _id: req.user._id })
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.json({ success: true, token, status: 'You are successfully logged in!' })
})

userRouter.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy()
		res.clearCookie('session-id')
		res.redirect('/')
	} else {
		next(createError(403, 'You are not logged in!'))
	}
})

module.exports = userRouter
