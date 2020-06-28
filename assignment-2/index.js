const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
// const createError = require('http-errors')

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

const createError = require('./utils/errors')

const port = 3000
const hostname = 'localhost'
const app = express()

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

connect
	.then(db => {
		console.log('Connected correctly to Mongo DB server')
	})
	.catch(error => {
		console.log(`Error with Mongo DB: ${error}`)
	})

app.use(logger('dev'))

app.use(express.json()) // only json in all incoming requests (parsed with body-parser internally)

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leadership', leaderRouter)

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
