const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
// const createError = require('http-errors')
const https = require('https')
const fs = require('fs')

const passport = require('passport')
require('./authenticate') // to initialize passport

const config = require('./config')
const createError = require('./utils/errors')

const usersRouter = require('./routes/userRouter')
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const favoriteRouter = require('./routes/favoriteRouter')

const port = 3000
const hostname = 'localhost'
const app = express()

/**
 * MongoDB
 */
const url = config.mongoUrl
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

connect
	.then(db => {
		console.log('Connected correctly to Mongo DB server')
	})
	.catch(error => {
		console.log(`Error with Mongo DB: ${error}`)
	})

/**
 * Express
 */
app.set('secPort', port + 443)

// Secure traffic only
app.all('*', (req, res, next) => {
	if (req.secure) {
		return next()
	} else {
		res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
	}
})

app.use(logger('dev'))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json()) // only json in all incoming requests (parsed with body-parser internally)

app.use('/users', usersRouter)
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leadership', leaderRouter)
app.use('/favorites', favoriteRouter)

app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded({ extended: false }))

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404, 'Page not found'))
})

// error handler
app.use((err, req, res, next) => {
	// set locals (response local variables scoped to the request), only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {} // req.app.get('env') === process.env.NODE_ENV

	// render the error page
	res.status(err.status || 500)

	// res.render('error') // uses res.locals
	res.json({
		message: err.message,
		error: err,
	})
})

// runs server
app.listen(port, hostname, () => {
	console.log(`Express server running at http://${hostname}:${port}/`)
})

// create HTTPS server
const options = {
	key: fs.readFileSync(__dirname + '/private.key'),
	cert: fs.readFileSync(__dirname + '/certificate.pem'),
}
const secureServer = https.createServer(options, app)

// listen on provided port, on all network interfaces
secureServer.listen(app.get('secPort'), () => {
	console.log('Server listening on port ', app.get('secPort'))
})
