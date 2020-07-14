const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('./models/users')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens

const config = require('./config.js')
const createError = require('./utils/errors')

// Use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(Users.authenticate()))

// Use static serialize and deserialize of model for passport session support
// To enable cookies and so on
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

// Some methods

exports.getToken = function (user) {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 })
}

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey,
}

exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwtPayload, done) => {
		console.log('JWT payload: ', jwtPayload)

		Users.findOne({ _id: jwtPayload._id }, (err, user) => {
			if (err) {
				return done(err, false)
			} else if (user) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		})
	}),
)

exports.verifyUser = passport.authenticate('jwt', { session: false })

exports.verifyAdmin = function (req, res, next) {
	// User.findOne({ _id: req.user._id })
	// 	.then(user => {
	// 		console.log('User: ', req.user)
	// 		if (user.admin) {
	// 			next()
	// 		} else {
	// 			next(createError(403, 'You are not authorized to perform this operation!'))
	// 		}
	// 	})
	// 	.catch(err => next(err))

	if (req.user.admin) {
		next()
	} else {
		next(createError(403, 'You are not authorized to perform this operation!'))
	}
}
