const express = require('express')
const morgan = require('morgan')

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

const hostname = 'localhost'
const port = 3000

const app = express()

app.use(morgan('dev'))

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leadership', leaderRouter)

app.use(express.static(__dirname + '/public'))

app.use((req, res, next) => {
	res.statusCode = 404
	res.setHeader('Content-Type', 'text/html')
	res.end('<html><body><h1>Error 404 - Not Found</h1></body></html>')
})

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
